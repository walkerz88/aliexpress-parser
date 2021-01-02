const config = require('../../config');
const languages = require('../dictionaries/languages.js');

config.language = config.language || 'RU';

function groupResults (array) {
	let results = {};
	switch (config.groupBy) {
		case 'language':
			array.forEach(item => {
				const country = item.country;
				if (country) {
					if (results[country]) {
						results[country].push(item);
					} else {
						results[country] = [item];
					}
				}
			});

			let keys = Object.keys(results);

			if (keys.length) {
				let sortedKeys = keys.sort(a => a === config.sortLanguage ? 1 : -1);
				let sortedResults = {};

				sortedKeys.forEach(key => {
					sortedResults[key] = results[key];
				});

				results = sortedResults;
			}

			for (let key in results) {
				let feedbacks = results[key];
				feedbacks = feedbacks.sort((a, b) => a.content.length - b.content.length);
			}

			break;
		case 'rating':
			for (let i = 1; i <= 5; i++) {
				let starsArray = array.filter(item => item.rating === i);
				starsArray = array.map(item => {
					return {
						name: item.displayName || null,
						country: item.country || null,
						content: item.content
					}
				});
				results[`${languages[config.language].GROUP_BY_RATING} ${i}`] = starsArray;
			}
			break;
		default:
			array = array.sort((a, b) => a.content.length - b.content.length);
			array = array.sort(a => a.country === config.sortLanguage ? 1 : -1);
			results = {
				[languages[config.language].GROUP_BY_DEFAULT]: array
			}
	}
	return results;
}

module.exports = groupResults;