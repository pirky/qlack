import { GetterTree } from 'vuex'
import { StateInterface } from '../index'
import { ChannelsStateInterface } from './state'

const getters: GetterTree<ChannelsStateInterface, StateInterface> = {
  joinedChannels (context): string[] {
    return Object.keys(context.messages)
  },
  currentMessages (context) {
    return context.active !== null ? context.messages[context.active] : []
  }
}

export default getters
