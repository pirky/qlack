import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Channel, States } from 'App/Models/Channel'
import UserChannel from 'App/Models/UserChannel'
import { DateTime } from 'luxon'
import Database from '@ioc:Adonis/Lucid/Database'
import User, { ActiveStates } from 'App/Models/User'
import Message from 'App/Models/Message'

export default class ChannelController {
  public async getChannel({ auth, request }: HttpContextContract) {
    const channelName = request.params().channelName.replace('%20', ' ')

    if (auth.user !== undefined) {
      let channel = await Database.from('channels').select('*').where('name', channelName).first()
      if (channel === null) {
        return null
      }
      let userChannel = await UserChannel.query()
        .select('*')
        .where('user_id', auth.user.id)
        .where('channel_id', channel.id)
        .whereNull('kicked_at')
        .whereNull('banned_at')
        .first()

      if (userChannel) {
        return {
          id: channel.id,
          name: channel.name,
          state: channel.state,
          createdBy: channel.created_by,

          invitedAt: userChannel.invitedAt,
          joinedAt: userChannel.joinedAt,
          kickedAt: userChannel.kickedAt,
          bannedAt: userChannel.bannedAt,
        }
      }

      return {
        id: channel.id,
        name: channel.name,
        state: channel.state,
        createdBy: channel.created_by,

        invitedAt: null,
        joinedAt: null,
        kickedAt: null,
        bannedAt: null,
      }
    }
    return null
  }

  public async getChannelNames({ auth }: HttpContextContract) {
    if (auth.user !== undefined) {
      return Channel.query()
        .select('name')
        .fullOuterJoin('user_channels', 'channels.id', 'channel_id')
        .whereNull('kicked_at')
        .whereNull('banned_at')
        .where('user_id', auth.user.id)
    }
  }

  public async createChannel({ auth, request }) {
    try {
      const channel = await Channel.create({
        name: request.input('channelName'),
        createdBy: auth.user.id,
        state: request.input('isPrivate') ? States.PRIVATE : States.PUBLIC,
      })
      await UserChannel.create({
        userId: auth.user.id,
        channelId: channel.id,
        invitedAt: DateTime.now(),
        joinedAt: DateTime.now(),
      })
      return channel
    } catch (error) {
      return null
    }
  }

  public async getUsers({ request }) {
    try {
      const channelName = request.params().channelName.replace('%20', ' ')
      const channel = await Channel.query().where('name', channelName).first()
      if (channel) {
        // get user ids as array
        const userRes = await UserChannel.query()
          .select('user_id')
          .where('channel_id', channel.id)
          .whereNull('kicked_at')
          .whereNull('banned_at')
          .whereNotNull('joined_at')

        const userIds = userRes.map((userId) => {
          return userId.userId
        })

        return await User.query().select('nickname', 'active_state').whereIn('id', userIds)
      }
      return null
    } catch (error) {
      return null
    }
  }

  public async isBanned({ request }) {
    const user = await User.query().where('nickname', request.input('invitedUser')).firstOrFail()
    const userChannel = await UserChannel.query()
      .where('user_id', user.id)
      .where('channel_id', request.input('channelId'))
      .whereNull('banned_at')
      .first()
    return !!userChannel
  }

  public async isInvited({ request }) {
    const user = await User.query().where('nickname', request.input('invitedUser')).firstOrFail()
    const userChannel = await UserChannel.query()
      .where('user_id', user.id)
      .where('channel_id', request.input('channelId'))
      .whereNotNull('invited_at')
      .first()
    return !!userChannel
  }

  public async loadMessages({ auth, request }): Promise<Message[]> {
    const channelName = request.input('channelName').replace('%20', ' ')
    const messageId = request.input('messageId')
    let timestamp: Date
    const user = await User.query().where('id', auth.user.id).firstOrFail()

    if (user.activeState === ActiveStates.ONLINE || user.activeState === ActiveStates.DND) {
      timestamp = new Date()
    } else {
      timestamp = user.stateChangedAt
    }

    if (!channelName || !messageId || !timestamp) {
      return []
    }

    let channel = await Channel.query().where('name', channelName).first()

    if (!channel) {
      return []
    }

    const userChannel = await UserChannel.query()
      .select('*')
      .where('channel_id', channel.id)
      .where('user_id', user.id)
      .whereNull('kicked_at')
      .whereNull('banned_at')
      .whereNotNull('joined_at')
      .first()

    if (!userChannel) {
      return []
    }

    if (messageId === -1) {
      channel = await Channel.query().where('name', channelName)
        .preload('messages', (messagesQuery) =>
          messagesQuery.where('created_at', '<', timestamp)
            .orderBy('id', 'desc').limit(25).preload('author')
        )
        .firstOrFail()
    } else {
      channel = await Channel.query().where('name', channelName)
        .preload('messages', (messagesQuery) =>
          messagesQuery.where('id', '<', messageId).where('created_at', '<', timestamp)
            .orderBy('id', 'desc').limit(25).preload('author')
        )
        .firstOrFail()
    }

    return channel.messages.map((message) => message.serialize() as Message)
  }
}
