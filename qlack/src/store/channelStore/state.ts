export interface messageInterface {
  id: number
  authorId: number
  sendTime: Date
  content: string
}

export interface channelStateInterface {
  id: number
  name: string
  state: string
  createdBy: number

  // user_channels
  userState: string

  // channel_messages
  messages: [messageInterface]
}

function state (): channelStateInterface {
  return {
    id: 0,
    name: "Lipsum",
    state: "private",
    createdBy: 0,

    // user_channels
    userState: "joined",

    // channel_messages
    messages: [{
      id: 0,
      authorId: 0,
      sendTime: new Date(),
      content: "Lipsum"
    }]
  }
}

export default state
