import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'events'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('venue')
      table.uuid('venue_id').references('id').inTable('venues')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('venue_id')
      table.integer('venue', 180)
    })
  }
}
