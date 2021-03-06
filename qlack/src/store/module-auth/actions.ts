import { ActionTree } from 'vuex'
import { StateInterface } from '../index'
import { AuthStateInterface } from './state'
import { authService, authManager } from 'src/services'
import { LoginCredentials, RegisterData } from 'src/contracts'

const actions: ActionTree<AuthStateInterface, StateInterface> = {
  async check ({ state, commit, dispatch }) {
    try {
      console.log('CHECK CLIENT')
      commit('AUTH_START')
      const userBefore = state.user
      const user = await authService.me()

      commit('AUTH_SUCCESS', user)

      if (user?.id !== userBefore?.id) {
        const channelNames = await authService.getChannelNames()
        for (const channelName of channelNames) {
          await dispatch('channels/join', channelName, { root: true })
        }
      }

      return user !== null
    } catch (err) {
      commit('AUTH_ERROR', err)
      throw err
    }
  },

  async register ({ commit }, form: RegisterData) {
    try {
      console.log('REG CLIENT')
      commit('AUTH_START')
      const data = await authService.register(form)
      if ('error' in data) {
        commit('AUTH_ERROR', data)
        return false
      }
      commit('AUTH_SUCCESS', data.user)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      authManager.setToken(data.apiToken.token)
      return data.user
    } catch (err) {
      commit('AUTH_ERROR', err)
      throw err
    }
  },

  async login ({ commit }, credentials: LoginCredentials) {
    try {
      console.log('LOGIN CLIENT')
      commit('AUTH_START')
      const apiToken = await authService.login(credentials)
      commit('AUTH_SUCCESS', null)
      // save api token to local storage and notify listeners
      authManager.setToken(apiToken.token)
      return apiToken
    } catch (err) {
      commit('AUTH_ERROR', err)
      throw err
    }
  },

  async logout ({ commit, dispatch }) {
    try {
      console.log('LOGOUT CLIENT')
      commit('AUTH_START')
      await authService.logout()
      await dispatch('channels/leave', null, { root: true })
      commit('AUTH_SUCCESS', null)
      // remove api token and notify listeners
      authManager.removeToken()
    } catch (err) {
      commit('AUTH_ERROR', err)
      throw err
    }
  }
}

export default actions
