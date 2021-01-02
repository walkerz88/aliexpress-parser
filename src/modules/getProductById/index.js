const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const Variants = require('./src/variants');
const Feedback = require('./src/feedback');
const languages = require('../../dictionaries/languages.js');
let config = require('../../../config');

config.sortLanguage = config.sortLanguage || 'RU';

async function getProductById(productId) {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    /** Scrape the aliexpress product page for details */

    await page.goto(`https://www.aliexpress.com/item/${productId}.html`);

    const aliExpressData = await page.evaluate(() => runParams);

    const data = aliExpressData.data;

    /** Scrape the description page for the product using the description url */
    if (data && data.descriptionModule && data.descriptionModule.descriptionUrl) {
      const descriptionUrl = data.descriptionModule.descriptionUrl;
      await page.goto(descriptionUrl);
      const descriptionPageHtml = await page.content();

      /** Build the AST for the description page html content using cheerio */
      const $ = cheerio.load(descriptionPageHtml);
      const descriptionData = $('body').html();

      /** Fetch the adminAccountId required to fetch the feedbacks */
      const adminAccountId = await page.evaluate(() => adminAccountId);
      await browser.close();

      /** Build the JSON response with aliexpress product details */
      let json = {
        description: descriptionData,
        images: data.imageModule && data.imageModule.imagePathList || [],
        variants: data.skuModule ? Variants.get(data.skuModule) : null,
        specs: data.specsModule ? data.specsModule.props : null,
        currency: data.webEnv ? data.webEnv.currency : null
      };

      if (data.titleModule) {
        json.title = data.titleModule.subject;
        json.orders = data.titleModule.tradeCount;

        if (data.titleModule.feedbackRating) {
          json.ratings = {
            averageStar: data.titleModule.feedbackRating.averageStar,
            totalStartCount: data.titleModule.feedbackRating.totalValidNum,
            fiveStarCount: data.titleModule.feedbackRating.fiveStarNum,
            fourStarCount: data.titleModule.feedbackRating.fourStarNum,
            threeStarCount: data.titleModule.feedbackRating.threeStarNum,
            twoStarCount: data.titleModule.feedbackRating.twoStarNum,
            oneStarCount: data.titleModule.feedbackRating.oneStarNum
          }

          /** Fetching reviews */
          if (data.titleModule.feedbackRating.totalValidNum > 0) {
            const feedbackData = await Feedback.get(
              data.actionModule.productId,
              adminAccountId,
              data.titleModule.feedbackRating.totalValidNum
            );
            json.feedbacks = feedbackData;
          }
        }
      }

      if (data.actionModule) {
        json.categoryId = data.actionModule.categoryId;
        json.productId = data.actionModule.productId;
      }

      if (data.quantityModule) {
        json.totalAvailableQuantity = data.quantityModule.totalAvailQuantity;
      }

      if (data.storeModule) {
        json.storeInfo = {
          name: data.storeModule.storeName,
          companyId: data.storeModule.companyId,
          storeNumber: data.storeModule.storeNum,
          followers: data.storeModule.followingNumber,
          ratingCount: data.storeModule.positiveNum,
          rating: data.storeModule.positiveRate
        }
      }

      if (data.priceModule) {
        if (data.priceModule.minActivityAmount && data.priceModule.maxActivityAmount) {
          json.salePrice = {
            min: data.priceModule.minActivityAmount.value,
            max: data.priceModule.maxActivityAmount.value
          }
        }

        if (data.priceModule.minAmount && data.priceModule.maxAmount) {
          json.originalPrice = {
            min: data.priceModule.minAmount.value,
            max: data.priceModule.maxAmount.value
          }
        }

      }

      return json;
    } else {
      throw new Error(languages[config.language].NO_DATA_FOUND_ERROR);
    }
  } catch (e) {
    throw new Error(e);
  }
}

module.exports = getProductById;
