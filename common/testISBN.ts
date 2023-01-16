/**
 * 
 * @param {string} isbn 
 * @returns {boolean} whether the isbn contains only digits
 */
const testISBN = (isbn: string): boolean =>  {
    return /^\d+$/.test(isbn);
};

export default testISBN;