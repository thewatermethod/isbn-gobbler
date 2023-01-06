import './style.css'

const bar = document.querySelector('#code') as HTMLInputElement;
const title = document.querySelector('#book-title') as HTMLDivElement;
const image = document.querySelector('#book0image') as HTMLImageElement;

const url = (isbn: string) => `https://openlibrary.org/isbn/${isbn}`;

interface BookData {
  title: string,
  image: string
}

const fetchBookData = async (isbn: string) => {

  const response = await fetch(
    url(isbn)
  );

  const parsed = await response.json();
  console.log(parsed);

}

const renderBookData = (data: BookData) => {
  title.innerText = data.title;
  image.src = data.image;
}

bar.addEventListener('keydown', async (e: KeyboardEvent) => {
  if(e.key === 'Enter') {
    console.log('Enter was pressed');
  }

  const target = e.target as HTMLInputElement;
  const isbn = target.value;

  await fetchBookData(isbn);

});