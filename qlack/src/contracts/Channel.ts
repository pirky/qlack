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
