import { ActionTree } from 'vuex'
import { StateInterface } from '../index'
import { MainStateInterface } from './state'

const actions: ActionTree<MainStateInterface, StateInterface> = {
  updateRightDrawerState ({ commit }, newState) {
    commit('updateRightDrawerState', newState)
  }
}

export default actions
