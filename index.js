const scraper = require('./src/modules/scraper');
const stdio = require('stdio');

(async () => {
	let idValid = false;

	while (!idValid) {
		const productId = await stdio.ask('Product ID: ');
	
		if (!/^\d+$/.test(productId)) {
			console.log('Product id must be a number');
		} else {
			idValid = true;
	
			const product = scraper(productId);
			
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
		}
	}
})();