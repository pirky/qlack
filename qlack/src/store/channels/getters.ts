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
  activeChannel: (state: ChannelsStateInterface, context) => (channelName: string) => {
    return state.channels && context.active !== null ? state.channels[channelName] : null
  },

  channelById: (state: ChannelsStateInterface) => (channelId: number) => {
    const channel = Object.values(state.channels).find(x => x.id === channelId)
    return channel
  }
}

export default getters
