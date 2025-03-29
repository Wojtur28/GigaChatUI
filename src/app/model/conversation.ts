import {ConversationType} from './conversationType';

export type Conversation = {
  id: string
  name: string
  type: ConversationType
  members: string[]
  createdAt: Date
  updatedAt: Date
}
