import { Message } from 'src/contracts/Message'

export interface Channel {
  id: number
  name: string
  state: string
  createdBy: number

  // user_channels
  userState: string

  // channel_messages
  messages: Message[]
}

export interface ExtraChannel {
  id: number
  name: string
  state: string
  createdBy: number

  invitedAt: Date
  joinedAt: Date
  kickedAt: Date
  bannedAt: Date
}
