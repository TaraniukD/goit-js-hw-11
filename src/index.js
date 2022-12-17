import axios from 'axios';
import Notiflix from 'notiflix';

import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const BASE_URL = 'https://pixabay.com/api';
const API_KEY = '32102465-275d51e71b27b4572d9937886';
const pageSize = 40;
let currentPage = 1;
let totalPages = undefined;


const lightBox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
}); 

const refs = {
    formEl: document.getElementById('search-form'),
    inputEl: document.querySelector('#search-form input'),
    hitsContainer: document.querySelector('.gallery'),
    loadMoreBtn: document.querySelector('.load-more')
};

refs.loadMoreBtn.classList.add('hiden')
refs.formEl.addEventListener('submit', onFormImgSubmit);
refs.loadMoreBtn.addEventListener('click', loadMoreImg );

async function onFormImgSubmit(e) {
    e.preventDefault();
    
    refs.hitsContainer.innerHTML = '';
    
    await getImgbyAxios(refs.inputEl.value.trim()).then(({hits, totalHits}) => {
      if (hits.length === 0) {
        refs.loadMoreBtn.classList.add('hiden');
        Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.'); 
    } else {
      const hitsMoreEl = createMoreHitsEl(hits);
      refs.hitsContainer.insertAdjacentHTML('beforeend', hitsMoreEl)
      Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
      refs.loadMoreBtn.classList.remove('hiden');
    }    
  });

  lightBox.refresh();
}

async function loadMoreImg() {
  currentPage = Number(currentPage) + 1;

  if (currentPage > totalPages) {
    Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
    refs.loadMoreBtn.classList.add('hiden');
  return;
  } else {
    await  getImgbyAxios(refs.inputEl.value).then(({hits, totalHits}) => {
      const hitsMoreEl = createMoreHitsEl(hits);
      refs.hitsContainer.insertAdjacentHTML('beforeend', hitsMoreEl);
      calculatePagination(totalHits);
    });
  }
  lightBox.refresh();
}

function getImgbyAxios(query) {
  const urlAPI = `${BASE_URL}/?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${pageSize}&page=${currentPage}`;
  
return axios.get(urlAPI)

.then(res => res.data)
.then(({hits, totalHits}) => {
        return {hits, totalHits}  
      })
.catch(error => console.log(error))
}

function createMoreHitsEl (hits) {
  return hits.map(({webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
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
}

function calculatePagination(totalHits) {
   return totalPages = Math.ceil(totalHits / pageSize)
}