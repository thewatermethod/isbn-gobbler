import testISBN from '../common/testISBN';
import BookData from '../common/BookData';
import './style.css'

const data: Array<BookData> = [];
let sortKey = 'date-added';

const bookTemplate =    `
  <div class="book">
    <h2 class="book-title"></h2>
    <p class="book-author"></p>
    <pre class="book-dewey"></pre>
  </div>`;

const removeButtonTemplate = (title: string) => `
  <button class="book-remove button-inline">
    <span class="sr-only">Remove ${title} from list</span>
    [ X ]
  </button>
`;

const form = document.querySelector('#form') as HTMLFormElement;
const bar = document.querySelector('#code') as HTMLInputElement;
const books = document.querySelector('#books') as HTMLDivElement;
const messageContainer = document.querySelector('#message') as HTMLDivElement;
const csvButton = document.querySelector('#export') as HTMLButtonElement;
const sortSelect = document.querySelector('#sort') as HTMLSelectElement;

const sortData = () => {
  switch(sortKey) {
    case 'title':
      data.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case 'author':
      data.sort((a, b) => a.author.localeCompare(b.author));
      break;
    case 'ddc':
      debugger;
      data.sort((a, b) => a.dewey.localeCompare(b.dewey));
      break;
    case 'date-added':
      data.sort((a, b) => a.date.localeCompare(b.date));
      break;
  }
}

const fetchBookData = async (isbn: string) : Promise<BookData> => {
  const response = await fetch(`/gobble?isbn=${isbn.trim()}`);
  const data = await response.json();
  return data;
}

const renderMessage = (message: string) => {
  messageContainer.innerHTML = message;
}

const renderCSV = () => {
  if(!data.length) {
    renderMessage('No books to export! Add some books to your list first.');
    return;
  }

  const csv = data.map((book) => {
    return `"${book.title}","${book.author}","${book.dewey}","${book.isbn}"`;
  });

  const csvString = csv.join('\n');
  
  window.open(  
    encodeURI(`data:text/csv;charset=utf-8,title,author,dewey,isbn\n${csvString}`)
  );
};

csvButton.addEventListener('click', renderCSV);

const addEventListeners = (listItem: HTMLElement) => {
  // add event listeners to remove books
  const removeButton = listItem.querySelector('.book-remove') as HTMLButtonElement;
  if(removeButton) {
    removeButton.addEventListener('click', () => {
      const isbn = listItem.dataset.isbn;
      if(isbn) {
        data.splice(data.findIndex((book) => book.isbn === isbn), 1);
        renderBookData();
      }
    });
  }
};

const renderBookData = () => {
  books.innerHTML = '';
  messageContainer.innerHTML =''; // clear any messages

  // if there's no data, hide the sort select
  if(!data.length) {
    sortSelect.style.display = 'none';
  } else {
    sortSelect.style.display = 'block';
  }

  data.forEach((book) => {
  // otherwise we can build a quick book template and add it to the list
  const listItem = document.createElement('li');
  listItem.innerHTML = bookTemplate;

  listItem.setAttribute('role', 'listitem');

  const title = listItem.querySelector('.book-title') as HTMLHeadingElement;
  if(title){
    title.innerHTML = `${book.title} ${removeButtonTemplate(book.title)}`;
  }

  const author = listItem.querySelector('.book-author') as HTMLParagraphElement;
  if(author){
    author.innerText = book.author;
  }

  const dewey = listItem.querySelector('.book-dewey') as HTMLPreElement;
  if(dewey){
    dewey.innerText = book.dewey;
  }

  listItem.dataset.isbn = book.isbn;

  books.appendChild(listItem);
  addEventListeners(listItem);
  });
}

form.addEventListener('submit', async (e: Event) => {
  e.preventDefault();

  const isbn = bar.value;

  if(!testISBN(isbn)) {
    renderMessage('Please enter a valid ISBN');
    return;
  }

  const bookData = await fetchBookData(isbn);

  const exists = data.find((book) => book.isbn === isbn);

  if(!exists) {
    data.push(bookData);
    localStorage.setItem('data', JSON.stringify(data));
    renderBookData();
  } else {
    renderMessage('This book is already in your list!');
    return;
  }

  // clear our form
  form.reset();
});

bar.addEventListener('keydown', async (e: KeyboardEvent) => {
  if(e.key === 'Enter') {
    form.submit();
  }
});

sortSelect.addEventListener('change', (e: Event) => {
  const target = e.target as HTMLSelectElement;
  const selected = target.value;
  sortKey = selected;
  localStorage.setItem('sort', selected);

  // sort our data
  sortData();

  // re-render our data
  renderBookData();
});

document.addEventListener('DOMContentLoaded', () => {
  // check for existing data
  const existingData = localStorage.getItem('data');
  if(existingData) {
    data.push(...JSON.parse(existingData));
    renderBookData();
  }

  const existingSort = localStorage.getItem('sort');
  if(existingSort) {
    sortSelect.value = existingSort;
    sortKey = existingSort;
  }

  sortSelect.querySelector(`option[value="${sortKey}"]`)?.setAttribute('selected', 'selected');
});