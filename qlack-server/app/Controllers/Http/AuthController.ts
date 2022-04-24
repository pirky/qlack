import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import RegisterUserValidator from 'App/Validators/RegisterUserValidator'

export default class AuthController {
  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  async register({ auth, request }: HttpContextContract) {
    let data
    try {
      data = await request.validate(RegisterUserValidator)
    } catch (error) {
      return { error: error.messages }
    }
    const user = await User.create(data)
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
    return auth.user
  }
}
