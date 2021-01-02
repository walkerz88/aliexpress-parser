const config = require('../../../../config');

function groupByLanguage (array) {
	let results = {};
  if (array && Array.isArray(array) && array.length) {
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

    return results;
  }
}

module.exports = groupByLanguage;