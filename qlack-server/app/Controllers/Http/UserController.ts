import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UserChannel from 'App/Models/UserChannel'
import { DateTime } from 'luxon'
import { Channel } from 'App/Models/Channel'
import User from 'App/Models/User'

export default class UserController {
  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  async getAllUsers({}: HttpContextContract) {
    const users = await User.query().select('nickname')
    let usersNicknames: string[] = []
    users.forEach((user) => {
      usersNicknames.push(user.nickname)
    })
    return usersNicknames
  }

  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  async acceptInvite({ auth, request }: HttpContextContract) {
    //get channel id by name
    const channel = await Channel.query().where('name', request.input('channelName')).first()
    if (channel && auth.user !== undefined) {
      const userChannel = await UserChannel.query()
        .select('*')
        .where('user_id', auth.user.id)
        .where('channel_id', channel.id)
        .firstOrFail()

      userChannel.joinedAt = DateTime.now()
      userChannel?.save()
      return true
    }
    return false
  }

  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  async declineInvite({ auth, request }: HttpContextContract) {
    const channel = await Channel.query().where('name', request.input('channelName')).first()
    if (channel && auth.user !== undefined) {
      const userChannel = await UserChannel.query()
        .select('*')
        .where('user_id', auth.user.id)
        .where('channel_id', channel.id)
        .firstOrFail()
      userChannel.invitedAt = null
      // userChannel.joinedAt = DateTime.now()
      userChannel?.save()
      return true
    }
    return false
  }

  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  async updateNotification({ auth, request }: HttpContextContract) {
    if (auth.user !== undefined) {
      const user = await User.query().where('id', auth.user.id).first()
      if (user) {
        user.notificationType = request.input('notificationType')
        user.save()
        return true
      }
    }
    return false
  }
}
