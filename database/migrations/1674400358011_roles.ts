import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import roles from 'App/constants/roles'

export default class extends BaseSchema {
  protected tableName = 'roles'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('uuid_generate_v4()'))
      table.enu('name', Object.values(roles)).notNullable()

      /**
       * Uses timestampz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
    // use the defer method to create default user roles
    this.defer(async (db) => {
      const timestamp = new Date().toISOString()
      await db.table(this.tableName).multiInsert([
        { name: roles.USER, created_at: timestamp, updated_at: timestamp },
        { name: roles.MODERATOR, created_at: timestamp, updated_at: timestamp },
        { name: roles.ADMIN, created_at: timestamp, updated_at: timestamp },
      ])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
