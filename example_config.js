module.exports = {
    language: 'EN',                // tool language, RU, EN
    searchByNameMaxResults: 5,     // max results to show in search select results
    searchByNameResultsLength: 64, // if you search product by name, max title length to show in select
    feedbackMinLength: 25,         // min length of feedback text to be in results
    groupBy: 'language',           // language, rating, null
    sortLanguage: 'EN',            // language priority in sort RU, EN, FR, etc
    feedbackPages: 10,             // number of feedback pages to fetch, do not use large number or you can be banned
    feedbacksLimit: 10,            // limit per page (total limit = feedbacksLimit * feedbackPages)
    translate: false,              // translate feedbacks (only english language works for now)
    infoToShow: [                 
        'feedbacks',
        'productId',
        'title',
        /*'description',
        'images',
        'variants',
        'specs',
        'currency',
        'orders',
        'ratings',
        'categoryId',
        'productId',
        'totalAvailableQuantity',
        'storeInfo',
        'salePrice',
        'originalPrice'*/
    ],
    stripHtmlFromDescription: true,  // remove all html tags from product description
    showInFeedbacks: [
        'displayName',
        'country',
        'rating',
        'content',
        /*'info',
        'date',
        'photos',
        'name',*/
    ]
}