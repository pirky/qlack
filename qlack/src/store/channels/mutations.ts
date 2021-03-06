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
    if (!state.channels[channelName]) {
      state.channels[channelName] = channel
    } else {
      state.channels[channelName].messages = []
    }
  },
  LOADING_ERROR (state, error) {
    state.loading = false
    state.error = error
  },
  DELETE_CHANNEL (state, channelName: string) {
    delete state.channels[channelName]
  },
  CLEAR_CHANNEL (state, channelName: string) {
    state.active = null
    state.users = []
    state.writingUsers = []
    delete state.channels[channelName]
  },
  SET_ACTIVE (state, channelName) {
    if (state.active) {
      state.channels[state.active].messages = []
    }
    state.active = channelName
    state.writingUsers = []
    state.channels[channelName].messages = []
  },
  SET_USERS (state, users: [{ nickname: string, activeState: string}]) {
    state.users = users
  },
  ADD_USER (state, { userNickname, activeState }: { userNickname: string, activeState: string}) {
    state.users.push({ nickname: userNickname, activeState })
  },
  ADD_CHANNEL (state, { channel }: { channel: Channel }) {
    state.channels[channel.name] = channel
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
  },
  CURR_WRITING (state: ChannelsStateInterface, { writer, message }: { writer: string, message: string }) {
    const users = state.writingUsers.map(user => user.nickname)
    if (users.includes(writer)) {
      for (const user of state.writingUsers) {
        if (user.nickname === writer) {
          user.message = message
        }
      }
    } else {
      state.writingUsers.push({ nickname: writer, message })
    }
  },
  SET_CURRENT_TIMESTAMP (state: ChannelsStateInterface) {
    state.currentTimestamp = new Date()
  },
  RESET_CURRENT_TIMESTAMP (state: ChannelsStateInterface) {
    state.currentTimestamp = null
  }
}

export default mutation
