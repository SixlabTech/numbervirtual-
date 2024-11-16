import { Telegraf } from 'telegraf';
import { env } from '../config/env';
import { logger } from '../services/logger';
import { db } from '../services/database';
import { NumberProvider } from '../services/numberProvider';
import { setupCommands } from './commands';
import { authMiddleware } from './middleware/auth';

async function main() {
  try {
    // Connect to database
    await db.connect();
    logger.info('Database connection established');

    const bot = new Telegraf(env.TELEGRAM_BOT_TOKEN);
    const numberProvider = new NumberProvider();

    // Middleware
    bot.use(authMiddleware);

    // Setup commands
    setupCommands(bot, numberProvider);

    // Error handling
    bot.catch((err) => {
      logger.error('Bot error', { error: err });
    });

    // Start bot
    await bot.launch();
    logger.info('Bot started successfully');

    // Enable graceful stop
    process.once('SIGINT', async () => {
      bot.stop('SIGINT');
      await db.disconnect();
    });
    process.once('SIGTERM', async () => {
      bot.stop('SIGTERM');
      await db.disconnect();
    });
  } catch (error) {
    logger.error('Failed to start server', { error });
    process.exit(1);
  }
}

main();