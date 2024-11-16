import { Telegraf } from 'telegraf';
import { env } from './config/env';
import { logger } from './services/logger';
import { prisma } from './services/database';
import { NumberProvider } from './services/numberProvider';
import { setupCommands } from './bot/commands';
import { authMiddleware } from './bot/middleware/auth';

async function startServer() {
  try {
    // Test database connection
    await prisma.$connect();
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
    process.once('SIGINT', () => {
      bot.stop('SIGINT');
      prisma.$disconnect();
    });
    process.once('SIGTERM', () => {
      bot.stop('SIGTERM');
      prisma.$disconnect();
    });
  } catch (error) {
    logger.error('Failed to start server', { error });
    process.exit(1);
  }
}

startServer();