const scraper = require('./src/modules/scraper');
const getProductIdByName = require('./src/getProductIdByName');
const prompts = require('prompts');

(async () => {
		let searchType = await prompts({
			type: 'select',
			name: 'value',
			message: 'Search product by:',
			choices: [
				{ title: 'id', value: 'id' },
				{ title: 'name', value: 'name' }
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
				message: 'Product ID:',
				validate: value => value ? true : 'Please, enter ID of the product.'
			});
	
			productId = productId.value;
	
			if (!productId) {
				return;
			}

			getProductById(productId).then(res => {
				printResults(res);
			});
		} else if (searchType === 'name') {
			let productName = await prompts({
				type: 'text',
				name: 'value',
				message: 'Product name: ',
				validate: value => value ? true : 'Please, enter product name.'
			});

			productName = productName.value;

			if (!productName) {
				return;
			}

			getProductIdByName(productName).then(id => {
				if (id) {
					console.log(`Product id: ${id}`)
					getProductById(id).then((res) => {
						printResults(res);
					});
				}
			});
		}

		function printResults (product) {
			const feedback = product.feedback;
			if (feedback && Array.isArray(feedback) && feedback.length) {
				let array = feedback.filter(item => item.content);
				if (array.length) {
					array = array.map(item => {
						return {
							rating: item.rating,
							content: item.content
						}
					});

					let results = {};

					for (let i = 1; i <= 5; i++) {
						let starsArray = array.filter(item => item.rating === i);
						results[i] = starsArray;
					}

					if (Object.keys(results).length) {

						for (key in results) {
							let reviews = results[key];

							if (reviews && Array.isArray(reviews) && reviews.length) {
								console.log('');
								console.log(`Оценка: ${key}`);
								reviews = reviews.map(item => item.content);
								console.log(reviews);
							}
						}
					}

				}

				console.log('');
				console.log('---^-----------');
				console.log(product.title);
				console.log('');
			} 
		}

		function getProductById (id) {
			return new Promise(resolve => {

				const product = scraper(id);
				console.log('Fetching product data, please wait...');
				
				product.then(res => {
					console.log('product.then')
					resolve(res);
				});
			})
		}
})();