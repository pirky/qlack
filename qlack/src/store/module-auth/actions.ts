import { ActionTree } from 'vuex'
import { StateInterface } from '../index'
import { AuthStateInterface } from './state'
import { authService, authManager, channelService } from 'src/services'
import { Channel, LoginCredentials, RegisterData } from 'src/contracts'

const actions: ActionTree<AuthStateInterface, StateInterface> = {
  async check ({ commit }) {
    try {
      console.log('CHECK CLIENT')
      commit('AUTH_START')

      const data = await authService.me()
      const user = data ? data.user : null
      const channels = data ? data.channels : null

      if (user && channels) {
        const newChannels: Channel[] = []

        channels.forEach(function (channel) {
          const tempChannel: Channel = {
            createdBy: channel.createdBy,
            id: channel.id,
            messages: [],
            name: channel.name,
            state: channel.state,
            userState: 'aaa'
          }

          if (channel.invitedAt) tempChannel.userState = 'invited'
          if (channel.joinedAt) tempChannel.userState = 'joined'
          if (channel.kickedAt) tempChannel.userState = 'kicked'
          if (channel.bannedAt) tempChannel.userState = 'banned'

          newChannels.push(tempChannel)
        })
        user.channels = newChannels
      }

      commit('AUTH_SUCCESS', user)
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

  async logout ({ commit }) {
    try {
      console.log('LOGOUT CLIENT')
      commit('AUTH_START')
      await authService.logout()
      commit('AUTH_SUCCESS', null)
      // remove api token and notify listeners
      authManager.removeToken()
    } catch (err) {
      commit('AUTH_ERROR', err)
      throw err
    }
  },

  async acceptInvite ({ commit }, id: number) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    await channelService.acceptInvite(id, this.getters['auth/id'])
    commit('updateUserChannelState', { value: 'joined', id: id })
  }
}

export default actions
