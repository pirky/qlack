import { GetterTree } from 'vuex'
import { StateInterface } from '../index'
import { channelStateInterface } from './state'

const getters: GetterTree<channelStateInterface, StateInterface> = {
  id (state: channelStateInterface) {
    return state.id
  },
  name (state: channelStateInterface) {
    return state.name
  },
  state (state: channelStateInterface) {
    return state.state
  },
  createdBy (state: channelStateInterface) {
    return state.createdBy
  },

  userState (state: channelStateInterface) {
    return state.userState
  },

  messages (state: channelStateInterface) {
    return state.messages
  },
}

export default getters
