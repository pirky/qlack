import { api } from 'src/boot/axios'
import { ExtraChannel, Message, RawMessage } from 'src/contracts'
import { BootParams, SocketManager } from './SocketManager'

class ChannelSocketManager extends SocketManager {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  public subscribe ({ store }: BootParams): void {
    const channelName = this.namespace.split('/').pop() as string

    this.socket.on('message', (message: Message) => {
      store.commit('channels/NEW_MESSAGE', { channelName, message })
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

  // eslint-disable-next-line @typescript-eslint/require-await
  public leave (name: string) {
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

  async acceptInvite (channelName: string, userId: number):Promise<void> {
    await api.post('user/acceptInvite', { channelName, userId })
  }

  async declineInvite (channelName: string, userId: number) :Promise<void> {
    await api.post('user/declineInvite', { channelName, userId })
  }

  async getChannel (channelName: string): Promise<ExtraChannel> {
    return api.get('channel/getChannel/' + channelName).then((response) => response.data)
  }

  async createChannel (channelName: string, isPrivate: boolean): Promise<ExtraChannel> {
    return api.post('channel/createChannel', { channelName, isPrivate }).then((response) => response.data)
  }

  async deleteChannel (channelName: string): Promise<boolean> {
    return api.post('channel/deleteChannel', { channelName }).then((response) => response.data)
  }
}

export default new ChannelService()
