import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Channel, States } from 'App/Models/Channel'
import UserChannel from 'App/Models/UserChannel'
import { DateTime } from 'luxon'

export default class ChannelController {
  public async getChannel({ auth, request }: HttpContextContract) {
    const channelName = request.params().channelName.replace('%20', ' ')

    if (auth.user !== undefined) {
      let channel = await Channel.query()
        .select('*')
        .fullOuterJoin('user_channels', 'channels.id', 'channel_id')
        .where('user_id', auth.user.id)
        .where('name', channelName)
        .first()
      return channel
        ? {
            id: channel.$extras.channel_id,
            name: channel.name,
            state: channel.state,
            createdBy: channel.createdBy,

            invitedAt: channel.$extras.invited_at,
            joinedAt: channel.$extras.joined_at,
            kickedAt: channel.$extras.kicked_at,
            bannedAt: channel.$extras.banned_at,
          }
        : null
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
      console.log(channel.name)
      return channel
    } catch (error) {
      return null
    }
  }

  public async deleteChannel({ auth, request }) {
    try {
      const channel = await Channel.query().where('id', request.input('channelId')).first()
      const userChannel = await UserChannel.query()
        .where('user_id', auth.user.id)
        .where('channel_id', request.input('channelId'))
        .first()
      if (channel) {
        if (channel.createdBy === auth.user.id) {
          channel.deletedAt = DateTime.now()
          await channel.save()
          userChannel ? (userChannel.deletedAt = DateTime.now()) : null
          userChannel ? await userChannel.save() : null
          return true
        } else {
          userChannel ? (userChannel.deletedAt = DateTime.now()) : null
          userChannel ? await userChannel.save() : null
        }
        return true
      }
      return false
    } catch (error) {
      return false
    }
  }
}
