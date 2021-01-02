const groupResults = require('./groupResults');
const printByColor = require('./printByColor');
const config = require('../../config');
const languages = require('../dictionaries/languages');

config.language = config.language || 'RU';

function printResults (product) {
	let feedbacks = product.feedback;
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
							console.log('');
							console.log(key);
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

		printFooter (`${product.productId} ${product.title}`);

	} else {
		console.log('');
		printByColor('cyan', languages[config.language].NO_FEEDBACKS);
		printFooter (`${product.productId} ${product.title}`);
	}
}

function printFooter (text) {
	console.log('');
	console.log('---^-----------');
	console.log(text);
	console.log('');
}

module.exports = printResults;