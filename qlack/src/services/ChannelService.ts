import { api } from 'src/boot/axios'
import { Channel, ExtraChannel, Message, RawMessage } from 'src/contracts'
import { BootParams, SocketManager } from './SocketManager'
import { channelService } from 'src/services/index'

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

    this.socket.on('deleteChannel', ({ channelName }: {channelName: string}) => {
      if (store.state.channels.active === channelName) {
        store.commit('channels/CLEAR_CHANNEL', channelName)
      } else {
        store.commit('channels/DELETE_CHANNEL', channelName)
      }
      channelService.leave(channelName)
    })

    this.socket.on('cancelChannel', ({ victimNickname, channelName }: {victimNickname: string, channelName: string}) => {
      if (store.state.channels.active === channelName) {
        store.commit('channels/KICK_USER', { victimNickname, channelName })
      }
    })

    this.socket.on('currWriting', ({ writer, channelName, message }: {writer: string, channelName: string, message: string}) => {
      if (store.state.channels.active === channelName) {
        store.commit('channels/CURR_WRITING', { writer, message })
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

  public revokeUser (channelName: string, nickname: string) {
    return this.emitAsync('revokeUser', { channelName, nickname })
  }

  public acceptInvite (channelName: string): Promise<boolean> {
    return this.emitAsync('acceptInvite', { channelName })
  }

  public deleteChannel (channelName: string): Promise<boolean> {
    return this.emitAsync('deleteChannel', { channelName })
  }

  public currWriting (channelName: string, message: string): Promise<boolean> {
    return this.emitAsync('currWriting', { channelName, message })
  }
}

class ChannelService {
  private channels: Map<string, ChannelSocketManager> = new Map()
  private inviteSocket: ChannelSocketManager = new ChannelSocketManager('/')

  public getInviteSocket (): ChannelSocketManager | null {
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
}

export default new ChannelService()
