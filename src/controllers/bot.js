const TelegramBotAPI = require('node-telegram-bot-api')

const bot = new TelegramBotAPI(process.env.TOKEN, { polling: true })

module.exports = bot