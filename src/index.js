import axios from 'axios';
import Notiflix from 'notiflix';

import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const BASE_URL = 'https://pixabay.com/api';
const API_KEY = '32102465-275d51e71b27b4572d9937886';

const refs = {
    formEl: document.getElementById('search-form'),
    inputEl: document.querySelector('#search-form input'),
    hitsContainer: document.querySelector('.gallery')
};

const API = axios.create({
    baseURL: BASE_URL,
});

refs.formEl.addEventListener('submit', onFormSubmit);

function onFormSubmit(e) {
    e.preventDefault();

    fetchImg({
        query: refs.inputEl.value
    })
}

function fetchImg({query}) {
    const urlAPI = `${BASE_URL}/?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true`;
    axios.get (urlAPI)

  .then(res => res.data)
  .then(({hits}) => {
        if (hits.length === 0) {
            Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.'); 
        }
     renderHTML(hits)
        })
     .catch(function (error) {

        })
   }

function renderHTML(hits) {
refs.hitsContainer.innerHTML = '';
const hitsEl = hits.map(({webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
    return `
    <div class="photo-card">
    <a class="gallery__item" href="${largeImageURL}">
      <img src="${webformatURL}" alt="${tags}" loading="lazy" />
      </a>
      <div class="info">
        <p class="info-item">
          <b>Likes: <br/><span class="info-span">${likes}</span></b>
        </p>
        <p class="info-item">
          <b>Views: <br/><span class="info-span">${views}</span></b>
        </p>
        <p class="info-item">
          <b>Comments: <br/><span class="info-span">${comments}</span></b>
        </p>
        <p class="info-item">
          <b>Downloads: <br/><span class="info-span">${downloads}</span></b>
        </p>
      </div>
    </div>`
}).join('');

refs.hitsContainer.insertAdjacentHTML('beforeend', hitsEl)

let gallery = new SimpleLightbox('.gallery a', { 
    captions: true,
    captionType:'attr',
    captionsData: "alt",
    captionPosition:'bottom',
    captionDelay: 250,
    
 });

gallery.refresh()

gallery.on('show.simplelightbox', function () {
	// do something…
});

gallery.on('error.simplelightbox', function (e) {
	console.log(e); // some usefull information
});

}






// ----------- приклад без axios-----------------------------------
// function fetchImg({query}) {
//     const urlAPI = `${BASE_URL}/?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true`;

//     try {
//         fetch(urlAPI).then(res => {
//             if (!res.ok) {
//                 Notiflix.Notify.warning('Pixabay error'); 
//             }
//              return res.json()
//         })
//         .then(({hits}) => {
//             if (hits.length === 0) {
//                 Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.'); 
//             }
//             renderHTML(hits)
//         })
//     } catch {

//     }
// }