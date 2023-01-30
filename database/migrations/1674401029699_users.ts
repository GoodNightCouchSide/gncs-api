import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.uuid('role_id').unsigned().references('id').inTable('roles').notNullable()
      table.string('name').unique()
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumns('role_id', 'name')
    })
  }
}
