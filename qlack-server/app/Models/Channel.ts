import { DateTime } from 'luxon'
import { BaseModel, belongsTo, BelongsTo, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'
import Message from 'App/Models/Message'
import UserChannel from 'App/Models/UserChannel'
// import { BaseModel, column, BelongsTo, belongsTo, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
// import User from 'App/Models/User'
// import UserChannel from 'App/Models/UserChannel'
// import Message from 'App/Models/Message'

export const enum States {
  PRIVATE = 'private',
  PUBLIC = 'public',
}

export class Channel extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public state: States

  @column()
  public createdBy: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime({ serializeAs: null })
  public deletedAt: DateTime | null

  @belongsTo(() => User, {
    foreignKey: 'createdBy',
  })
  public creator: BelongsTo<typeof User>

  @hasMany(() => Message, {
    foreignKey: 'channelId',
  })
  public messages: HasMany<typeof Message>

  @hasMany(() => UserChannel, {
    foreignKey: 'channelId',
  })
  public userChannels: HasMany<typeof UserChannel>
}
