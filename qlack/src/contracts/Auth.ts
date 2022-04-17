import { Channel } from 'src/contracts/Channel'

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
