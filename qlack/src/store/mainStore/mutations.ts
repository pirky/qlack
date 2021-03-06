import { MutationTree } from 'vuex'
import { MainStateInterface } from './state'

const mutation: MutationTree<MainStateInterface> = {
  updateLeftDrawerState (state: MainStateInterface, value: boolean) {
    state.leftDrawerState = value
  },
  updateRightDrawerState (state: MainStateInterface, value: boolean) {
    state.rightDrawerState = value
  },
  updateCreateChannelDialog (state: MainStateInterface, value: boolean) {
    state.createChannelDialog = value
  }
}

export default mutation
