import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User, { ActiveStates, NotificationTypes } from 'App/Models/User'

export default class UserSeeder extends BaseSeeder {
  public async run() {
    await User.createMany([
      {
        firstName: 'Frantisek',
        lastName: 'Buxanto',
        nickname: 'buxik',
        email: 'buxik@gmail.com',
        password: 'password',
      },
      {
        firstName: 'Peter',
        lastName: 'Petrzlak',
        nickname: 'petrzlen',
        email: 'petrzlen@gmail.com',
        password: 'password',
        activeState: ActiveStates.DND,
      },
      {
        firstName: 'Dusan',
        lastName: 'Kreken',
        nickname: 'kreky',
        email: 'kreky@gmail.com',
        password: 'password',
        notificationType: NotificationTypes.TAGGED,
        activeState: ActiveStates.OFFLINE,
      },
    ])
  }
}
