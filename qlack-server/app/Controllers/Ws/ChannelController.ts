import type { WsContextContract } from '@ioc:Ruby184/Socket.IO/WsContext'
import User from 'App/Models/User'
import { Channel } from 'App/Models/Channel'
import UserChannel from 'App/Models/UserChannel'
import { DateTime } from 'luxon'
import UserChannelKick from 'App/Models/UserChannelKick'
import Message from 'App/Models/Message'

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

  public async joinExisting(
    { socket, auth }: WsContextContract,
    { channelName }: { channelName: string }
  ) {
    try {
      const channel = await Channel.query().where('name', channelName).first()
      if (channel) {
        await UserChannel.create({
          userId: auth.user!.id,
          channelId: channel.id,
          invitedAt: DateTime.now(),
          joinedAt: DateTime.now(),
        })
        socket.nsp.emit('joinUser', {
          userNickname: auth.user!.nickname,
          activeState: auth.user!.activeState,
          channelName: channel.name,
        })
        return true
      }
      return false
    } catch (error) {
      return false
    }
  }

  public async inviteUser(
    { socket }: WsContextContract,
    { channelName, invitedUser }: { channelName: string; invitedUser: string }
  ) {
    try {
      const channel = await Channel.query().where('name', channelName).first()
      const user = await User.query().where('nickname', invitedUser).first()
      if (channel && user) {
        const userChannel = await UserChannel.query()
          .where('user_id', user.id)
          .where('channel_id', channel.id)
          .first()
        if (userChannel) {
          userChannel.invitedAt = DateTime.now()
          userChannel.joinedAt = null
          userChannel.kickedAt = null
          userChannel.bannedAt = null
          await userChannel.save()
        } else {
          await UserChannel.create({
            userId: user.id,
            channelId: channel.id,
            invitedAt: DateTime.now(),
          })
        }

        socket.broadcast.emit('inviteUser', {
          invitedUser,
          channel: {
            id: channel.id,
            name: channel.name,
            state: channel.state,
            createdBy: channel.createdBy,
            userState: 'invited',
            messages: [],
          },
        })
        return true
      }
      return false
    } catch (error) {
      return false
    }
  }

  public async revokeUser(
    { socket, auth }: WsContextContract,
    { channelName, nickname }: { channelName: string; nickname: string }
  ) {
    const kicker = await User.query().where('id', auth.user!.id).firstOrFail()
    const victim = await User.query().where('nickname', nickname).firstOrFail()
    const channel = await Channel.query().where('name', channelName).firstOrFail()
    if (kicker && victim && channel) {
      if (kicker.id === victim.id) {
        return 'You cannot revoke yourself!'
      }
      await UserChannel.query().where('user_id', victim.id).where('channel_id', channel.id).delete()
      socket.nsp.emit('kickUser', {
        victimNickname: victim.nickname,
        channelName: channel.name,
      })
      return true
    }
    return false
  }

  public async acceptInvite(
    { socket, auth }: WsContextContract,
    { channelName }: { channelName: string }
  ) {
    const channel = await Channel.query().where('name', channelName).first()
    if (channel && auth.user !== undefined) {
      const userChannel = await UserChannel.query()
        .select('*')
        .where('user_id', auth.user.id)
        .where('channel_id', channel.id)
        .firstOrFail()

      userChannel.joinedAt = DateTime.now()
      userChannel?.save()
      socket.broadcast.emit('joinUser', {
        userNickname: auth.user!.nickname,
        activeState: auth.user!.activeState,
        channelName: channel.name,
      })
      return true
    }
    return false
  }

  public async deleteChannel(
    { socket, auth }: WsContextContract,
    { channelName }: { channelName: string }
  ) {
    try {
      const channel = await Channel.query().where('name', channelName).first()
      if (channel && auth.user !== undefined) {
        await UserChannel.query()
          .where('user_id', auth.user.id)
          .where('channel_id', channel.id)
          .delete()
        if (channel.createdBy === auth.user.id) {
          await Message.query().where('channel_id', channel.id).delete()
          await UserChannelKick.query().where('channel_id', channel.id).delete()
          await channel.delete()
          socket.broadcast.emit('deleteChannel', {
            channelName: channel.name,
          })
          return true
        }
        socket.broadcast.emit('cancelChannel', {
          channelName: channel.name,
          victimNickname: auth.user.nickname,
        })
        return true
      }
      return false
    } catch (error) {
      return false
    }
  }
}
