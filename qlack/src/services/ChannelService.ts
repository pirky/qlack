import { api } from 'src/boot/axios'

class ChannelService {
  async acceptInvite (channelId: number, userId: number):Promise<void> {
    await api.post('user/acceptInvite', { channelId, userId })
  }
}

export default new ChannelService()
