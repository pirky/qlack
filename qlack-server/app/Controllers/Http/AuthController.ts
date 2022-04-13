import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Channel } from 'App/Models/Channel'
import User from 'App/Models/User'
import RegisterUserValidator from 'App/Validators/RegisterUserValidator'

interface ExtraChannel {
  id: number
  name: string
  state: string
  createdBy: number

  invitedAt: Date
  joinedAt: Date
  kickedAt: Date
  bannedAt: Date
}

export default class AuthController {
  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  async register({ auth, request }: HttpContextContract) {
    const data = await request.validate(RegisterUserValidator)
    const user = await User.create(data)
    console.log('user.password: ', user.password)
    const token = await auth.use('api').generate(user)

    return { user, apiToken: token }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  async login({ auth, request }: HttpContextContract) {
    const email = request.input('email')
    const password = request.input('password')

    return auth.use('api').attempt(email, password)
  }

  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  async logout({ auth }: HttpContextContract) {
    await auth.use('api').logout()
    return true
  }

  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  async me({ auth }: HttpContextContract) {
    let channels: Channel[] = []

    if (auth.user != undefined) {
      channels = await Channel.query()
      .select('*')
      .fullOuterJoin('user_channels', 'channels.id', 'channel_id')
      .where('user_id', auth.user.id)
    }

    const extraChannels: ExtraChannel[] = []

    channels.forEach(function (channel) {
      const extraChannel = {
        id: channel.id,
        name: channel.name,
        state: channel.state,
        createdBy: channel.createdBy,

        invitedAt: channel.$extras.invited_at,
        joinedAt: channel.$extras.joined_at,
        kickedAt: channel.$extras.kicked_at,
        bannedAt: channel.$extras.banned_at,
      }

      extraChannels.push(extraChannel)
    })

    return {
      user: auth.user,
      channels: extraChannels
    }
  }
}
