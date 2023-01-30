import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Roles from 'App/constants/roles'
import Role from 'App/Models/Role'
import User from 'App/Models/User'
import RegisterValidator from 'App/Validators/Auth/RegisterValidator'

export default class AuthController {
  public async login({ request, auth }: HttpContextContract) {
    const email = request.input('email')
    const password = request.input('password')
    const token = await auth.use('api').attempt(email, password, {
      expiresIn: '10 days',
    })
    return token.toJSON()
  }

  /**
   * User will be create with a default USER role
   */
  public async register({ response, request, auth }: HttpContextContract) {
    try {
      const data = await request.validate(RegisterValidator)
      const user = await User.create({
        ...data,
        roleId: (await Role.findByOrFail('name', Roles.USER)).id,
      })
      const token = await auth.use('api').attempt(data.email, data.password, {
        expiresIn: '10 days',
      })
      response.json({ success: true, user, token })
    } catch (error) {
      // TODO add message or some redirect
      response.json({ success: false })
    }
  }

  public async logout({ response, auth }: HttpContextContract) {
    await auth.use('api').logout()
    response.json({ success: true })
  }
}
