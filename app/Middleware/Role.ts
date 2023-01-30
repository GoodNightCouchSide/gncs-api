import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Role from 'App/Models/Role'

export default class RoleMiddleware {
  public async handle(
    { response, auth }: HttpContextContract,
    next: () => Promise<void>,
    rolesWithPermissions: string[]
  ) {
    if (auth.user) {
      const role = await Role.findBy('id', auth.user.roleId)
      if (role && !rolesWithPermissions.includes(role.name)) {
        return response.status(403).json({
          success: false,
          message: 'You are not authorized to perform this action',
        })
      }
      return await next()
    }
  }
}
