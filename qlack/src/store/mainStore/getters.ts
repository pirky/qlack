import { GetterTree } from 'vuex'
import { StateInterface } from '../index'
import { MainStateInterface } from './state'

const getters: GetterTree<MainStateInterface, StateInterface> = {
  leftSideDrawer (state: MainStateInterface) {
    return state.leftDrawerState
  },
  rightSideDrawer (state: MainStateInterface) {
    return state.rightDrawerState
  }
}

export default getters
