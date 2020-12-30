const puppeteer = require('puppeteer');
const prompts = require('prompts');

async function getProductIdByName(productname) {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();

	await page.goto(`https://aliexpress.ru/wholesale?trafficChannel=main&SearchText=${productname}&SortType=total_tranpro_desc`);
	const aliExpressData = await page.evaluate(() => runParams);
	const items = aliExpressData.items;

	await browser.close();

	if (items && Array.isArray(items) && items.length) {
		const topItems = items.splice(0, 5);
		const choices = topItems.map(item => {
			let title = item.title;

			if (title.length > 64) { 
				title = `${title.slice(0, 64)}...`;
			}
			
			return {
				title,
				value: item.productId
			}
		})

		let selectedItemId = await prompts({
			type: 'select',
			name: 'value',
			message: 'Select your product:',
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