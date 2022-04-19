import { Channel } from 'src/contracts'

export interface ChannelsStateInterface {
  loading: boolean,
  error: Error | null,
  channels: { [channel: string]: Channel },
  active: string | null
}

function state (): ChannelsStateInterface {
  return {
    loading: false,
    error: null,
    channels: {},
    active: null
  }
}

export default state
