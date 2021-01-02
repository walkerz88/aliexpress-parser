const prompts = require('prompts');
const getProductById = require('./src/modules/getProductById');
const getProductIdByName = require('./src/modules/getProductIdByName');
const printResults = require('./src/helpers/printResults');
const printByColor = require('./src/helpers/printByColor');
const languages = require('./src/dictionaries/languages.js');
let config = require('./config');

config.sortLanguage = config.sortLanguage || 'RU';
config.feedbackMinLength = config.feedbackMinLength || 0;
config.language = config.language || 'RU';

/** Init tool sequence */
initTool();

/** Main function */
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
		printError(languages[config.language].NO_SEARCH_TYPE_ERROR);
	}

	if (searchType === 'id') {
		try {
			const results = await getByIdSequence();

			printResults(results);
			finish();
		} catch (e) {
			printError(e);
		}
	} else if (searchType === 'name') {
		try {
			const results = await getByNameSequence();

			printResults(results);
			finish();
		} catch (e) {
			printError(e);
		}
	}
}

async function getByIdSequence () {
	let productId = await prompts({
		type: 'number',
		name: 'value',
		message: languages[config.language].PRODUCT_ID,
		validate: value => value ? true : languages[config.language].ENTER_PRODUCT_ID_ERROR
	});

	productId = productId.value;

	if (!productId) {
		throw new Error(languages[config.language].NO_PRODUCT_ID_ERROR);
	}

	console.log(languages[config.language].FETCHING_IN_PROGRESS);
	
	try {
		const results = await getProductById(productId);
		return results;
	} catch (e) {
		throw new Error(e);
	}
}

async function getByNameSequence () {
	let productName = await prompts({
		type: 'text',
		name: 'value',
		message: languages[config.language].PRODUCT_NAME,
		validate: value => value ? true : languages[config.language].ENTER_PRODUCT_NAME_ERROR
	});

	productName = productName.value;

	if (!productName) {
		throw new Error(languages[config.language].NO_PRODUCT_NAME_ERROR);
	}

	console.log(languages[config.language].SEARCH_BY_NAME_IN_PROGRESS);

	try {
		const id = await getProductIdByName(productName);

		if (!id) {
			throw new Error(languages[config.language].NO_ITEMS_FOUND);
		}

		console.log(`${languages[config.language].PRODUCT_ID} ${id}`);
		console.log(languages[config.language].FETCHING_IN_PROGRESS);

		const results = await getProductById(id);
		return results;
	} catch (e) {
		throw new Error(e);
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
		process.exit();
	}
}

function printError (e) {
	console.log('');
	if (e && e.message) {
		printByColor('bgRed', e.message);
		console.log('')
	}
	if (e && e.stack) {
		printByColor('white', e.stack);
		console.log('');
	}
	if (e && typeof e === 'string') {
		printByColor('red', e);
		console.log('');
	}
	finish();
}