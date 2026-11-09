<script setup lang="ts">
import { ArrowUp, LoaderCircle } from 'lucide-vue-next'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { CHAT_URL } from '../api/chat.api'
import { chatFormSchema } from '../schemas/chat.shema'

const props = defineProps<{ disabled?: boolean }>()
const emit = defineEmits<{
  send: [message: string]
  'reply-start': []
  'reply-chunk': [chunk: string]
  'request-error': [message: string]
  pending: [value: boolean]
}>()

const { handleSubmit, errors, defineField, isSubmitting, resetForm } = useForm({
  validationSchema: toTypedSchema(chatFormSchema),
  initialValues: { message: '' },
})
const [message, messageAttrs] = defineField('message')

function getChatUrl() {
  const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ?? ''
  const path = CHAT_URL.SEND_MESSAGE
  return /^https?:\/\//.test(path) ? path : `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`
}

function readChunk(payload: unknown): string {
  if (typeof payload === 'string') return payload
  if (!payload || typeof payload !== 'object') return ''

  const data = payload as Record<string, unknown>
  const directValue = data.answer ?? data.content ?? data.token ?? data.text
  if (typeof directValue === 'string') return directValue

  const delta = data.delta
  if (typeof delta === 'string') return delta
  if (delta && typeof delta === 'object' && typeof (delta as Record<string, unknown>).content === 'string') {
    return (delta as Record<string, unknown>).content as string
  }

  const choice = Array.isArray(data.choices) ? data.choices[0] : undefined
  if (choice && typeof choice === 'object') {
    const choiceData = choice as Record<string, unknown>
    if (typeof choiceData.text === 'string') return choiceData.text
    if (choiceData.delta && typeof choiceData.delta === 'object') {
      const content = (choiceData.delta as Record<string, unknown>).content
      if (typeof content === 'string') return content
    }
  }

  return ''
}

function parsePayload(value: string) {
  const payload = value.trim()
  if (!payload || payload === '[DONE]') return ''
  try {
    return readChunk(JSON.parse(payload))
  } catch {
    return payload
  }
}

async function readStream(response: Response) {
  if (!response.body) throw new Error('Trình duyệt không hỗ trợ phản hồi dạng stream.')

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  const isEventStream = response.headers.get('content-type')?.includes('text/event-stream')
  const isNdjson = response.headers.get('content-type')?.includes('ndjson')
  let buffer = ''
  let receivedContent = false

  const emitChunk = (value: string) => {
    if (!value) return
    if (!receivedContent) {
      emit('reply-start')
      receivedContent = true
    }
    emit('reply-chunk', value)
  }

  while (true) {
    const { value, done } = await reader.read()
    const decoded = decoder.decode(value, { stream: !done })

    // A plain text streaming endpoint has no event delimiter. In that case,
    // every network chunk is safe to paint immediately.
    if (!isEventStream && !isNdjson) {
      emitChunk(decoded)
      if (done) break
      continue
    }

    buffer += decoded

    const separator = isEventStream ? /\r?\n\r?\n/ : /\r?\n/
    const entries = buffer.split(separator)
    buffer = entries.pop() ?? ''

    for (const entry of entries) {
      const data = isEventStream
        ? entry
            .split(/\r?\n/)
            .filter((line) => line.startsWith('data:'))
            .map((line) => line.slice(5).trimStart())
            .join('\n')
        : entry
      emitChunk(isNdjson || isEventStream ? parsePayload(data) : data)
    }

    if (done) break
  }

  if (buffer) emitChunk(isNdjson || isEventStream ? parsePayload(buffer) : buffer)
  if (!receivedContent) throw new Error('API không trả về nội dung phản hồi.')
}

const onSubmit = handleSubmit(async (values) => {
  if (props.disabled) return

  emit('send', values.message)
  emit('pending', true)

  try {
    const response = await fetch(getChatUrl(), {
      method: 'POST',
      headers: {
        Accept: 'text/event-stream, application/x-ndjson, application/json, text/plain',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: values.message, code: '' }),
    })
    if (!response.ok) {
      const detail = await response.text()
      throw new Error(detail || `API trả về lỗi ${response.status}.`)
    }

    if (response.headers.get('content-type')?.includes('application/json')) {
      const body = (await response.json()) as { answer?: string; detail?: string }
      if (!body.answer) throw new Error(body.detail || 'API không trả về nội dung phản hồi.')
      emit('reply-start')
      emit('reply-chunk', body.answer.trim())
    } else {
      await readStream(response)
    }
    resetForm()
  } catch (error) {
    emit('request-error', error instanceof Error ? error.message : 'Unable to call the AI API.')
  } finally {
    emit('pending', false)
  }
})
</script>

<template>
  <form
    class="relative rounded-xl border bg-background p-2 shadow-lg shadow-black/10"
    @submit.prevent="onSubmit"
  >
    <Textarea
      v-model="message"
      v-bind="messageAttrs"
      rows="1"
      placeholder="Nhắn tin cho CodeMate..."
      aria-label="Tin nhắn"
      :aria-invalid="Boolean(errors.message)"
      :disabled="disabled || isSubmitting"
      class="max-h-40 min-h-6 resize-none border-0 bg-transparent px-2 py-1 text-[15px] leading-5 shadow-none focus-visible:ring-0"
      :class="{ 'text-red-400': errors.message }"
      @keydown.enter.exact.prevent="onSubmit"
    />
    <p v-if="errors.message" class="px-2 pt-1 text-xs font-medium text-red-400">
      {{ errors.message }}
    </p>
    <div class="flex items-center justify-between px-1 pt-1">
      <p class="text-xs text-muted-foreground">Enter để gửi · Shift + Enter xuống dòng</p>
      <Button
        type="submit"
        size="icon"
        class="size-8"
        :disabled="disabled || isSubmitting"
        aria-label="Gửi tin nhắn"
      >
        <LoaderCircle v-if="disabled || isSubmitting" class="size-4 animate-spin" />
        <ArrowUp v-else class="size-4" />
      </Button>
    </div>
  </form>
</template>
