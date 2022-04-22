import { User } from '.'

export type RawMessage = string

export interface Message {
  id: number
  channelId: number
  authorId: number
  author: User
  createdAt: Date
  content: string
}
