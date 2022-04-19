import { api } from 'src/boot/axios'
import { RawMessage, Message, Channel } from 'src/contracts'
import { BootParams, SocketManager } from './SocketManager'

class ChannelSocketManager extends SocketManager {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  public subscribe ({ store }: BootParams): void {
    const channel = this.namespace.split('/').pop() as string

    this.socket.on('message', (message: Message) => {
      store.commit('channels/NEW_MESSAGE', { channel, message })
    })
  }

  public addMessage (message: RawMessage): Promise<Message> {
    return this.emitAsync('addMessage', message)
  }

  public loadMessages (): Promise<Message[]> {
    return this.emitAsync('loadMessages')
  }
}

class ChannelService {
  private channels: Map<string, ChannelSocketManager> = new Map()

  public join (name: string): ChannelSocketManager {
    if (this.channels.has(name)) {
      throw new Error(`User is already joined in channel "${name}"`)
    }

    // connect to given channel namespace
    const channel = new ChannelSocketManager(`/channels/${name}`)
    this.channels.set(name, channel)
    return channel
  }

  public leave (name: string): boolean {
    const channel = this.channels.get(name)

    if (!channel) {
      return false
    }

    // disconnect namespace and remove references to socket
    channel.destroy()
    return this.channels.delete(name)
  }

  public in (name: string): ChannelSocketManager | undefined {
    return this.channels.get(name)
  }

  async acceptInvite (channelId: number, userId: number):Promise<void> {
    await api.post('user/acceptInvite', { channelId, userId })
  }

  async declineInvite (channelId: number, userId: number) :Promise<void> {
    await api.post('user/declineInvite', { channelId, userId })
  }

  async getChannel (channelName: string): Promise<Channel> {
    return api.get('channel/getChannel/' + channelName)
  }
}

export default new ChannelService()
