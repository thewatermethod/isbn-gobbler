import testISBN from '../common/testISBN';
import './style.css'

// todo: move to common for sharing between client and server
interface BookData {
  title: string,
  image: string,
  author: string,
  dewey: string,
}

const bar = document.querySelector('#code') as HTMLInputElement;
const title = document.querySelector('#book-title') as HTMLDivElement;
const image = document.querySelector('#book-image') as HTMLImageElement;
const author = document.querySelector('#book-author') as HTMLDivElement;
const dewey = document.querySelector('#book-dewey') as HTMLDivElement;

const fetchBookData = async (isbn: string) : Promise<BookData> => {

  const response = await fetch(`/gobble?isbn=${isbn.trim()}`);

  const parsed = await response.json();
  console.log(parsed);

  return parsed;
}

const renderBookData = (data: BookData) => {
  title.innerText = data.title;
  image.src = data.image;
  author.innerText = data.author;
  dewey.innerText = data.dewey;
  bar.value = '';
}

bar.addEventListener('keydown', async (e: KeyboardEvent) => {
  if(e.key === 'Enter') {
    console.log('Enter was pressed');
    const target = e.target as HTMLInputElement;
    const isbn = target.value;
  
    if(!testISBN(isbn)) {
      // todo: show error in UI
      return;
    }

    const bookData = await fetchBookData(isbn);
    renderBookData(bookData);
    bar.value = '';
  }
});