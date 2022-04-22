import { ActionTree } from 'vuex'
import { StateInterface } from '../index'
import { ChannelsStateInterface } from './state'
import { channelService } from 'src/services'
import { Channel, RawMessage, ExtraChannel } from 'src/contracts'
import ChannelService from 'src/services/ChannelService'

const parseChannel = (channel: ExtraChannel | null) => {
  if (channel) {
    const tempChannel: Channel = {
      createdBy: channel.createdBy,
      id: channel.id,
      messages: [],
      name: channel.name,
      state: channel.state,
      userState: 'none'
    }

    if (channel.invitedAt) tempChannel.userState = 'invited'
    if (channel.joinedAt) tempChannel.userState = 'joined'
    if (channel.kickedAt) tempChannel.userState = 'kicked'
    if (channel.bannedAt) tempChannel.userState = 'banned'
    return tempChannel
  }

  return null
}

// Function to handle commands
const CommandHandler = {
  async handleCommand (state: any, rootState: any, dispatch: any, message: RawMessage, router: any) {
    console.log('handling command', message)

    if (message.trim().startsWith('/join ')) {
      return await this.joinCommand(state, dispatch, message.trim(), router)
    }

    if (message.trim().startsWith('/list')) {
      if (message.trim() !== '/list') {
        return 'Invalid command'
      }
      if (state.active === null) {
        return 'No active channel'
      }
      await this.listCommand(rootState, dispatch)
      return true
    }

    if (message.trim().startsWith('/invite ')) {
      return await this.inviteCommand(message)
    }

    if (message.trim().startsWith('/cancel')) {
      if (message.trim() === '/cancel') {
        return await this.cancelCommand(dispatch, state, router)
      }
    }

    // if (message.trim().startsWith('/kick ')) {
    //   return await this.kickCommand(state, message)
    // }

    return `Unknown command: ${message}`
  },

  async joinCommand (state: any, dispatch: any, message: RawMessage, router: any) {
    let channelName = message.slice(6)

    // If message ends with -p or --private, then it's a private channel
    const isPrivate = message.endsWith(' -p') || message.endsWith(' --private')

    if (message.endsWith(' -p')) {
      channelName = channelName.slice(0, -3)
    } else if (message.endsWith(' --private')) {
      channelName = channelName.slice(0, -10)
    }

    // Check if user already has a channel with that name
    const joinedChannel = channelName in state.channels
    if (joinedChannel && state.channels[channelName].userState === 'joined') {
      return `You are already a member of: ${channelName}`
    }

    const existingChannel = parseChannel(await ChannelService.getChannel(channelName))
    if (!existingChannel) {
      // Create channel
      await dispatch('createChannel', { channelName, isPrivate })
      router.push(`/channel/${channelName}`)
      return true
    }

    // If user is invited to channel, accept invite
    if (existingChannel.userState === 'invited') {
      await dispatch('acceptInvite', channelName)
      router.push(`/channel/${channelName}`)
      return true
    }

    if (existingChannel.state === 'private') {
      return `${channelName} is private, and you're not invited.`
    } else {
      const result = await channelService.joinExisting(channelName)
      console.log('result', result)
      await dispatch('join', channelName)
      router.push(`/channel/${channelName}`)
      return true
    }
  },

  async listCommand (rootState: any, dispatch: any) {
    if (rootState.mainStore.rightDrawerState) {
      dispatch('mainStore/updateRightDrawerState', false, { root: true })
    }
    await this.sleep(150)
    dispatch('mainStore/updateRightDrawerState', true, { root: true })
  },

  // invite az nakoniec lebo treba riesit ci nema ban user nahodou, tak aby sme to vedeli aj otestovat ked sa to bude kodit
  // nefungiruje este
  async inviteCommand (message: RawMessage) {
    const users = await channelService.getAllUsers()
    const currUser = message.slice(8)
    if (!(users.includes(currUser))) {
      return `User ${currUser} does not exist`
    }
    return true
  },

  async cancelCommand (dispatch: any, state: any, router: any) {
    const isOwner = state.channels[state.active].createdBy === state.user.id
    const success = await dispatch('deleteChannel', state.active)
    if (!success) {
      return isOwner ? 'Error deleting channel' : 'Error leaving channel'
    }
    router.push('/')
    return true
  },

  // async kickCommand (state: any, message: RawMessage) {
  //   const channelName = state.active
  //   const nickname = message.slice(6)
  //
  //   return true
  // },

  sleep (ms: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms)
    })
  }
}

const actions: ActionTree<ChannelsStateInterface, StateInterface> = {
  async join ({ commit, dispatch }, channelName: string) {
    try {
      commit('LOADING_START')
      const messages = await channelService.join(channelName).loadMessages()
      const channel = parseChannel(await channelService.getChannel(channelName))
      commit('LOADING_SUCCESS', { channelName, messages, channel })
      await dispatch('setActiveChannel', channelName)
    } catch (err) {
      commit('LOADING_ERROR', err)
      throw err
    }
  },
  // eslint-disable-next-line @typescript-eslint/require-await
  async leave ({ getters, commit }, channelName: string | null) {
    const leaving: string[] = channelName !== null ? [channelName] : getters.joinedChannels

    for (const c of leaving) {
      channelService.leave(c)
      commit('CLEAR_CHANNEL', c)
    }
  },

  async addMessage ({ state, rootState, dispatch, commit }, { channelName, message, router }: { channelName: string, message: RawMessage, router: any }) {
    // If message starts with a slash, it's a command
    if (message.startsWith('/')) {
      return await CommandHandler.handleCommand(state, rootState, dispatch, message, router)
    }

    // No channel - can't send message
    if (state.active === null) {
      return 'no channel'
    }
    const newMessage = await channelService.in(channelName)?.addMessage(message)
    commit('NEW_MESSAGE', { channelName, message: newMessage })

    return true
  },

  async acceptInvite ({ commit, dispatch }, channelName: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    await channelService.acceptInvite(channelName)
    commit('updateUserChannelState', { value: 'joined', channelName })
    await dispatch('setActiveChannel', channelName)
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async declineInvite ({ commit }, channelName: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    await channelService.declineInvite(channelName)
    commit('removeChannel', { channelName })
  },

  async updateState ({ commit }, newState: string) {
    await channelService.updateState(newState)
    return commit('auth/updateActiveState', newState, { root: true })
  },

  async updateNotification ({ commit }, notificationType: string) {
    await channelService.updateNotification(notificationType)
    return commit('auth/updateNotificationType', notificationType, { root: true })
  },

  async createChannel ({ dispatch }, { channelName, isPrivate }: { channelName: string, isPrivate: boolean }) {
    const channel = await channelService.createChannel(channelName, isPrivate)
    if (channel) {
      await dispatch('join', channelName)
      return true
    } else return false
  },

  async deleteChannel ({ commit }, channelName: string) {
    const success = await channelService.deleteChannel(channelName)
    if (success) {
      channelService.leave(channelName)
      commit('CLEAR_CHANNEL', channelName)
      return true
    } else return false
  },

  async setActiveChannel ({ commit }, channelName: string) {
    commit('SET_ACTIVE', channelName)
    console.log('channelName', channelName)
    const users = await channelService.getUsers(channelName)
    commit('SET_USERS', users)
  }
}

export default actions
