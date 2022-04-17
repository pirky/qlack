export type RawMessage = string

export interface Message {
  id: number
  channelId: number
  authorId: number
  author: string
  createdAt: Date
  content: string
}
