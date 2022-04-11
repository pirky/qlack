import { DateTime } from 'luxon'
import { BaseModel, column, BelongsTo, belongsTo } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'
import { Channel } from 'App/Models/Channel'

export default class UserChannel extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @column()
  public channelId: number

  @column.dateTime({ serializeAs: null })
  public invitedAt: DateTime

  @column.dateTime({ serializeAs: null })
  public joinedAt: DateTime

  @column.dateTime({ serializeAs: null })
  public kickedAt: DateTime

  @column.dateTime({ serializeAs: null })
  public bannedAt: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime({ serializeAs: null })
  public deletedAt: DateTime

  @belongsTo(() => User, {
    foreignKey: 'userId',
  })
  public user: BelongsTo<typeof User>

  @belongsTo(() => Channel, {
    foreignKey: 'channelId',
  })
  public channel: BelongsTo<typeof Channel>
}
