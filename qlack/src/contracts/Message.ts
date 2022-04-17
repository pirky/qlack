export type RawMessage = string

export interface Message {
  id: number
  authorId: number
  authorNickname: string
  sendTime: Date
  content: string
}
