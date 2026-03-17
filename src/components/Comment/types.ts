export interface Reply {
  id: string;
  username: string;
  avatar: string;
  content: string;
  createdAt: string;
  likes: number;
  liked: boolean;
}

export interface Comment {
  id: string;
  username: string;
  avatar: string;
  content: string;
  createdAt: string;
  likes: number;
  liked: boolean;
  replies: Reply[];
}
