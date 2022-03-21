import { ActionTree } from 'vuex'
import { StateInterface } from '../index'
import { ChannelStateInterface } from './state'

const actions: ActionTree<ChannelStateInterface, StateInterface> = {
  someAction (/* context */) {
    // your code
  }
}

export default actions
