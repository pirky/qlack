import { ActionTree } from 'vuex'
import { StateInterface } from '../index'
import { ChannelsStateInterface } from './state'
import { channelService } from 'src/services'
import { Channel, RawMessage, ExtraChannel } from 'src/contracts'

// Function to handle commands
const handleCommand = (message: RawMessage) => {
  if (!message.startsWith('/')) {
    return false
  }
  console.log('handling command', message)

  if (message.startsWith('/join ')) {
    const channelName = message.slice(6)
    console.log('channelName:', channelName)
    return true
  }
  return false
}

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

const actions: ActionTree<ChannelsStateInterface, StateInterface> = {
  async join ({ commit }, channelName: string) {
    try {
      commit('LOADING_START')
      const messages = await channelService.join(channelName).loadMessages()
      const channel = parseChannel(await channelService.getChannel(channelName))
      commit('LOADING_SUCCESS', { channelName, messages, channel })
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

  async addMessage ({ state, commit }, { channelName, message }: { channelName: string, message: RawMessage }) {
    // If message starts with a slash, it's a command
    if (!handleCommand(message)) {
      if (state.active === null) {
        return false
      }
      const newMessage = await channelService.in(channelName)?.addMessage(message)
      commit('NEW_MESSAGE', { channelName, message: newMessage })
    }
    return true
  },

  async acceptInvite ({ commit }, channelName: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    await channelService.acceptInvite(channelName, this.getters['auth/id'])
    commit('updateUserChannelState', { value: 'joined', channelName })
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async declineInvite ({ commit }, channelName: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    await channelService.declineInvite(channelName, this.getters['auth/id'])
    commit('removeChannel', { channelName })
  },

  async createChannel ({ dispatch }, { channelName, isPrivate }: { channelName: string, isPrivate: boolean }) {
    const channel = await channelService.createChannel(channelName, isPrivate)
    if (channel) {
      await dispatch('channels/join', channelName, { root: true })
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
  }
}

export default actions
