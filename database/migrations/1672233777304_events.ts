import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'events'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.string('title', 255).notNullable().unique()
      table.string('description', 800)
      table.string('cover')
      table.integer('pre_payment')
      table.integer('box_office')
      table.integer('venue', 180)
      table.string('links', 500)
      table.integer('creator', 180)
      table.boolean('is_public').defaultTo(false)
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
