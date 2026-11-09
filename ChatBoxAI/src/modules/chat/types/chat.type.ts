export type ChatRole = 'system' | 'user' | 'assistant'

export interface ChatMessage {
  role: ChatRole
  content: string
}
export interface ChatCompletionRequest {
  message: string
  code: string
}

export interface ChatCompletionResponse {
  answer?: string
  detail?: string
}
