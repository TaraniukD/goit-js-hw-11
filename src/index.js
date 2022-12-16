import SimpleLightbox from "simplelightbox";
// Додатковий імпорт стилів
import Notiflix from 'notiflix';
import "simplelightbox/dist/simple-lightbox.min.css";
import SimpleLightbox from "simplelightbox";

const BASE_URL = 'https://pixabay.com/api';
const API_KEY = '32102465-275d51e71b27b4572d9937886';

const refs = {
    formEl: document.getElementById('search-form'),
    inputEl: document.querySelector('#search-form input'),
    hitsContainer: document.querySelector('.gallery')
};

console.log(refs.formEl);
console.log(refs.inputEl);

refs.formEl.addEventListener('submit', onFormSubmit);

function onFormSubmit(e) {
    e.preventDefault();

    fetchImg({
        query: refs.inputEl.value
    })
}

function fetchImg({query}) {
    const urlAPI = `${BASE_URL}/?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true`;

    try {
        fetch(urlAPI).then(res => {
            if (!res.ok) {
                Notiflix.Notify.warning('Pixabay error'); 
            }
             return res.json()
        })
        .then(({hits}) => {
            if (hits.length === 0) {
                Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.'); 
            }
            renderHTML(hits)
        })
    } catch {

    }
}

function renderHTML(hits) {
refs.hitsContainer.innerHTML = '';
const hitsEl = hits.map(({webformatURL, tags, likes, views, comments, downloads }) => {
    return `
    <div class="photo-card">
      <img src="${webformatURL}" alt="${tags}" loading="lazy" />
      <div class="info">
        <p class="info-item">
          <b>Likes: ${likes}</b>
        </p>
        <p class="info-item">
          <b>Views: ${views}</b>
        </p>
        <p class="info-item">
          <b>Comments: ${comments}</b>
        </p>
        <p class="info-item">
          <b>Downloads: ${downloads}</b>
        </p>
      </div>
    </div>`
});

refs.hitsContainer.insertAdjacentHTML('beforeend', hitsEl.join(''))
}

