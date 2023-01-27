import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import Roles from 'App/Enums/Roles'

export default class extends BaseSchema {
  protected tableName = 'roles'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('uuid_generate_v4()'))
      table.string('name').notNullable()

      /**
       * Uses timestampz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
    // use the defer method to create default user roles
    this.defer(async (db) => {
      const timestamp = new Date().toISOString()
      await db.table(this.tableName).multiInsert([
        { name: Roles.USER, created_at: timestamp, updated_at: timestamp },
        { name: Roles.MODERATOR, created_at: timestamp, updated_at: timestamp },
        { name: Roles.ADMIN, created_at: timestamp, updated_at: timestamp },
      ])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
