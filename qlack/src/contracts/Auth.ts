export interface ApiToken {
  type: 'bearer'
  token: string
  expiresAt?: string
  expiresIn?: number
}

export interface RegisterData {
  email: string
  password: string
  passwordConfirmation: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface Message {
  id: number
  authorId: number
  authorNickname: string
  sendTime: Date
  content: string
}

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

export interface User {
  id: number
  firstName: string
  lastName: string
  nickname: string
  email: string
  notificationType: string
  activeState: string

  channels: Channel[]
}
