import { api } from 'src/boot/axios'

class ChannelService {
  async acceptInvite (channelId: number, userId: number):Promise<void> {
    await api.post('user/acceptInvite', { channelId, userId })
  }

  async declineInvite (channelId: number, userId: number) :Promise<void> {
    await api.post('user/declineInvite', { channelId, userId })
  }
}

export default new ChannelService()
