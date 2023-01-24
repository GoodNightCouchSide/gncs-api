import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'events'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('headliner').notNullable()
      table.string('support')
      table.timestamp('date', { useTz: true }).notNullable()
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('headliner')
      table.dropColumn('support')
      table.dropColumn('date')
    })
  }
}
