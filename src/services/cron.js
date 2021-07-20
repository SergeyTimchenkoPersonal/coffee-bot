const CronJob = require('cron').CronJob
const User = require('../models/User')
const { sendCoffeeDayMessage } =require('../services/messages')

const coffeeDayJob = new CronJob('0 0 13 * * *', async () => {
    const users = await User.find({})

    await Promise.all(
        users.map((i) => {
            sendCoffeeDayMessage(i.chat_id)
        })
    )
})

module.exports = {
    coffeeDayJob
}