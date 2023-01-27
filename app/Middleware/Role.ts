import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Role from 'App/Models/Role'

export default class RoleMiddleware {
  public async handle(
    { response, auth }: HttpContextContract,
    next: () => Promise<void>,
    guards: string[]
  ) {
    if (auth.user && !guards.includes((await Role.findByOrFail('id', auth.user.roleId)).name)) {
      const errors = [
        {
          message: `This is restricted to ${guards.join(', ')} users`,
        },
      ]
      return response.unauthorized({ errors })
    }
    await next()
  }
}
