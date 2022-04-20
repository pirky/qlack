import { User } from 'src/contracts'
import { MutationTree } from 'vuex'
import { AuthStateInterface } from './state'

const mutation: MutationTree<AuthStateInterface> = {
  AUTH_START (state) {
    state.status = 'pending'
    state.errors = []
  },
  AUTH_SUCCESS (state, user: User | null) {
    state.status = 'success'
    state.user = user
  },
  AUTH_ERROR (state, errors) {
    state.status = 'error'
    state.errors = errors
  },
  updateNotificationType (state: AuthStateInterface, value: string) {
    if (state.user) {
      state.user.notificationType = value
    }
  },
  updateActiveState (state: AuthStateInterface, value: string) {
    if (state.user) {
      state.user.activeState = value
    }
  }
}

export default mutation
