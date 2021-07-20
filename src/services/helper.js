const coffeeShops = require('../config/coffeeShops.json')
const drinkCategories = require('../config/drinkCategories.json')
const drinkCategoriesKeyboard = require('../config/drinkCategoriesKeyboard')
const drinksKeyboard = require('../config/drinksKeyboard')
const drinks = require('../config/drinks')
const messageTexts = require('../config/messageTexts.json')

const getWeekDay = day => {
	switch (day) {
		case 1:
			return 'Понедельник'
			break
		case 2:
			return 'Вторник'
			break
		case 3:
			return 'Среда'
			break
		case 4:
			return 'Четверг'
			break
		case 5:
			return 'Пятница'
			break
		case 6:
			return 'Суббота'
			break
		case 0:
			return 'Воскресенье'
			break
		default:
			break
	}
}

const generateKeyboard = (buttons, hasBackButton = false) => {
	if (hasBackButton) buttons.push(['Назад'])
	return {
		reply_markup: JSON.stringify({
			keyboard: buttons,
		}),
		resize_keyboard: true,
	}
}

const getDayDrinks = day => {
	let result = ''
	for (const key in drinks) {
		result += `${drinkCategories[key]}:  ${drinks[key][day]}\n`
	}
	return result
}

const getMessage = (type, data) => {
	let msg = messageTexts[type]
	for(const key in data) {
		msg = msg.replace([`${key}`, data[key]])
	}
	return msg
}

module.exports = {
	getWeekDay,
	generateKeyboard,
	getDayDrinks,
	getMessage
}
