import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UserChannelKicks extends BaseSchema {
  protected tableName = 'user_channel_kicks'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('user_id').notNullable().unsigned().references('users.id')
      table.integer('kicker_id').notNullable().unsigned().references('users.id')
      table.integer('channel_id').notNullable().unsigned().references('channels.id')

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
      table.timestamp('deleted_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}