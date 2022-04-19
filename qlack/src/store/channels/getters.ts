import { GetterTree } from 'vuex'
import { StateInterface } from '../index'
import { ChannelsStateInterface } from './state'

const getters: GetterTree<ChannelsStateInterface, StateInterface> = {
  joinedChannels (context): string[] {
    return Object.keys(context.channels)
  },
  currentMessages (context) {
    return context.active !== null ? context.channels[context.active].messages : []
  },
  activeChannel: (state: ChannelsStateInterface) => (channelName: string) => {
    return state.channels ? state.channels[channelName] : null
  }
}

export default getters
