import { GetterTree } from 'vuex'
import { StateInterface } from '../index'
import { AuthStateInterface } from './state'

const getters: GetterTree<AuthStateInterface, StateInterface> = {
  isAuthenticated (context): boolean {
    return context.user !== null
  },
  id (state: AuthStateInterface) {
    return state.user ? state.user.id : null
  },
  firstName (state: AuthStateInterface) {
    return state.user ? state.user.firstName : null
  },
  lastName (state: AuthStateInterface) {
    return state.user ? state.user.lastName : null
  },
  nickname (state: AuthStateInterface) {
    return state.user ? state.user.nickname : null
  },
  email (state: AuthStateInterface) {
    return state.user ? state.user.email : null
  },
  notificationType (state: AuthStateInterface) {
    return state.user ? state.user.notificationType : null
  },
  activeState (state: AuthStateInterface) {
    return state.user ? state.user.activeState : null
  }
}

export default getters
