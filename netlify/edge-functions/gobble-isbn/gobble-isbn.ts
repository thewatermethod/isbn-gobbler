import testISBN from "../../../common/testISBN.ts";

interface OpenLibraryResponse {
  full_title: string,
  title: string,
  by_statement: string,
  dewey_decimal_class: string[],
  lc_classifications: string[],
}

/**
 * 
 * @param isbn {string}
 * @returns {string} url string for openlibrary.org api endpoint
 */
const url = (isbn: string): string => `https://openlibrary.org/isbn/${isbn}.json`;

/**
 * 
 * @param response {OpenLibraryResponse} response from openlibrary.org
 * @returns {string} dewey decimal classification
 */
const extractDewey = (response: OpenLibraryResponse): string => {
  const { dewey_decimal_class, lc_classifications } = response;
  if(dewey_decimal_class) {
    return dewey_decimal_class.join(', ');
  }
  if(lc_classifications) {
    return lc_classifications.join(', ');
  }
  return '';
};  

/**
 * 
 * @param request {Request} request from netlify edge function
 * @returns {Promise<Response>} response to netlify edge function
 */
export default async (request: Request): Promise<Response> => {
  const reqUrl = new URL(request.url);
  const isbn = reqUrl.searchParams.get("isbn");

  if(!isbn || !testISBN(isbn)) {
    return new Response(JSON.stringify({
      error: "No ISBN or invalid ISBN provided"
    }), { status: 400 });
  }

  const response = await fetch(
    url(isbn)
  );

  const parsed: OpenLibraryResponse = await response.json();

  const { full_title, title, by_statement } = parsed;

  const bookData = {
    title:  full_title || title,
    author: by_statement || '',
    image: "",
    dewey: extractDewey(parsed),
    isbn: isbn,
    date: new Date().toISOString(),
  };

  return new Response(
    JSON.stringify(bookData),  
    { status: 200 }
  );
};