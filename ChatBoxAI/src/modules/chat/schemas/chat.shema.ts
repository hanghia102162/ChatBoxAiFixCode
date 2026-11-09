import { z } from 'zod'

export const chatFormSchema = z.object({
  message: z
    .string()
    .trim()
    .min(1, 'Vui lòng nhập tin nhắn trước khi gửi.')
    .max(10_000, 'Tin nhắn không được vượt quá 10.000 ký tự.'),
})

export type ChatFormValues = z.infer<typeof chatFormSchema>
