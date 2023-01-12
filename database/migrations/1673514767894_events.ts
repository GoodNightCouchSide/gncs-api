import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'events'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('venue')
      table.uuid('venue_id').references('id').inTable('venues')
      table.dropColumn('creator')
      table.string('creator_email').references('email').inTable('users')
      table.string('box_office').alter()
      table.string('pre_payment').alter()
      table.string('alternative_address')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('venue_id')
      table.integer('venue', 180)
      table.dropColumn('creator_email')
      table.integer('creator', 180)
      table.integer('pre_payment').alter()
      table.integer('box_office').alter()
      table.dropColumn('alternative_address')
    })
  }
}
