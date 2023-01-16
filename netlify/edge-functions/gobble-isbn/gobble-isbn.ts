import testISBN from "../../../common/testISBN.ts";

const url = (isbn: string) => `https://openlibrary.org/isbn/${isbn}.json`;

export default async (request: Request) => {
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

  const parsed = await response.json();

  const { full_title, title, by_statement, dewey_decimal_class, ...raw } = parsed;

  const bookData = {
    title:  full_title || title,
    author: by_statement || '',
    image: "",
    dewey: dewey_decimal_class || "",
    isbn: isbn,
    raw,
  };

  return new Response(
    JSON.stringify(bookData),  
    { status: 200 }
  );
};