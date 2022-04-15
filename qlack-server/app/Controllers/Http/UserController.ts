import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UserChannel from 'App/Models/UserChannel'
import { DateTime } from 'luxon'

export default class UserController {
  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  async acceptInvite({ request }: HttpContextContract) {
    const userChannel = await UserChannel.query()
      .select('*')
      .where('user_id', request.input('userId'))
      .where('channel_id', request.input('channelId'))
      .firstOrFail()
    userChannel.invitedAt = null
    userChannel.joinedAt = DateTime.now()
    userChannel?.save()
  }
}
