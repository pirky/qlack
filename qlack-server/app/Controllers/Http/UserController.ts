import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UserChannel from 'App/Models/UserChannel'
import { Channel } from 'App/Models/Channel'
import User from 'App/Models/User'

export default class UserController {
  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  async getAll({}: HttpContextContract) {
    return await User.query().select('nickname', 'email')
  }

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
  async declineInvite({ auth, request }: HttpContextContract) {
    const channel = await Channel.query().where('name', request.input('channelName')).first()
    if (channel && auth.user !== undefined) {
      await UserChannel.query()
        .select('*')
        .where('user_id', auth.user.id)
        .where('channel_id', channel.id)
        .delete()
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

  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  async updateState({ auth, request }: HttpContextContract) {
    if (auth.user !== undefined) {
      const user = await User.query().where('id', auth.user.id).first()
      if (user) {
        user.stateChangedAt = request.input('stateChangedAt')
        user.activeState = request.input('newState')
        await user.save()
        return true
      }
    }
    return false
  }
}
