import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UserChannels extends BaseSchema {
  protected tableName = 'user_channels'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').notNullable().unsigned().references('id').inTable('users')
      table.integer('channel_id').notNullable().unsigned().references('id').inTable('channels')

      table.timestamp('invited_at', { useTz: true }).defaultTo(null)
      table.timestamp('joined_at', { useTz: true }).defaultTo(null)
      table.timestamp('kicked_at', { useTz: true }).defaultTo(null)
      table.timestamp('banned_at', { useTz: true }).defaultTo(null)

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
      table.timestamp('deleted_at', { useTz: true }).defaultTo(null)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
