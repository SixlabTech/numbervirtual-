import { MongoClient, Db, Collection } from 'mongodb';
import { logger } from './logger';
import { User, VirtualNumber, SMS } from '../types';
import { env } from '../config/env';

class Database {
  private client: MongoClient;
  private db: Db | null = null;

  constructor() {
    this.client = new MongoClient(env.DATABASE_URL);
  }

  async connect(): Promise<void> {
    try {
      await this.client.connect();
      this.db = this.client.db();
      logger.info('Connected to MongoDB');
    } catch (error) {
      logger.error('MongoDB connection error', { error });
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    await this.client.close();
    logger.info('Disconnected from MongoDB');
  }

  private getCollection<T>(name: string): Collection<T> {
    if (!this.db) {
      throw new Error('Database not connected');
    }
    return this.db.collection<T>(name);
  }

  // User operations
  async findUserByTelegramId(telegramId: string): Promise<User | null> {
    return await this.getCollection<User>('users').findOne({ telegramId });
  }

  async createUser(user: Omit<User, '_id'>): Promise<User> {
    const result = await this.getCollection<User>('users').insertOne(user as any);
    return { ...user, _id: result.insertedId } as User;
  }

  async updateUserCredits(telegramId: string, credits: number): Promise<void> {
    await this.getCollection<User>('users').updateOne(
      { telegramId },
      { $set: { credits } }
    );
  }

  // Virtual Number operations
  async findAvailableNumber(): Promise<VirtualNumber | null> {
    return await this.getCollection<VirtualNumber>('virtualNumbers').findOne({
      status: 'available'
    });
  }

  async assignNumberToUser(numberId: string, userId: string): Promise<void> {
    await this.getCollection<VirtualNumber>('virtualNumbers').updateOne(
      { _id: numberId },
      { 
        $set: { 
          status: 'assigned',
          userId,
          assignedAt: new Date()
        }
      }
    );
  }

  async getUserNumbers(userId: string): Promise<VirtualNumber[]> {
    return await this.getCollection<VirtualNumber>('virtualNumbers')
      .find({ userId, status: 'assigned' })
      .toArray();
  }

  // SMS operations
  async saveSMS(sms: Omit<SMS, '_id'>): Promise<SMS> {
    const result = await this.getCollection<SMS>('sms').insertOne(sms as any);
    return { ...sms, _id: result.insertedId } as SMS;
  }

  async findSMSByNumber(virtualNumberId: string): Promise<SMS[]> {
    return await this.getCollection<SMS>('sms')
      .find({ virtualNumberId })
      .sort({ receivedAt: -1 })
      .toArray();
  }
}

export const db = new Database();