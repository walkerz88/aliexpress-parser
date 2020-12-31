module.exports = {
    language: 'RU',                // tool language, RU, EN
    searchByNameMaxResults: 5,     // max results to show in search select results
    searchByNameResultsLength: 64, // if you search product by name, max title length to show in select
    feedbackMinLength: 25,         // min length of feedback text to be in results
    groupBy: 'language',           // language, rating, null
    sortLanguage: 'RU',            // language priority in sort
    feedbackPages: 10,             // number of feedback pages to fetch, do not use large number or you can be banned
    feedbacksLimit: 10,            // limit per page (total limit = feedbacksLimit * feedbackPages)
    translate: false               // translate feedbacks (only english language works for now)
}