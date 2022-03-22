export interface MessageInterface {
  id: number
  authorId: number
  sendTime: Date
  content: string
}

export interface ChannelInterface {
  id: number
  name: string
  state: string
  createdBy: number

  // user_channels
  userState: string

  // channel_messages
  messages: MessageInterface[]
}

export interface UserStateInterface {
  id: number
  firstName: string
  lastName: string
  nickname: string
  email: string
  notificationType: string
  state: string

  channels: ChannelInterface[]
}

function state (): UserStateInterface {
  return {
    id: 0,
    firstName: 'Arnost',
    lastName: 'Kabel',
    nickname: 'kablis',
    email: 'arnost@kabel.com',
    notificationType: 'all',
    state: 'online',
    channels: [
      {
        id: 0,
        name: 'First module-channel ever',
        state: 'public',
        createdBy: 0,
        userState: 'joined',
        messages: []
      },
      {
        id: 1,
        name: 'Lipsum',
        state: 'private',
        createdBy: 0,
        userState: 'joined',
        messages: []
      },
      {
        id: 2,
        name: 'Tuna kto',
        state: 'public',
        createdBy: 0,
        userState: 'joined',
        messages: []
      }
    ]
  }
}

export default state
