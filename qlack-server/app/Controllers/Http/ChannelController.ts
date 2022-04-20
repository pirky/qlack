import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Channel, States } from 'App/Models/Channel'
import UserChannel from 'App/Models/UserChannel'
import { DateTime } from 'luxon'
import Database from '@ioc:Adonis/Lucid/Database'
import Message from 'App/Models/Message'
import UserChannelKick from 'App/Models/UserChannelKick'

export default class ChannelController {
  public async getChannel({ auth, request }: HttpContextContract) {
    const channelName = request.params().channelName.replace('%20', ' ')

    if (auth.user !== undefined) {
      let channel = await Database.from('channels').select('*').where('name', channelName).first()

      let userChannel = await UserChannel.query()
        .select('*')
        .where('user_id', auth.user.id)
        .where('channel_id', channel.id)
        .first()

      if (userChannel) {
        return {
          id: channel.channel_id,
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
        id: channel.channel_id,
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
}
