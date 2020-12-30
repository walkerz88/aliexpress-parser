const puppeteer = require('puppeteer');
const prompts = require('prompts');
let config = require('../../config');
const languages = require('../dictionaries/languages.js');

config.language = config.language || 'RU';
config.searchByNameMaxResults = config.searchByNameMaxResults || 5;
config.searchByNameResultsLength = config.searchByNameResultsLength || 64;

async function getProductIdByName(productname) {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();

	await page.goto(`https://aliexpress.ru/wholesale?trafficChannel=main&SearchText=${productname}&SortType=total_tranpro_desc`);
	const aliExpressData = await page.evaluate(() => runParams);
	const items = aliExpressData.items;

	await browser.close();

	if (items && Array.isArray(items) && items.length) {
		const topItems = items.splice(0, config.searchByNameMaxResults);
		const choices = topItems.map(item => {
			let title = item.title;

			if (title.length > config.searchByNameResultsLength) { 
				title = title.slice(0, config.searchByNameResultsLength);
			}
			
			return {
				title,
				value: item.productId
			}
		})

		let selectedItemId = await prompts({
			type: 'select',
			name: 'value',
			message: languages[config.language].SELECT_PRODUCT,
			choices,
			initial: 0
		});

		selectedItemId = selectedItemId.value;

		return selectedItemId;
	} else {
		return null;
	}

}

module.exports = getProductIdByName;