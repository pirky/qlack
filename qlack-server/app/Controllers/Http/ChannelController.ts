import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Channel, States } from 'App/Models/Channel'
import UserChannel from 'App/Models/UserChannel'
import { DateTime } from 'luxon'
import Database from '@ioc:Adonis/Lucid/Database'
import Message from 'App/Models/Message'
import UserChannelKick from 'App/Models/UserChannelKick'
import User from 'App/Models/User'

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

  public async deleteChannel({ auth, request }) {
    try {
      const channel = await Channel.query().where('name', request.input('channelName')).first()
      if (channel) {
        await UserChannel.query()
          .where('user_id', auth.user.id)
          .where('channel_id', channel.id)
          .delete()
        if (channel.createdBy === auth.user.id) {
          await Message.query().where('channel_id', channel.id).delete()
          await UserChannelKick.query().where('channel_id', channel.id).delete()
          await channel.delete()
          return true
        }
        return true
      }
      return false
    } catch (error) {
      return false
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
}
