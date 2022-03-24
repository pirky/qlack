export interface MessageInterface {
  id: number
  authorId: number
  authorNickname: string
  sendTime: Date
  content: string
}

export interface ChannelInterface {
  id: number
  name: string
  state: string
  createdBy: number

  // user_channels
  userState: string

  // channel_messages
  messages: MessageInterface[]
}

export interface UserStateInterface {
  id: number
  firstName: string
  lastName: string
  nickname: string
  email: string
  notificationType: string
  state: string

  channels: ChannelInterface[]
}

function state (): UserStateInterface {
  return {
    id: 0,
    firstName: 'Arnost',
    lastName: 'Kabel',
    nickname: 'kablis',
    email: 'arnost@kabel.com',
    notificationType: 'all',
    state: 'online',
    channels: [
      {
        id: 0,
        name: 'First module-channel ever',
        state: 'public',
        createdBy: 0,
        userState: 'joined',
        messages: [
          {
            id: 1,
            authorId: 1,
            authorNickname: 'petrzlak',
            sendTime: new Date('2022-03-22 14:23:56'),
            content: 'First message'
          },
          {
            id: 2,
            authorId: 0,
            authorNickname: 'kablis',
            sendTime: new Date('2022-03-22 14:24:45'),
            content: 'Second hi there'
          },
          {
            id: 3,
            authorId: 2,
            authorNickname: 'pele',
            sendTime: new Date('2022-03-22 15:22:45'),
            content: 'Third wordl.'
          }]
      },
      {
        id: 1,
        name: 'Lipsum',
        state: 'private',
        createdBy: 0,
        userState: 'joined',
        messages: [
          {
            id: 4,
            authorId: 1,
            authorNickname: 'petrzlak',
            sendTime: new Date('2022-03-22 14:23:56'),
            content: '2 First message'
          },
          {
            id: 5,
            authorId: 0,
            authorNickname: 'kablis',
            sendTime: new Date('2022-03-22 14:24:45'),
            content: '2 Second hi there'
          },
          {
            id: 6,
            authorId: 2,
            authorNickname: 'pele',
            sendTime: new Date('2022-03-22 15:22:45'),
            content: '2 Third wordl.'
          }]
      },
      {
        id: 2,
        name: 'Tuna kto',
        state: 'public',
        createdBy: 0,
        userState: 'joined',
        messages: [
          {
            id: 7,
            authorId: 1,
            authorNickname: 'petrzlak',
            sendTime: new Date('2022-03-22 14:23:56'),
            content: '3 First message'
          },
          {
            id: 8,
            authorId: 0,
            authorNickname: 'kablis',
            sendTime: new Date('2022-03-22 14:24:45'),
            content: '3 Second hi there'
          },
          {
            id: 9,
            authorId: 2,
            authorNickname: 'pele',
            sendTime: new Date('2022-03-22 15:22:45'),
            content: '3 Third wordl.'
          }]
      },
      {
        id: 3,
        name: 'Invitation channel 1',
        state: 'public',
        createdBy: 0,
        userState: 'invited',
        messages: [
          {
            id: 10,
            authorId: 1,
            authorNickname: 'petrzlak',
            sendTime: new Date('2022-03-22 14:23:56'),
            content: '4 First message'
          },
          {
            id: 11,
            authorId: 0,
            authorNickname: 'kablis',
            sendTime: new Date('2022-03-22 14:24:45'),
            content: '4 Second hi there'
          },
          {
            id: 12,
            authorId: 2,
            authorNickname: 'pele',
            sendTime: new Date('2022-03-22 15:22:45'),
            content: '4 Third wordl.'
          }]
      },
      {
        id: 4,
        name: 'Invitation channel 2',
        state: 'private',
        createdBy: 0,
        userState: 'invited',
        messages: [
          {
            id: 13,
            authorId: 1,
            authorNickname: 'petrzlak',
            sendTime: new Date('2022-03-22 14:23:56'),
            content: '5 First message'
          },
          {
            id: 14,
            authorId: 0,
            authorNickname: 'kablis',
            sendTime: new Date('2022-03-22 14:24:45'),
            content: '5 Second hi there'
          },
          {
            id: 15,
            authorId: 2,
            authorNickname: 'pele',
            sendTime: new Date('2022-03-22 15:22:45'),
            content: '5 Third wordl.'
          }]
      }
    ]
  }
}

export default state
