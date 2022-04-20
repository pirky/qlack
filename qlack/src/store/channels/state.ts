import { Channel } from 'src/contracts'

export interface ChannelsStateInterface {
  loading: boolean,
  error: Error | null,
  channels: { [channel: string]: Channel },
  active: string | null,
  users: [{ nickname: string, activeState: string}] | null
}

function state (): ChannelsStateInterface {
  return {
    loading: false,
    error: null,
    channels: {},
    active: null,
    users: null
  }
}

export default state
