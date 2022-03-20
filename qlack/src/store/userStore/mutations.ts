import { MutationTree } from 'vuex'
import { UserStateInterface } from './state'

const mutation: MutationTree<UserStateInterface> = {
  updateId (state: UserStateInterface, value: number) {
    state.id = value
  },
  updateFirstName (state: UserStateInterface, value: string) {
    state.firstName = value
  },
  updateLastName (state: UserStateInterface, value: string) {
    state.lastName = value
  },
  updateNickname (state: UserStateInterface, value: string) {
    state.nickname = value
  },
  updateEmail (state: UserStateInterface, value: string) {
    state.email = value
  },
  updateNotificationType (state: UserStateInterface, value: string) {
    state.notificationType = value
  },
  updateState (state: UserStateInterface, value: string) {
    state.state = value
  }
}

export default mutation
