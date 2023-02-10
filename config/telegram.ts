/**
 * Config source: https://git.io/Jfefl
 *
 * Feel free to let us know via PR, if you find something broken in this config
 * file.
 */
import Env from '@ioc:Adonis/Core/Env'

const telegramConfig = {
  telegramBotToken: Env.get('TELEGRAM_BOT_TOKEN'),
  telegramChatId: Env.get('TELEGRAM_CHAT_ID'),
}

export default telegramConfig
