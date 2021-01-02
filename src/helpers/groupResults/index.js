const config = require('../../../config');
const languages = require('../../dictionaries/languages');
const groupByLanguage = require('./src/groupByLanguage');
const groupByRating = require('./src/groupByRating');

config.language = config.language || 'RU';

function groupResults (array) {
	let results = {};
	switch (config.groupBy) {
		case 'language':
			results = groupByLanguage(array);
			break;
		case 'rating':
			results = groupByRating(array);
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