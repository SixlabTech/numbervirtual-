import { Context } from 'telegraf';
import { env } from '../../config/env';
import { logger } from '../../services/logger';

export async function authMiddleware(ctx: Context, next: () => Promise<void>) {
  try {
    if (!ctx.from) {
      logger.warn('No user in context');
      return;
    }

    const isAdmin = ctx.from.id.toString() === env.ADMIN_USER_ID;
    ctx.state.isAdmin = isAdmin;

    await next();
  } catch (error) {
    logger.error('Error in auth middleware', { error });
  }
}