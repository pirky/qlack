import { ActionTree } from 'vuex'
import { StateInterface } from '../index'
import { ChannelsStateInterface } from './state'
import { channelService } from 'src/services'
import { Channel, RawMessage, ExtraChannel } from 'src/contracts'

// Function to handle commands
const handleCommand = (message: RawMessage) => {
  console.log('handling command', message)
}

const parseChannel = (channel: ExtraChannel | null) => {
  if (channel) {
    console.log('daco: ', channel)
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

    leaving.forEach((c) => {
      channelService.leave(c)
      commit('CLEAR_CHANNEL', c)
    })
  },

  async addMessage ({ commit }, { channelName, message }: { channelName: string, message: RawMessage }) {
    // If message starts with a slash, it's a command
    if (message?.startsWith('/')) {
      handleCommand(message)
    } else {
      const newMessage = await channelService.in(channelName)?.addMessage(message)
      commit('NEW_MESSAGE', { channelName, message: newMessage })
    }
  }
}

export default actions
