import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

import { Channel } from "App/Models/Channel";

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
}
