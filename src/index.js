require('dotenv').config()
const TeLegramBotAPI = require('node-telegram-bot-api')
const mongoose = require('mongoose')
var CronJob = require('cron').CronJob
const User = require('./models/User')
const drinkCategories = require('./config/drinkCategories.json')
const drinkCategoriesKeyboard = require('./config/drinkCategoriesKeyboard')
const drinksKeyboard = require('./config/drinksKeyboard')
const coffeeShops = require('./config/coffeeShops.json')
const drinks = require('./config/drinks')
const { getDayOfWeek } = require('./helper')

const bot = new TeLegramBotAPI(process.env.TOKEN, { polling: true })

const coffeeDayJob = new CronJob('* * * * * *', async () => {
	const users = await User.find({})

	await Promise.all(
		users.map((i) => {
			sendCoffeeDayMessage(i.chat_id)
		})
	)
})
coffeeDayJob.start()

const generateKeyboard = (arr, hasBackButton = false) => {
	if (hasBackButton) arr.push(['Назад'])
	return {
		reply_markup: JSON.stringify({
			keyboard: arr,
		}),
		resize_keyboard: true,
	}
}

const generateCoffeeDay = (day) => {
	let result = ''
	for (const key in drinks) {
		result += `${drinkCategories[key]}:  ${drinks[key][day]}\n`
	}
	return result
}

const sendCoffeeDayMessage = async (chatId) => {
	try {
		const day = new Date().getDay()
		await bot.sendMessage(
			chatId,
			`День недели: ${getDayOfWeek(
				day
			)}\n\nСегодняшние напитки: \n\n${generateCoffeeDay(day)}`,
			generateKeyboard(drinkCategoriesKeyboard)
		)
	} catch (error) {
		console.log(`Server Error: `, error)
	}
}

const sendContacts = async (chatId) => {
	await bot.sendMessage(
		chatId,
		`Ждём тебя у нас КРУГЛОСУТОЧНО 🌖\n\n
						Vk: https://vk.com/old_school_coffee \n
						Instagram: https://www.instagram.com/old_school_coffee/\n\n
						🏢Мы находимся на :\n\n
						- ул. Петровская, 89а 🔴\n
						- ул. Петровская, 9/11 🔴`
	)
	await bot.sendLocation(
		chatId,
		coffeeShops.FIRST.latitude,
		coffeeShops.FIRST.longitude
	)
	return bot.sendLocation(
		chatId,
		coffeeShops.SECOND.latitude,
		coffeeShops.SECOND.longitude
	)
}

const sendDrinksOfCategory = async (chatId, text) => {
	const category = Object.keys(drinkCategories).reduce((acc, cur) => {
		if (drinkCategories[cur] === text) acc = cur
		return acc
	}, '')
	return bot.sendMessage(
		chatId,
		`Вы выбрали категорию "${drinkCategories[category]}"`,
		generateKeyboard(drinksKeyboard[category], true)
	)
}

const sendMenu = async (chatId) => {
	return bot.sendMessage(
		chatId,
		'Выберите что вас интересует из нашего меню',
		generateKeyboard([['Напитки'], ['Добавки'], ['Вкусняшки'], ['Назад']])
	)
}

const start = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
			useFindAndModify: false,
		})
		console.log('Database is conected!')
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
						`Добро пожаловать, ${from.first_name} \n\n Здесь ты можешь посмотреть меню, узнать про акции и получать специальные промокоды на бесплатные напитки!\n\n
						Список команд:\n
						/contacts - Наши контакты\n
						/coffeeDay - Напитки со скидкой на сегодня\n
						/menu - Здесь вы можете ознакомиться с нашим меню`
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
				bot.sendMessage(
					chat_id,
					'Произошла какая то ошибка внутри меня, попробуйте снова через некоторое время 😉'
				)
			}
		}
	)
}

start()
