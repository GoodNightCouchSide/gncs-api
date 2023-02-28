import { validator } from '@ioc:Adonis/Core/Validator'
import Role from 'App/Models/Role'

validator.rule(
  'isAdminOrModerator',
  async (value, [roleId], options) => {
    const isNotAdminOrModerator = !(await Role.isAdminOrModerator(roleId))
    if (typeof value !== 'boolean') {
      return
    }
    if (isNotAdminOrModerator) {
      options.errorReporter.report(
        options.pointer,
        'isAdminOrModerator',
        'isAdminOrModerator validation failed',
        options.arrayExpressionPointer
      )
    }
  },
  () => ({
    async: true,
  })
)
