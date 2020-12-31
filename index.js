const scraper = require('./src/modules/scraper');
const getProductIdByName = require('./src/helpers/getProductIdByName');
const prompts = require('prompts');
let config = require('./config');
const languages = require('./src/dictionaries/languages.js');

config.sortLanguage = config.sortLanguage || 'RU';
config.feedbackMinLength = config.feedbackMinLength || 0;
config.language = config.language || 'RU';

async function initTool () {
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
			message: languages[config.language].PRODUCT_ID,
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
			printByColor('red', e);
			console.log('');
			finish();
		}
	} else if (searchType === 'name') {
		let productName = await prompts({
			type: 'text',
			name: 'value',
			message: languages[config.language].PRODUCT_NAME,
			validate: value => value ? true : languages[config.language].ENTER_PRODUCT_NAME_ERROR
		});

		productName = productName.value;

		if (!productName) {
			return;
		}

		console.log(languages[config.language].SEARCH_BY_NAME_IN_PROGRESS);

		try {
			getProductIdByName(productName).then(id => {
				if (id) {
					console.log(`${languages[config.language].PRODUCT_ID} ${id}`)
					getProductById(id).then((res) => {
						printResults(res);
					});
				} else {
					console.log('');
					printByColor('cyan', languages[config.language].NO_ITEMS_FOUND);
					console.log('');
					finish();
				}
			});
		} catch(e) {
			console.log('');
			printByColor('red', e);
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
				printByColor('cyan', languages[config.language].CANT_COMBINE_RESULTS);
			}
		} else {
			console.log('');
			printByColor('cyan', languages[config.language].NO_FEEDBACKS);
		}

		printFooter (`${product.productId} ${product.title}`);
		finish();

	} else {
		console.log('');
		printByColor('cyan', languages[config.language].NO_FEEDBACKS);
		printFooter (`${product.productId} ${product.title}`);
		finish();
	}
}

function printByColor (color, text) {
	const reset = '%s\x1b[0m';

	switch (color) {
		case 'bright': color = '\x1b[1m'; break;
		case 'dim': color = '\x1b[2m'; break;
		case 'underscore': color = '\x1b[4m'; break;
		case 'blink': color = '\x1b[5m'; break;
		case 'reverse': color = '\x1b[7m'; break;
		case 'hidden': color = '\x1b[8m'; break;

		case 'black': color = '\x1b[30m'; break;
		case 'red': color = '\x1b[31m'; break;
		case 'green': color = '\x1b[32m'; break;
		case 'yellow': color = '\x1b[33m'; break;
		case 'blue': color = '\x1b[34m'; break;
		case 'magenta': color = '\x1b[35m'; break;
		case 'cyan': color = '\x1b[36m'; break;

		case 'bgBlack': color = '\x1b[40m'; break;
		case 'bgRed': color = '\x1b[41m'; break;
		case 'bgGreen': color = '\x1b[42m'; break;
		case 'bgYellow': color = '\x1b[43m'; break;
		case 'bgBlue': color = '\x1b[44m'; break;
		case 'bgMagenta': color = '\x1b[45m'; break;
		case 'bgCyan': color = '\x1b[46m'; break;
		case 'bgWhite': color = '\x1b[47m'; break;
		default: color = '\x1b[37m';
	}
	
	color = color + reset;

	console.log(color, text);
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