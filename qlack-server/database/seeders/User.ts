import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User, { ActiveStates, NotificationTypes } from 'App/Models/User'
import { DateTime } from 'luxon'

export default class UserSeeder extends BaseSeeder {
  public async run () {
    await User.createMany([
      {
        firstName: 'Frantisek',
        lastName: 'Buxanto',
        nickname: 'buxik',
        email: 'buxik@gmail.com',
        password: 'password',
        notificationType: NotificationTypes.ALL,
        activeState: ActiveStates.ONLINE,
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
      },
    ])
  }
}
