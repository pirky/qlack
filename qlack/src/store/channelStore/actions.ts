import { ActionTree } from 'vuex'
import { StateInterface } from '../index'
import { channelStateInterface } from './state'

const actions: ActionTree<channelStateInterface, StateInterface> = {
  someAction (/* context */) {
    // your code
  }
}

export default actions
