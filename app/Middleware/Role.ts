import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class Role {
  public async handle(
    { response, auth }: HttpContextContract,
    next: () => Promise<void>,
    guards: string[]
  ) {
    if (auth.user && !guards.includes(auth.user.roleName)) {
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
