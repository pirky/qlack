import { Message, Channel } from 'src/contracts'
import { MutationTree } from 'vuex'
import { ChannelsStateInterface } from './state'

const mutation: MutationTree<ChannelsStateInterface> = {
  LOADING_START (state) {
    state.loading = true
    state.error = null
  },
  LOADING_SUCCESS (state, { channelName, messages, channel }: { channelName: string, messages: Message[], channel: Channel }) {
    state.loading = false
    state.channels[channelName] = channel
    state.channels[channelName].messages = messages
  },
  LOADING_ERROR (state, error) {
    state.loading = false
    state.error = error
  },
  CLEAR_CHANNEL (state, channelName: string) {
    state.active = null
    delete state.channels[channelName]
  },
  SET_ACTIVE (state, channelName: string) {
    state.active = channelName
  },
  NEW_MESSAGE (state, { channelName, message }: { channelName: string, message: Message }) {
    state.channels[channelName].messages.push(message)
  },
  updateUserChannelState (state: ChannelsStateInterface, { value, channelName }: { value: string, channelName: string }) {
    if (state.channels) {
      state.channels[channelName].userState = value
    }
  },
  removeChannel (state: ChannelsStateInterface, { channelName }: { channelName: string }) {
    if (state.channels) {
      delete state.channels[channelName]
    }
  }
}

export default mutation
