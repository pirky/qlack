import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UserChannel from 'App/Models/UserChannel'
import { DateTime } from 'luxon'
import { Channel } from 'App/Models/Channel'

export default class UserController {
  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  async acceptInvite({ request }: HttpContextContract) {
    //get channel id by name
    const channel = await Channel.query().where('name', request.input('channelName')).first()
    if (channel) {
      const userChannel = await UserChannel.query()
        .select('*')
        .where('user_id', request.input('userId'))
        .where('channel_id', channel.id)
        .firstOrFail()
      // userChannel.invitedAt = null
      userChannel.joinedAt = DateTime.now()
      userChannel?.save()
      return true
    }
    return false
  }
  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  async declineInvite({ request }: HttpContextContract) {
    const channel = await Channel.query().where('name', request.input('channelName')).first()
    if (channel) {
      const userChannel = await UserChannel.query()
        .select('*')
        .where('user_id', request.input('userId'))
        .where('channel_id', channel.id)
        .firstOrFail()
      userChannel.invitedAt = null
      // userChannel.joinedAt = DateTime.now()
      userChannel?.save()
      return true
    }
    return false
  }
}
