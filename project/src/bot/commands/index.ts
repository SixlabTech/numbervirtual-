import { Telegraf } from 'telegraf';
import { logger } from '../../services/logger';
import { db } from '../../services/database';
import { NumberProvider } from '../../services/numberProvider';

export function setupCommands(
  bot: Telegraf,
  numberProvider: NumberProvider
) {
  bot.command('start', async (ctx) => {
    try {
      const telegramId = ctx.from.id.toString();
      let user = await db.findUserByTelegramId(telegramId);

      if (!user) {
        user = await db.createUser({
          telegramId,
          credits: 0,
          activeNumbers: []
        });
      }

      await ctx.reply(
        'Welcome to Virtual Phone Number Bot!\n\n' +
        'Available commands:\n' +
        '/numbers - List your active numbers\n' +
        '/get_number - Get a new virtual number\n' +
        '/balance - Check your credit balance'
      );
    } catch (error) {
      logger.error('Error in start command', { error });
      await ctx.reply('Sorry, something went wrong. Please try again later.');
    }
  });

  bot.command('numbers', async (ctx) => {
    try {
      const user = await db.findUserByTelegramId(ctx.from.id.toString());
      if (!user) {
        await ctx.reply('Please start the bot first with /start');
        return;
      }

      const numbers = await db.getUserNumbers(user._id.toString());

      if (numbers.length === 0) {
        await ctx.reply('You don\'t have any active numbers.');
        return;
      }

      const message = numbers
        .map(n => `📱 ${n.phoneNumber}\nExpires: ${n.expiresAt.toLocaleDateString()}`)
        .join('\n\n');

      await ctx.reply(message);
    } catch (error) {
      logger.error('Error in numbers command', { error });
      await ctx.reply('Sorry, something went wrong. Please try again later.');
    }
  });

  bot.command('get_number', async (ctx) => {
    try {
      const user = await db.findUserByTelegramId(ctx.from.id.toString());
      if (!user || user.credits < 1) {
        await ctx.reply('You need credits to get a number. Use /balance to check your balance.');
        return;
      }

      const number = await numberProvider.getNumber('default');
      if (!number) {
        await ctx.reply('Sorry, no numbers are available right now. Please try again later.');
        return;
      }

      await db.assignNumberToUser(number.id, user._id.toString());
      await db.updateUserCredits(user.telegramId, user.credits - 1);

      await ctx.reply(
        `✅ Number assigned: ${number.phoneNumber}\n` +
        `Expires: ${number.expiresAt.toLocaleDateString()}\n\n` +
        'You will receive SMS messages here automatically.'
      );
    } catch (error) {
      logger.error('Error in get_number command', { error });
      await ctx.reply('Sorry, something went wrong. Please try again later.');
    }
  });

  bot.command('balance', async (ctx) => {
    try {
      const user = await db.findUserByTelegramId(ctx.from.id.toString());
      if (!user) {
        await ctx.reply('Please start the bot first with /start');
        return;
      }

      await ctx.reply(`Your current balance: ${user.credits} credits`);
    } catch (error) {
      logger.error('Error in balance command', { error });
      await ctx.reply('Sorry, something went wrong. Please try again later.');
    }
  });
}