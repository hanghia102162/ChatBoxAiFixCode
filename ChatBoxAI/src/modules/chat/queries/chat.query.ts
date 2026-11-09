import { useMutation } from '@tanstack/vue-query'
import { ChatService } from '@/modules/chat/api/chat.api'
import type { ChatCompletionRequest } from '@/modules/chat/types/chat.type'

export const useChatMutation = () => {
  return useMutation({
    mutationFn: (values: ChatCompletionRequest) => ChatService.sendMessage(values),
  })
}
