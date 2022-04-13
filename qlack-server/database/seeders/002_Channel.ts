import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import { Channel, States } from 'App/Models/Channel'

export default class ChannelSeeder extends BaseSeeder {
  public async run() {
    await Channel.createMany([
      {
        name: 'buxiho channel',
        state: States.PUBLIC,
        createdBy: 1,
      },
      {
        name: 'buxorov kanal',
        state: States.PRIVATE,
        createdBy: 1,
      },
      {
        name: 'ovocny channel',
        state: States.PUBLIC,
        createdBy: 2,
      },
    ])
    // Write your database queries inside the run method
  }
}
