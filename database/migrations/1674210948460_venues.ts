import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'venues'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('url')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('url')
    })
  }
}
