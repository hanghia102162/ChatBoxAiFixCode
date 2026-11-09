<script setup lang="ts">
import { Bot, Menu, Moon, Plus, Sun } from 'lucide-vue-next'
import { nextTick, onMounted, ref } from 'vue'
import Sidebar from '@/components/sidebar.vue'
import ChatInput from '../components/ChatInput.vue'
import type { ChatMessage } from '../types/chat.type'

type VisibleMessage = ChatMessage & { id: number }

const welcomeMessage = 'Chào bạn! Mình là  . Hãy gửi câu hỏi, đoạn code hoặc lỗi bạn đang gặp nhé.'
const messages = ref<VisibleMessage[]>([{ id: 1, role: 'assistant', content: welcomeMessage }])
const sidebarOpen = ref(false)
const messageViewport = ref<HTMLElement | null>(null)
const isDark = ref(true)
const isLoading = ref(false)
const error = ref('')
let nextMessageId = 2

const apiReady = true

function scrollToNewestMessage() {
  nextTick(() =>
    messageViewport.value?.scrollTo({
      top: messageViewport.value.scrollHeight,
      behavior: 'smooth',
    }),
  )
}

function applyTheme(dark: boolean) {
  isDark.value = dark
  document.documentElement.classList.toggle('light', !dark)
  localStorage.setItem('chatbox-theme', dark ? 'dark' : 'light')
}

function newConversation() {
  if (isLoading.value) return
  messages.value = [{ id: nextMessageId++, role: 'assistant', content: welcomeMessage }]
  error.value = ''
  sidebarOpen.value = false
}

function sendMessage(content: string) {
  if (isLoading.value) return
  error.value = ''
  messages.value.push({ id: nextMessageId++, content, role: 'user' })
  scrollToNewestMessage()
}

function startReply() {
  messages.value.push({ id: nextMessageId++, role: 'assistant', content: '' })
  scrollToNewestMessage()
}

function appendReply(chunk: string) {
  const reply = messages.value.at(-1)
  if (reply?.role === 'assistant') {
    reply.content += chunk
  }
  scrollToNewestMessage()
}

function receiveRequestError(message: string) {
  error.value = message
  scrollToNewestMessage()
}

function setPending(value: boolean) {
  isLoading.value = value
}

onMounted(() => applyTheme(localStorage.getItem('chatbox-theme') !== 'light'))
</script>

<template>
  <div class="flex h-screen overflow-hidden bg-background text-foreground">
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 z-30 bg-black/50 md:hidden"
      aria-hidden="true"
      @click="sidebarOpen = false"
    />
    <Sidebar :mobile-open="sidebarOpen" @close="sidebarOpen = false" @new-chat="newConversation" />

    <main id="chat" class="flex min-w-0 flex-1 flex-col">
      <header class="flex h-16 items-center justify-between gap-3 border-b px-4 sm:px-8">
        <div class="flex min-w-0 items-center gap-3">
          <button
            type="button"
            class="inline-flex size-9 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-accent md:hidden"
            aria-label="Mở thanh bên"
            @click="sidebarOpen = true"
          >
            <Menu class="size-5" />
          </button>
          <div class="min-w-0">
            <h1 class="truncate text-base font-semibold">Trò chuyện với CodeMate</h1>
            <p class="hidden text-sm text-muted-foreground sm:block">
              Hỏi về code, lỗi hoặc ý tưởng dự án của bạn
            </p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button
            type="button"
            class="inline-flex h-9 items-center gap-1.5 rounded-md border px-3 text-sm hover:bg-accent disabled:opacity-50"
            :disabled="isLoading"
            @click="newConversation"
          >
            <Plus class="size-4" /><span class="hidden sm:inline">Đoạn chat mới</span>
          </button>
          <button
            type="button"
            class="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground hover:bg-accent"
            :aria-label="isDark ? 'Bật giao diện sáng' : 'Bật giao diện tối'"
            @click="applyTheme(!isDark)"
          >
            <Sun v-if="isDark" class="size-4" /><Moon v-else class="size-4" />
          </button>
          <span
            class="size-2 rounded-full"
            :class="apiReady ? 'bg-emerald-400' : 'bg-amber-400'"
            :title="apiReady ? 'Đã cấu hình API' : 'Chưa cấu hình API'"
          />
        </div>
      </header>

      <div ref="messageViewport" class="flex-1 overflow-y-auto">
        <div
          class="mx-auto flex min-h-full w-full max-w-4xl flex-col px-4 py-6 sm:px-8 sm:py-8 lg:px-12"
        >
          <section class="my-auto space-y-5">
            <article
              v-for="message in messages"
              :key="message.id"
              class="flex gap-3"
              :class="message.role === 'user' ? 'justify-end' : ''"
            >
              <span
                v-if="message.role === 'assistant'"
                class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground"
                ><Bot class="size-4"
              /></span>
              <p
                class="max-w-[85%] whitespace-pre-wrap rounded-2xl border px-4 py-3 text-[15px] leading-7"
                :class="
                  message.role === 'user'
                    ? 'rounded-br-md border-primary bg-primary text-primary-foreground'
                    : 'rounded-tl-md bg-muted/35'
                "
              >
                {{ message.content }}
                <span
                  v-if="isLoading && message.role === 'assistant' && message === messages.at(-1)"
                  class="ml-1 inline-block h-4 w-1 animate-pulse bg-current align-[-2px]"
                  aria-label="Đang nhận phản hồi"
                />
              </p>
            </article>
            <div v-if="isLoading && messages.at(-1)?.role !== 'assistant'" class="flex items-center gap-3 text-sm text-muted-foreground">
              <span
                class="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"
                ><Bot class="size-4" /></span
              ><span class="animate-pulse">CodeMate đang trả lời…</span>
            </div>
            <p
              v-if="error"
              role="alert"
              class="rounded-lg border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-300"
            >
              {{ error }}
            </p>
          </section>
        </div>
      </div>

      <footer class="shrink-0 border-t bg-background/95 px-4 py-3 backdrop-blur sm:px-8">
        <div class="mx-auto w-full max-w-4xl lg:px-12">
          <ChatInput
            :disabled="isLoading"
            @send="sendMessage"
            @reply-start="startReply"
            @reply-chunk="appendReply"
            @request-error="receiveRequestError"
            @pending="setPending"
          />
          <p v-if="!apiReady" class="mt-2 text-center text-xs text-amber-400">
            Chưa có API URL — tạo tệp <code>.env.local</code> theo <code>.env.example</code>.
          </p>
        </div>
      </footer>
    </main>
  </div>
</template>
