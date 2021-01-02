const groupResults = require('./groupResults');
const printByColor = require('./printByColor');
let config = require('../../config');
const languages = require('../dictionaries/languages');

config.language = config.language || 'RU';
config.infoToShow = config.infoToShow || [
	'feedbacks',
	'productId',
	'title'
];

function printResults (product) {
	const arrayToShow = config.infoToShow;
	if (arrayToShow && Array.isArray(arrayToShow) && arrayToShow.length) {
		arrayToShow.forEach(key => {
			if (product[key]) {
				if (key === 'feedbacks') {
					console.log('----------');
					printFeedbacks(product[key]);
					console.log('');
				} else {
					console.log('----------');
					printByColor('cyan', key);
					console.log(product[key]);
					console.log('');
				}
			}
		});
		console.log('');
	} else {
		printByColor('cyan', languages[config.language].NO_INFOTOSHOW_ERROR);
	}
}

function printFeedbacks (feedbacks) {
	if (feedbacks && Array.isArray(feedbacks) && feedbacks.length) {
		feedbacks = feedbacks.filter(item => item.content);
		if (feedbacks.length) {
			feedbacks = feedbacks.map(item => {
				return {
					rating: item.rating,
					name: item.displayName || null,
					country: item.country || null,
					content: item.content
				}
			});

			let results = groupResults(feedbacks);

			if (Object.keys(results).length) {
				let emptyFeedbacks = 0;

				for (key in results) {
					let feedbacks = results[key];

					if (feedbacks && Array.isArray(feedbacks) && feedbacks.length) {
						feedbacks = feedbacks.filter(item => item.content && item.content.length >= config.feedbackMinLength);
						if (feedbacks && feedbacks.length) {
							printByColor('cyan', key);
							console.log(feedbacks);
						} else {
							emptyFeedbacks += 1;
						}
					}
				}

				if (emptyFeedbacks && emptyFeedbacks === Object.keys(results).length) {
					console.log('');
					printByColor('cyan', languages[config.language].NO_MATCHING_FEEDBACKS);
				}
			} else {
				console.log('');
				printByColor('cyan', languages[config.language].CANT_COMBINE_RESULTS);
			}
		} else {
			console.log('');
			printByColor('cyan', languages[config.language].NO_FEEDBACKS);
		}

	} else {
		console.log('');
		printByColor('cyan', languages[config.language].NO_FEEDBACKS);
	}
}

module.exports = printResults;