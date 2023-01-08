/**
 * 
 * @param {string} isbn 
 * @returns {boolean} whether the isbn contains only digits
 */
const testISBN = async (isbn: string) =>  {
    return /^\d+$/.test(isbn);
};

export default testISBN;