export interface Member {
  _id: string;
  username: string;
  avatar?: string;
}

export interface ChatRoom {
  _id: string;
  type: string;
  members: Member[];
  messages: Message[]; 
  groupOwner: Member[];
  groupName: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

type MessageType = "text" | "image" | "video" | "file";
export interface Message {
  id: string;
  chatId: string,
  senderId: string;
  content?: string;
  messageType: MessageType;
  fileUrl?: string;
  timestamp: string;
  status: "sending" | "sent" | "delivered" | "read";
}


export interface ChatResponse {
  status: string;
  data: ChatRoom[];
} 

export interface CreateChatResponse {
  status: string;
  data: ChatRoom;
}