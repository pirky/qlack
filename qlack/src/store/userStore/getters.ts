import { GetterTree } from 'vuex'
import { StateInterface } from '../index'
import { UserStateInterface } from './state'

const getters: GetterTree<UserStateInterface, StateInterface> = {
  id (state: UserStateInterface) {
    return state.id
  },
  firstName (state: UserStateInterface) {
    return state.firstName
  },
  lastName (state: UserStateInterface) {
    return state.lastName
  },
  nickname (state: UserStateInterface) {
    return state.nickname
  },
  email (state: UserStateInterface) {
    return state.email
  },
  notificationType (state: UserStateInterface) {
    return state.notificationType
  },
  state (state: UserStateInterface) {
    return state.state
  }
}

export default getters