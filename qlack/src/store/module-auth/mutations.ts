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
  updateId (state: AuthStateInterface, value: number) {
    if (state.user) {
      state.user.id = value
    }
  },
  updateFirstName (state: AuthStateInterface, value: string) {
    if (state.user) {
      state.user.firstName = value
    }
  },
  updateLastName (state: AuthStateInterface, value: string) {
    if (state.user) {
      state.user.lastName = value
    }
  },
  updateNickname (state: AuthStateInterface, value: string) {
    if (state.user) {
      state.user.nickname = value
    }
  },
  updateEmail (state: AuthStateInterface, value: string) {
    if (state.user) {
      state.user.email = value
    }
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
