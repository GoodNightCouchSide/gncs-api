import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { column, beforeSave, BaseModel, computed, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm'
import Roles from 'App/Enums/Roles'
import Role from './Role'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public email: string

  @column()
  public name: string

  @column()
  public roleId: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public rememberMeToken: string | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @computed()
  public get isAdmin() {
    return this.role.name === Roles.ADMIN
  }

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  @hasOne(() => Role, {
    foreignKey: 'id',
  })
  public role: HasOne<typeof Role>
}
