import { ChannelStateInterface } from '../channelStore/state'

export interface UserStateInterface {
  id: number
  firstName: string
  lastName: string
  nickname: string
  email: string
  notificationType: string
  state: string

  channels: ChannelStateInterface[]
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
    channels: []
  }
}

export default state
