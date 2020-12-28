const scraper = require('./src/modules/scraper');
const stdio = require('stdio');
const prompts = require('prompts');

(async () => {
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

		const product = scraper(productId);
		console.log('Fetching product data, please wait...');
		
		product.then(res => {
			const feedback = res.feedback;
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
				console.log(res.title);
				console.log('');
			}
		});
})();