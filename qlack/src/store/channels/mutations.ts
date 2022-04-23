import { Message, Channel } from 'src/contracts'
import { MutationTree } from 'vuex'
import { ChannelsStateInterface } from './state'

const mutation: MutationTree<ChannelsStateInterface> = {
  LOADING_START (state) {
    state.loading = true
    state.error = null
  },
  LOADING_SUCCESS (state, { channelName, channel }: { channelName: string, messages: Message[], channel: Channel }) {
    state.loading = false
    state.channels[channelName] = channel
    state.channels[channelName].messages = []
  },
  LOADING_ERROR (state, error) {
    state.loading = false
    state.error = error
  },
  CLEAR_CHANNEL (state, channelName: string) {
    state.active = null
    delete state.channels[channelName]
  },
  SET_ACTIVE (state, channelName) {
    state.active = channelName
    state.channels[channelName].messages = []
  },
  SET_USERS (state, users: [{ nickname: string, activeState: string}]) {
    state.users = users
  },
  LOAD_MESSAGES (state, { channelName, messages }: { channelName: string, messages: Message[] }) {
    state.channels[channelName].messages.splice(0, 0, ...messages)
  },
  NEW_MESSAGE (state, { channelName, message }: { channelName: string, message: Message }) {
    state.channels[channelName].messages.push(message)
    state.latestMessage = message
  },
  CHANGE_USER_STATE (state, { nickname, activeState }: { nickname: string, activeState: string }) {
    if (state.users) {
      for (const user of state.users) {
        if (user.nickname === nickname) {
          user.activeState = activeState
        }
      }
    }
  },
  UPDATE_USER_CHANNEL_STATE (state: ChannelsStateInterface, { value, channelName }: { value: string, channelName: string }) {
    if (state.channels) {
      state.channels[channelName].userState = value
    }
  },
  KICK_USER (state: ChannelsStateInterface, { victimNickname, channelName }: { victimNickname: string, channelName: string }) {
    let users: { nickname: string, activeState: string }[] = []
    if (state.active === channelName && state.users) {
      for (const user of state.users) {
        if (user.nickname !== victimNickname) {
          if (!users) users = [user]
          else users.push(user)
        }
      }
      state.users = users
    }
  }
}

export default mutation
