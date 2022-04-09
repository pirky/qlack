import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// import Channel from 'App/Models/Channel'
import User from 'App/Models/User'
import RegisterUserValidator from 'App/Validators/RegisterUserValidator'

export default class AuthController {
  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  async register({ auth, request }: HttpContextContract) {
    console.log('SERUS REGISTER')
    const data = await request.validate(RegisterUserValidator)
    const user = await User.create(data)
    console.log('user.password: ', user.password)
    const token = await auth.use('api').generate(user)

    return { user, apiToken: token }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  async login({ auth, request }: HttpContextContract) {
    console.log('SERUS LOGIN')
    const email = request.input('email')
    const password = request.input('password')

    return auth.use('api').attempt(email, password)
  }

  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  async logout({ auth }: HttpContextContract) {
    console.log('SERUS LOGOUT')
    await auth.use('api').logout()
    return true
  }

  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  async me({ auth }: HttpContextContract) {
    console.log('SERUS ME')
    return auth.user
  }
}
