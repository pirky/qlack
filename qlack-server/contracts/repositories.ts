// here we are declaring our MessageRepository types for Repositories/MessageRepository
// container binding. See providers/AppProvider.ts for how we are binding the implementation
declare module '@ioc:Repositories/MessageRepository' {
  export interface Message {
    authorId: number
    content: string
    channelId: number
    createdAt: string
    updatedAt: string
    id: number
    author: string
  }

  export interface MessageRepositoryContract {
    getAll(channelName: string): Promise<Message[]>
    create(channelName: string, userId: number, content: string): Promise<Message>
  }

  const MessageRepository: MessageRepositoryContract
  export default MessageRepository
}
