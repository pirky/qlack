import { ActionTree } from 'vuex'
import { StateInterface } from '../index'
import { ChannelsStateInterface } from './state'
import { channelService } from 'src/services'
import { RawMessage } from 'src/contracts'

const actions: ActionTree<ChannelsStateInterface, StateInterface> = {
  async join ({ commit }, channelName: string) {
    try {
      commit('LOADING_START')
      const messages = await channelService.join(channelName).loadMessages()
      const channel = await channelService.getChannel(channelName)
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
    const newMessage = await channelService.in(channelName)?.addMessage(message)
    commit('NEW_MESSAGE', { channelName, message: newMessage })
  }
}

export default actions
