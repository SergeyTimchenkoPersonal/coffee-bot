const {
	CLASSIC,
	SPECIAL,
	COLD,
	FRESH,
	HOT,
	TEA,
	BAR,
	LEMONADES,
	SEASON,
} = require('./drinkCategories.json')

module.exports = [
	[CLASSIC, SPECIAL],
	[COLD, FRESH],
	[HOT, TEA],
	[BAR, SEASON],
]
