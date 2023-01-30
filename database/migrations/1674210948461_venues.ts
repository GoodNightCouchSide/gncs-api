import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'venues'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('capacity')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('capacity')
    })
  }
}
