const puppeteer = require('puppeteer');

async function getProductIdByName(productname) {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();

	await page.goto(`https://aliexpress.ru/wholesale?trafficChannel=main&SearchText=${productname}&SortType=total_tranpro_desc`);
	const aliExpressData = await page.evaluate(() => runParams);
	const items = aliExpressData.items;

	if (items && Array.isArray(items) && items.length) {
		const topItem = items[0];
		const id = topItem.productId;
		return id;
	} else {
		throw new Error('No items found.');
	}

}

module.exports = getProductIdByName;