import { ObjectId } from 'mongodb';

export interface User {
  _id?: ObjectId;
  telegramId: string;
  activeNumbers: string[];
  credits: number;
}

export interface VirtualNumber {
  _id?: ObjectId;
  id: string;
  phoneNumber: string;
  provider: string;
  status: 'available' | 'assigned';
  userId?: string;
  assignedAt?: Date;
  createdAt: Date;
  expiresAt: Date;
}

export interface SMS {
  _id?: ObjectId;
  virtualNumberId: string;
  from: string;
  content: string;
  receivedAt: Date;
}