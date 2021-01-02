const config = require('../../config.js');

config.feedbackMinLength = config.feedbackMinLength || 25;

module.exports = {
    'RU': {
        PRODUCT_ID: 'ID товара:',
        PRODUCT_NAME: 'Название товара:',
        NO_ITEMS_FOUND: 'Товаров не найдено.',
        CANT_COMBINE_RESULTS: 'Не могу сгруппировать результаты',
        NO_FEEDBACKS: 'У товара нет отзывов.',
        NO_MATCHING_FEEDBACKS: `У товара нет отзывов, подходящих под критерии: Не пустой, Мин. длинна = ${config.feedbackMinLength}`,
        FETCHING_IN_PROGRESS: 'Получаем данные о товаре, пожалуйста, подождите...',
        SEARCH_BY_NAME_IN_PROGRESS: 'Ищем товары по названию, пожалуйста, подождите...',
        SEARCH_BY: 'Поиск товара по:',
        SEARCH_BY_ID: 'id',
        SEARCH_BY_NAME: 'Названию',
        ENTER_PRODUCT_ID_ERROR: 'Пожалуйста, укажите ID товара.',
        ENTER_PRODUCT_NAME_ERROR: 'Пожалуйста, укажите название товара.',
        FINISH_QUESTION: 'Получить данные по другому товару?',
        FINISH_QUESTION_YES: 'Да',
        FINISH_QUESTION_NO: 'Нет',
        SELECT_PRODUCT: 'Выберите товар:',
        NO_SEARCH_TYPE_ERROR: 'Не передан тип поиска.',
        NO_PRODUCT_ID_ERROR: 'Не передан id товара.',
        NO_PRODUCT_NAME_ERROR: 'Не передано имя товара.',
        PROGRESS_TEXT: 'Загрузка:',
        GROUP_BY_RATING: 'Оценка:',
        GROUP_BY_DEFAULT: 'Отзывы:',
        NO_DATA_FOUND_ERROR: 'Нет данных.'
    },
    'EN': {
        PRODUCT_ID: 'Product id:',
        PRODUCT_NAME: 'Product name:',
        NO_ITEMS_FOUND: 'No items found.',
        CANT_COMBINE_RESULTS: 'Can\'t combine results.',
        NO_FEEDBACKS: 'No feedbacks received for this product.',
        NO_MATCHING_FEEDBACKS: `No feedbacks satisfying the request: Not empty, Min. length = ${config.feedbackMinLength}`,
        FETCHING_IN_PROGRESS: 'Fetching product data, please wait...',
        SEARCH_BY_NAME_IN_PROGRESS: 'Searching products by name, please wait...',
        SEARCH_BY: 'Search product by:',
        SEARCH_BY_ID: 'id',
        SEARCH_BY_NAME: 'name',
        ENTER_PRODUCT_ID_ERROR: 'Please, enter ID of the product.',
        ENTER_PRODUCT_NAME_ERROR: 'Please, enter product name.',
        FINISH_QUESTION: 'Get another product?',
        FINISH_QUESTION_YES: 'yes',
        FINISH_QUESTION_NO: 'no',
        SELECT_PRODUCT: 'Select your product:',
        NO_SEARCH_TYPE_ERROR: 'No search type received.',
        NO_PRODUCT_ID_ERROR: 'No product id received.',
        NO_PRODUCT_NAME_ERROR: 'No product name received.',
        PROGRESS_TEXT: 'Progress:',
        GROUP_BY_RATING: 'Rating:',
        GROUP_BY_DEFAULT: 'Feedbacks:',
        NO_DATA_FOUND_ERROR: 'No data found.'
    }
}