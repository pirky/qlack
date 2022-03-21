import { MutationTree } from 'vuex'
import { channelStateInterface, messageInterface } from './state'


const mutation: MutationTree<channelStateInterface> = {
  updateId (state: channelStateInterface, value: number) {
    state.id = value
  },
  updateName (state: channelStateInterface, value: string) {
    state.name = value
  },
  updateState (state: channelStateInterface, value: string) {
    state.state = value
  },
  updateCreatedBy (state: channelStateInterface, value: number) {
    state.createdBy = value
  },

  updateUserState (state: channelStateInterface, value: string) {
    state.userState = value
  },

  updateMessages (state: channelStateInterface, value: [messageInterface]) {
    state.messages = value
  },
  prependMessage(state: channelStateInterface, value: messageInterface) {
    state.messages.splice(0, 0, value)
  },
  appendMessage(state: channelStateInterface, value: messageInterface) {
    state.messages.push(value)
  }
}

export default mutation
