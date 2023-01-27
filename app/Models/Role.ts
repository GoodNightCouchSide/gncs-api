import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import Roles from 'App/Enums/Roles'
import { DateTime } from 'luxon'

export default class Role extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public name: Roles

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
