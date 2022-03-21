export interface MessageInterface {
  id: number
  authorId: number
  sendTime: Date
  content: string
}

export interface ChannelStateInterface {
  id: number
  name: string
  state: string
  createdBy: number

  // user_channels
  userState: string

  // channel_messages
  messages: MessageInterface[]
}

function state (): ChannelStateInterface {
  return {
    id: 0,
    name: 'Lipsum',
    state: 'private',
    createdBy: 0,

    // user_channels
    userState: 'joined',

    // channel_messages
    messages: []
  }
}

export default state
