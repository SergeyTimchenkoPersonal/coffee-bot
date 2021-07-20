require('dotenv').config()
const mongoose = require('mongoose')
const User = require('./models/User')
const drinkCategories = require('./config/drinkCategories.json')
const drinkCategoriesKeyboard = require('./config/drinkCategoriesKeyboard')
const drinksKeyboard = require('./config/drinksKeyboard')
const drinks = require('./config/drinks')
const { getDayOfWeek } = require('./services/helper')
const { coffeeDayJob } = require('./services/cron')
const bot = require('./controllers/bot')

const start = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
			useFindAndModify: false,
		})
		console.log('Database is connected!')
	} catch (e) {
		console.log('Server error', e.message)
		process.exit(1)
	}

	bot.on(
		'message',
		async ({ from, chat: { id: chat_id }, text, message_id }) => {
			try {
				const user = await User.findOne({ chat_id })
				if (text === '/start') {
					if (!user) {
						await User.create({
							...from,
							chat_id,
						})
					}
					const { message_id } = await bot.sendMessage(
						chat_id,

					)
					await User.findOneAndUpdate({ chat_id }, { message_id })
				} else if (text === '/menu') {
					sendMenu(user.chat_id)
				} else if (text === 'Напитки') {
					return bot.sendMessage(
						user.chat_id,
						'Категории напитков',
						generateKeyboard(drinkCategoriesKeyboard)
					)
				} else if (Object.values(drinkCategories).includes(text)) {
					sendDrinksOfCategory(user.chat_id, text)
				} else if (text === '/contacts') {
					sendContacts(user.chat_id)
				} else if (text === '/coffee_day') {
					sendCoffeeDayMessage(user.chat_id)
				}
			} catch (error) {
				console.log(error)
			}
		}
	)
}

start()
