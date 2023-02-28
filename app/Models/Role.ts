import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import roles from 'App/constants/roles'
import { DateTime } from 'luxon'

export default class Role extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public name: roles

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  /**
   * Check if the role name admin or moderator.
   * @params roleId Id of the role
   * @returns boolean
   */
  public static async isAllowedToPublishContent(roleId: string): Promise<boolean> {
    return this.isAdminOrModerator(roleId)
  }

  public static async isAdminOrModerator(roleId): Promise<boolean> {
    if (!roleId) return false
    const role = await this.findByOrFail('id', roleId)
    return role.name === roles.ADMIN || role.name === roles.MODERATOR
  }
}
