const { Schema, model, Types } = require('mongoose')

const schema = new Schema({
	chat_id: { type: String, required: true },
	username: { type: String, required: true },
	is_bot: { type: Boolean, default: false },
	first_name: { type: String },
	last_name: { type: String },
	language_code: { type: String },
	message_id: { type: Number },
})

module.exports = model('User', schema)
