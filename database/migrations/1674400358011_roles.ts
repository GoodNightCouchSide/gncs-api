import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import Roles from 'App/Enums/Roles'

export default class extends BaseSchema {
  protected tableName = 'roles'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('name').primary()
    })
    // use the defer method to create default user roles
    this.defer(async (db) => {
      await db
        .table(this.tableName)
        .multiInsert([{ name: Roles.USER }, { name: Roles.MODERATOR }, { name: Roles.ADMIN }])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
