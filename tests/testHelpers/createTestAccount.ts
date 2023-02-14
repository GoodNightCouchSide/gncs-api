import roles from 'App/constants/roles'
import Role from 'App/Models/Role'

import { UserFactory } from 'Database/factories/UserFactory'

export async function createTestAccount() {
  const adminRole = await Role.findBy('name', roles.ADMIN)
  const moderatorRole = await Role.findBy('name', roles.MODERATOR)
  const userRole = await Role.findBy('name', roles.USER)

  const moderatorUser = await UserFactory.merge({
    roleId: moderatorRole?.id,
    password: 'testpassword',
  }).create()

  const adminUser = await UserFactory.merge({
    roleId: adminRole?.id,
    password: 'testpassword',
  }).create()

  const userUser = await UserFactory.merge({
    roleId: userRole?.id,
    password: 'testpassword',
  }).create()

  return { adminUser, moderatorUser, userUser }
}
