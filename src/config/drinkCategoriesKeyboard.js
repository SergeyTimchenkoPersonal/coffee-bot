const {
	CLASSIC,
	SPECIAL,
	COLD,
	FRESH,
	HOT,
	TEA,
	BAR,
	LIMONADES,
	SEASON,
} = require('./drinkCategories.json')

module.exports = [
	[CLASSIC, SPECIAL],
	[COLD, FRESH],
	[HOT, TEA],
	[BAR, SEASON],
]
