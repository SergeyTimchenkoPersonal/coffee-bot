const { generateKeyboard, generateCoffeeDay, getDayOfWeek, generateMessage} = require('./helper')

const coffeeShops = require('../config/coffeeShops.json')
const drinkCategories = require('../config/drinkCategories.json')
const drinkCategoriesKeyboard = require('../config/drinkCategoriesKeyboard')
const drinksKeyboard = require('../config/drinksKeyboard')
const drinks = require('../config/drinks')
const messageTexts = require('../config/messageTexts.json')

const sendDrinksDay = async chatId => {
    try {
        const day = new Date().getDay()
        const message = generateMessage()
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

const sendContacts = async chatId => {
    await bot.sendMessage(
        chatId,
        messageTexts.contacts
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

const sendDrinks = async (chatId, text) => {
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

const sendMenu = async chatId => {
    return bot.sendMessage(
        chatId,
        'Выберите что вас интересует из нашего меню',
        generateKeyboard([['Напитки'], ['Добавки'], ['Вкусняшки'], ['Назад']])
    )
}

const sendError = async chatId => {
    return bot.sendMessage(
        chatId,
        messageTexts.error
    )
}

module.exports = {
    sendDrinksDay,
    sendContacts,
    sendDrinks,
    sendMenu,
    sendError
}