import { api } from 'src/boot/axios'
import { Channel, ExtraChannel, Message, RawMessage } from 'src/contracts'
import { BootParams, SocketManager } from './SocketManager'

class ChannelSocketManager extends SocketManager {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  public subscribe ({ store }: BootParams): void {
    const channelName = this.namespace.split('/').pop() as string

    this.socket.on('message', (message: Message) => {
      store.commit('channels/NEW_MESSAGE', { channelName, message })
    })

    this.socket.on('changeUserState', (user: { nickname: string, activeState: string }) => {
      store.commit('channels/CHANGE_USER_STATE', { nickname: user.nickname, activeState: user.activeState })
    })

    this.socket.on('kickUser', ({ victimNickname, channelName }: {victimNickname: string, channelName: string}) => {
      if (store.state.channels.active === channelName) {
        store.commit('channels/KICK_USER', { victimNickname, channelName })
        if (victimNickname === store.state.auth.user.nickname) {
          // opened channel and I am kicked
          store.dispatch('channels/leave', channelName)
        }
      } else {
        store.commit('channels/DELETE_CHANNEL', channelName)
      }
    })

    this.socket.on('joinUser', ({ userNickname, activeState, channelName }: {userNickname: string, activeState: string, channelName: string}) => {
      if (store.state.channels.active === channelName) {
        store.commit('channels/ADD_USER', { userNickname, activeState })
      }
    })

    this.socket.on('inviteUser', ({ invitedUser, channel }: {invitedUser: string, channel: Channel}) => {
      if (store.state.auth.user.nickname === invitedUser) {
        store.commit('channels/ADD_CHANNEL', { channel })
      }
    })
  }

  public addMessage (message: RawMessage): Promise<Message> {
    return this.emitAsync('addMessage', message)
  }

  public loadMessages (id: number): Promise<Message[]> {
    return this.emitAsync('loadMessages', id)
  }

  public updateState (newState: string): Promise<boolean> {
    return this.emitAsync('changeUserState', newState)
  }

  public kickUser (channelName: string, nickname: string) {
    return this.emitAsync('kickUser', { channelName, nickname })
  }

  public joinExisting (channelName: string): Promise<boolean> {
    return this.emitAsync('joinExisting', { channelName })
  }

  public inviteUser (channelName: string, invitedUser: string): Promise<boolean> {
    return this.emitAsync('inviteUser', { channelName, invitedUser })
  }
}

class ChannelService {
  private channels: Map<string, ChannelSocketManager> = new Map()
  private inviteSocket: ChannelSocketManager = new ChannelSocketManager('/')

  public getInviteSocket (): ChannelSocketManager {
    return this.inviteSocket
  }

  public isBanned (channelId: number, invitedUser: string) {
    return api.post('channel/isBanned', { channelId, invitedUser }).then((response) => response.data)
  }

  public async isInvited (channelId: number, invitedUser: string) {
    return await api.post('channel/isInvited', { channelId, invitedUser }).then((response) => response.data)
  }

  public join (name: string): ChannelSocketManager {
    if (this.channels.has(name)) {
      throw new Error(`User is already joined in channel "${name}"`)
    }

    // connect to given channel namespace
    const channel = new ChannelSocketManager(`/channels/${name}`)
    this.channels.set(name, channel)
    return channel
  }

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

  async acceptInvite (channelName: string):Promise<void> {
    await api.post('user/acceptInvite', { channelName })
  }

  async declineInvite (channelName: string) :Promise<void> {
    await api.post('user/declineInvite', { channelName })
  }

  async updateNotification (notificationType: string): Promise<void> {
    await api.post('user/updateNotification', { notificationType })
  }

  async getChannel (channelName: string): Promise<ExtraChannel> {
    return api.get('channel/getChannel/' + channelName).then((response) => response.data)
  }

  async getUsers (channelName: string): Promise<[{ nickname: string, activeState: string}]> {
    return await api.get('channel/getUsers/' + channelName).then((response) => response.data)
  }

  async getAllUsers (): Promise<[string]> {
    return await api.get('user/getAllUsers').then((response) => response.data)
  }

  async createChannel (channelName: string, isPrivate: boolean): Promise<ExtraChannel> {
    return api.post('channel/createChannel', { channelName, isPrivate }).then((response) => response.data)
  }

  async deleteChannel (channelName: string): Promise<boolean> {
    return api.post('channel/deleteChannel', { channelName }).then((response) => response.data)
  }
}

export default new ChannelService()
