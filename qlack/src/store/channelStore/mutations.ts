import { MutationTree } from 'vuex'
import { ChannelStateInterface, MessageInterface } from './state'


const mutation: MutationTree<ChannelStateInterface> = {
  updateId (state: ChannelStateInterface, value: number) {
    state.id = value
  },
  updateName (state: ChannelStateInterface, value: string) {
    state.name = value
  },
  updateState (state: ChannelStateInterface, value: string) {
    state.state = value
  },
  updateCreatedBy (state: ChannelStateInterface, value: number) {
    state.createdBy = value
  },

  updateUserState (state: ChannelStateInterface, value: string) {
    state.userState = value
  },

  updateMessages (state: ChannelStateInterface, value: [MessageInterface]) {
    state.messages = value
  },
  prependMessage(state: ChannelStateInterface, value: MessageInterface) {
    state.messages.splice(0, 0, value)
  },
  appendMessage(state: ChannelStateInterface, value: MessageInterface) {
    state.messages.push(value)
  }
}

export default mutation
