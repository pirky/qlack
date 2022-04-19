// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { Channel } from 'App/Models/Channel'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ChannelController {
  public async getChannel({ request }: HttpContextContract) {
    return await Channel.query().where('name', request.params().channelName).first()
  }
}
