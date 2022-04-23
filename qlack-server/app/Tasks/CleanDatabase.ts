import { BaseTask } from 'adonis5-scheduler/build'
import Message from 'App/Models/Message'
import Database from '@ioc:Adonis/Lucid/Database'
import { Channel } from 'App/Models/Channel'

export default class CleanDatabase extends BaseTask {
	public static get schedule() {
		return '59 * * * * *'
	}
	/**
	 * Set enable use .lock file for block run retry task
	 * Lock file save to `build/tmpTaskLock`
	 */
	public static get useLock() {
		return false
	}

	async removeMessages() {
		const result = await Message.query().whereRaw('EXTRACT(DAY FROM NOW() - created_at) > 30').delete()
		console.log('Messages removed:', result)
	}

	async removeChannels() {
		const channelIds = await Database.rawQuery(`
			SELECT channels.id
			FROM channels
			LEFT JOIN messages
			ON channels.id = messages.channel_id
			WHERE
				EXTRACT(DAY FROM NOW() - channels.created_at) > 30
				AND messages.id IS NULL
		`)

		const result = await Channel.query().select('*').whereIn('id', channelIds.rows.map(row => row.id)).delete()
		console.log('Channels removed:', result)
	}

	public async handle() {
		console.log('CleanDatabase task started at:', new Date())
		await this.removeMessages()
		await this.removeChannels()
		console.log('CleanDatabase task finished at:', new Date())
  	}
}
