export interface Member {
  _id: string;
  username: string;
  avatar?: string;
}

export interface ChatRoom {
  _id: string;
  type: string;
  members: Member[];
  messages: any[]; // You can define a Message interface if needed
  groupOwner: Member[];
  groupName: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ChatResponse {
  status: string;
  data: ChatRoom[];
} 

export interface CreateChatResponse {
  status: string;
  data: ChatRoom;
}