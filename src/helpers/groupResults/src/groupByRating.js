const config = require('../../../../config');
const languages = require('../../../dictionaries/languages');

function groupByRating (array) {
  let results = {};
  if (array && Array.isArray(array) && array.length) {
    for (let i = 1; i <= 5; i++) {
      const starsArray = array.filter(item => item.rating === i);
      results[`${languages[config.language].GROUP_BY_RATING} ${i}`] = starsArray;
    }
  }
  return results;
}

module.exports = groupByRating;