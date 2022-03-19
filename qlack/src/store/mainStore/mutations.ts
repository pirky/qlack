import { MutationTree } from 'vuex';
// @ts-ignore
import { MainStateInterface } from './state';

const mutation: MutationTree<MainStateInterface> = {
  updateLeftDrawerOpen(state: MainStateInterface) {
    state.leftDrawerState = !state.leftDrawerState;
  },
  updateRightDrawerOpen(state: MainStateInterface, value: boolean) {
    state.rightDrawerState = value;
  }
};

export default mutation;
