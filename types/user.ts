export interface UserContact {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  status: string;
  bio: string;
  theme: string;
  lastSeen: string;
  createdAt: string;
  updatedAt: string;
}

export interface UsersResponse {
  status: string;
  results: number;
  data: {
    users: UserContact[];
  };
} 