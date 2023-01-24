import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import Roles from 'App/Enums/Roles'

export default class Role extends BaseModel {
  @column({ isPrimary: true })
  public name: Roles
}
