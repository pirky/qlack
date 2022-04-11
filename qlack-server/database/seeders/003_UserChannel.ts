import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import UserChannel from 'App/Models/UserChannel'
import { DateTime } from 'luxon'

export default class UserChannelSeeder extends BaseSeeder {
  public async run() {
    await UserChannel.createMany([
      {
        userId: 1,
        channelId: 1,
        joinedAt: DateTime.now(),
      },
      {
        userId: 1,
        channelId: 2,
        joinedAt: DateTime.now(),
      },
      {
        userId: 2,
        channelId: 3,
        joinedAt: DateTime.now(),
      },
      {
        userId: 2,
        channelId: 1,
        joinedAt: DateTime.now(),
      },
      {
        userId: 3,
        channelId: 1,
        invitedAt: DateTime.now(),
      },
      {
        userId: 1,
        channelId: 2,
        invitedAt: DateTime.now(),
      },
      {
        userId: 3,
        channelId: 3,
        joinedAt: DateTime.now(),
      },
    ])
  }
}
