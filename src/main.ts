import testISBN from '../common/testISBN';
import './style.css'

// todo: move to common for sharing between client and server
interface BookData {
  title: string,
  image: string,
  author: string,
  dewey: string,
}

const bookTemplate =    `
  <div class="book">
    <img class="book-image" />
    <h2 class="book-title"></h2>
    <p class="book-author"></p>
    <pre class="book-dewey"></pre>
  </div>`;

const form = document.querySelector('#form') as HTMLFormElement;
const bar = document.querySelector('#code') as HTMLInputElement;
const books = document.querySelector('#books') as HTMLDivElement;


const fetchBookData = async (isbn: string) : Promise<BookData> => {
  const response = await fetch(`/gobble?isbn=${isbn.trim()}`);
  const data = await response.json();
  return data;
}

const addEventListeners = () => {
  //todo: add event listeners to remove books
};

const renderBookData = (data: BookData,  isbn: string) => {

  //first we can check to see if the book is already in the list
  const existingBook = books.querySelector(`[data-isbn="${isbn}"]`);
  if(existingBook) {
    return;
  }

  // otherwise we can build a quick book template and add it to the list
  const book = document.createElement('li');
  book.innerHTML = bookTemplate;

  const title = book.querySelector('.book-title') as HTMLHeadingElement;
  if(title){
    title.innerText = data.title;
  }

  const image = book.querySelector('.book-image') as HTMLImageElement;
  if(image){
    image.src = data.image;
  }

  const author = book.querySelector('.book-author') as HTMLParagraphElement;
  if(author){
    author.innerText = data.author;
  }

  const dewey = book.querySelector('.book-dewey') as HTMLPreElement;
  if(dewey){
    dewey.innerText = data.dewey;
  }

  book.dataset.isbn = isbn;

  books.appendChild(book);

  form.clear();

  addEventListeners();
}

form.addEventListener('submit', async (e: Event) => {
  e.preventDefault();

  const isbn = bar.value;

  if(!testISBN(isbn)) {
    // todo: show error in UI
    return;
  }

  const bookData = await fetchBookData(isbn);
  renderBookData(bookData, isbn);
  bar.value = '';
});

bar.addEventListener('keydown', async (e: KeyboardEvent) => {
  if(e.key === 'Enter') {
    form.submit();
  }
});