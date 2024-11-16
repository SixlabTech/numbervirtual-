export interface Message {
  id: string;
  from: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
}