import { VirtualNumber } from '../types';
import { logger } from './logger';

export class NumberProvider {
  private providers = new Map<string, Provider>();

  registerProvider(name: string, provider: Provider) {
    this.providers.set(name, provider);
    logger.info(`Registered provider: ${name}`);
  }

  async getNumber(provider: string): Promise<VirtualNumber | null> {
    const providerImpl = this.providers.get(provider);
    if (!providerImpl) {
      logger.error(`Provider not found: ${provider}`);
      return null;
    }

    try {
      return await providerImpl.getNumber();
    } catch (error) {
      logger.error('Error getting number', { provider, error });
      return null;
    }
  }
}

interface Provider {
  getNumber(): Promise<VirtualNumber | null>;
  releaseNumber(number: string): Promise<boolean>;
}