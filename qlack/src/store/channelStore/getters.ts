import { GetterTree } from 'vuex'
import { StateInterface } from '../index'
import { ChannelStateInterface } from './state'

const getters: GetterTree<ChannelStateInterface, StateInterface> = {
  id (state: ChannelStateInterface) {
    return state.id
  },
  name (state: ChannelStateInterface) {
    return state.name
  },
  state (state: ChannelStateInterface) {
    return state.state
  },
  createdBy (state: ChannelStateInterface) {
    return state.createdBy
  },

  userState (state: ChannelStateInterface) {
    return state.userState
  },

  messages (state: ChannelStateInterface) {
    return state.messages
  }
}

export default getters
