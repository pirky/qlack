import type { MessageRepositoryContract, Message } from '@ioc:Repositories/MessageRepository'
import { Channel } from 'App/Models/Channel'

export default class MessageRepository implements MessageRepositoryContract {
  public async loadSome(channelName: string, id: number): Promise<Message[]> {
    let channel: Channel

    if (id === -1) {
      channel = await Channel.query()
      .where('name', channelName)
      .preload('messages', (messagesQuery) => messagesQuery
        .orderBy('id', 'desc')
        .limit(2)
        .preload('author')
      )
      .limit(2)
      .firstOrFail()
    } else {
      channel = await Channel.query()
        .where('name', channelName)
        .preload('messages', (messagesQuery) => messagesQuery
          .where('id', '<', id)
          .orderBy('id', 'desc')
          .limit(2)
          .preload('author')
        )
        .limit(2)
        .firstOrFail()
    }

    return channel.messages.map((message) => message.serialize() as Message)
  }

  public async create(channelName: string, userId: number, content: string): Promise<Message> {
    const channel = await Channel.findByOrFail('name', channelName)
    const message = await channel.related('messages').create({ authorId: userId, content })
    await message.load('author')

    return message.serialize() as Message
  }
}
