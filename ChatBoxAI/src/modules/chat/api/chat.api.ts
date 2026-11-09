import { httpService } from '@/service/http.service'
import type { ChatCompletionRequest, ChatCompletionResponse } from '../types/chat.type'

export const CHAT_URL = {
  SEND_MESSAGE: import.meta.env.VITE_CHAT_API_PATH || '/api/chat',
}

export class ChatService {
  static sendMessage(data: ChatCompletionRequest) {
    return httpService.postRaw<ChatCompletionResponse, ChatCompletionRequest>(
      CHAT_URL.SEND_MESSAGE,
      data,
    )
  }
}
