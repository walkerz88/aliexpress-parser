const scraper = require('./src/modules/scraper');
const getProductIdByName = require('./src/helpers/getProductIdByName');
const prompts = require('prompts');
let config = require('./config');
const languages = require('./src/dictionaries/languages.js');

config.sortLanguage = config.sortLanguage || 'RU';
config.feedbackMinLength = config.feedbackMinLength || 0;
config.language = config.language || 'RU';

const initTool = async () => {
	let searchType = await prompts({
		type: 'select',
		name: 'value',
		message: languages[config.language].SEARCH_BY,
		choices: [
			{ title: languages[config.language].SEARCH_BY_ID, value: 'id' },
			{ title: languages[config.language].SEARCH_BY_NAME, value: 'name' }
		],
		initial: 0
	});

	searchType = searchType.value;

	if (!searchType) {
		return;
	}

	if (searchType === 'id') {
		let productId = await prompts({
			type: 'number',
			name: 'value',
			message: `${languages[config.language].PRODUCT_ID} `,
			validate: value => value ? true : languages[config.language].ENTER_PRODUCT_ID_ERROR
		});

		productId = productId.value;

		if (!productId) {
			return;
		}

		try {
			getProductById(productId).then(res => {
				printResults(res);
			});
		} catch (e) {
			console.log('');
			console.log('\x1b[36m%s\x1b[0m', e);
			console.log('');
			finish();
		}
	} else if (searchType === 'name') {
		let productName = await prompts({
			type: 'text',
			name: 'value',
			message: `${languages[config.language].PRODUCT_NAME} `,
			validate: value => value ? true : languages[config.language].ENTER_PRODUCT_NAME_ERROR
		});

		productName = productName.value;

		if (!productName) {
			return;
		}

		try {
			getProductIdByName(productName).then(id => {
				if (id) {
					console.log(`${languages[config.language].PRODUCT_ID} ${id}`)
					getProductById(id).then((res) => {
						printResults(res);
					});
				} else {
					console.log('');
					console.log('\x1b[36m%s\x1b[0m', languages[config.language].NO_ITEMS_FOUND);
					console.log('');
					finish();
				}
			});
		} catch(e) {
			console.log('');
			console.log('\x1b[36m%s\x1b[0m', e);
			console.log('');
			finish();
		}
	}
}

initTool();

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
				results[`Rating: ${i}`] = starsArray;
			}
			break;
		default:
			array = array.sort((a, b) => a.content.length - b.content.length);
			array = array.sort(a => a.country === config.sortLanguage ? 1 : -1);
			results = {'Feedbacks:': array}
	}
	return results;
}

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

				for (key in results) {
					let feedbacks = results[key];

					if (feedbacks && Array.isArray(feedbacks) && feedbacks.length) {
						feedbacks = feedbacks.filter(item => item.content && item.content.length >= config.feedbackMinLength);
						if (feedbacks && feedbacks.length) {
							console.log('');
							console.log(key);
							console.log(feedbacks);
						}
					}
				}
			} else {
				console.log('');
				console.log('\x1b[36m%s\x1b[0m', languages[config.language].CANT_COMBINE_RESULTS);
			}
		} else {
			console.log('');
			console.log('\x1b[36m%s\x1b[0m', languages[config.language].NO_FEEDBACKS);
		}

		printFooter (`${product.productId} ${product.title}`);
		finish();

	} else {
		console.log('');
		console.log('\x1b[36m%s\x1b[0m', languages[config.language].NO_FEEDBACKS);
		printFooter (`${product.productId} ${product.title}`);
		finish();
	}
}

async function finish () {
	let finishType = await prompts({
		type: 'select',
		name: 'value',
		message: languages[config.language].FINISH_QUESTION,
		choices: [
			{ title: languages[config.language].FINISH_QUESTION_YES, value: true },
			{ title: languages[config.language].FINISH_QUESTION_NO, value: false }
		],
		initial: 0
	});

	finishType = finishType.value;

	if (finishType) {
		initTool();
	} else {
		return;
	}
}

function printFooter (text) {
	console.log('');
	console.log('---^-----------');
	console.log(text);
	console.log('');
}

function getProductById (id) {
	return new Promise(resolve => {
		console.log(languages[config.language].FETCHING_IN_PROGRESS);
		
		const product = scraper(id);
		
		product.then(res => {
			resolve(res);
		});
	})
}