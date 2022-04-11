import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { column, beforeSave, BaseModel, manyToMany, ManyToMany } from '@ioc:Adonis/Lucid/Orm'
import { Channel } from 'App/Models/Channel'

export enum NotificationTypes {
  ALL = 'all',
  TAGGED = 'tagged',
}

export enum ActiveStates {
  ONLINE = 'online',
  DND = 'dnd',
  OFFLINE = 'offline',
}

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public firstName: string

  @column()
  public lastName: string

  @column()
  public nickname: string

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public notificationType: NotificationTypes

  @column()
  public activeState: ActiveStates

  // @column()
  // public rememberMeToken?: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime({ serializeAs: null })
  public deletedAt: DateTime

  @manyToMany(() => Channel, {
    pivotTable: 'user_channels',
    pivotForeignKey: 'userId',
    pivotRelatedForeignKey: 'channelId',
    pivotTimestamps: true,
  })
  public channels: ManyToMany<typeof Channel>

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}
