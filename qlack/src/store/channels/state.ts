import { Channel, Message } from 'src/contracts'

export interface ChannelsStateInterface {
  loading: boolean,
  error: Error | null,
  channels: { [channel: string]: Channel },
  latestMessage: Message | null,
  active: string | null,
  users: { nickname: string, activeState: string}[]
}

function state (): ChannelsStateInterface {
  return {
    loading: false,
    error: null,
    channels: {},
    latestMessage: null,
    active: null,
    users: []
  }
}

export default state
