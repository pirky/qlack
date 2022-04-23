import type { WsContextContract } from '@ioc:Ruby184/Socket.IO/WsContext'
import User from 'App/Models/User'
import { Channel } from 'App/Models/Channel'
import UserChannel from 'App/Models/UserChannel'
import { DateTime } from 'luxon'
import UserChannelKick from 'App/Models/UserChannelKick'

export default class ChannelController {
  public async kickUser(
    { socket, auth }: WsContextContract,
    { channelName, nickname }: { channelName: string; nickname: string }
  ) {
    const kicker = await User.query().where('id', auth.user!.id).firstOrFail()
    const victim = await User.query().where('nickname', nickname).firstOrFail()
    const channel = await Channel.query().where('name', channelName).firstOrFail()
    if (kicker && victim && channel) {
      if (kicker.id === victim.id) {
        return 'You cannot kick yourself!'
      }
      if (victim.id === channel.createdBy) {
        return 'You cannot kick the channel owner!'
      }
      let userChannel = await UserChannel.query()
        .where('user_id', victim.id)
        .where('channel_id', channel.id)
        .firstOrFail()
      if (userChannel) {
        if (kicker.id === channel.createdBy) {
          userChannel.bannedAt = DateTime.now()
        } else {
          userChannel.kickedAt = DateTime.now()
          await UserChannelKick.create({
            userId: victim.id,
            kickerId: kicker.id,
            channelId: channel.id,
          })
          const kicks = await UserChannelKick.query()
            .where('user_id', victim.id)
            .where('channel_id', channel.id)
            .select('kicker_id')
          let kickIds = kicks.map((kick) => kick.kickerId)
          let unique = kickIds.filter((v, i, a) => a.indexOf(v) === i)
          if (unique.length >= 3) {
            userChannel.bannedAt = DateTime.now()
          }
        }
        await userChannel.save()
        // broadcast user to other users in channel and to the user itself
        socket.nsp.emit('kickUser', {
          victimNickname: victim.nickname,
          channelName: channel.name,
        })
        return true
      }
    }
    return false
  }
}
