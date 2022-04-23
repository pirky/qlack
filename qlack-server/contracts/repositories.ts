// here we are declaring our MessageRepository types for Repositories/MessageRepository
// container binding. See providers/AppProvider.ts for how we are binding the implementation
declare module '@ioc:Repositories/MessageRepository' {
  export interface Message {
    id: number
    authorId: number
    content: string
    channelId: number
    createdAt: string
    updatedAt: string
    author: string
  }

  export interface MessageRepositoryContract {
    loadSome(channelName: string, id: number): Promise<Message[]>
    create(channelName: string, userId: number, content: string): Promise<Message>
  }

  const MessageRepository: MessageRepositoryContract
  export default MessageRepository
}
