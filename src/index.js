import axios from 'axios';
import Notiflix from 'notiflix';

import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const BASE_URL = 'https://pixabay.com/api';
const API_KEY = '32102465-275d51e71b27b4572d9937886';
const pageSize = 40;
let currentPage = 1;

const refs = {
    formEl: document.getElementById('search-form'),
    inputEl: document.querySelector('#search-form input'),
    hitsContainer: document.querySelector('.gallery'),
    loadMoreBtn: document.querySelector('.load-more')
};

console.log(refs.loadMoreBtn)
const API = axios.create({
    baseURL: BASE_URL,
});

refs.formEl.addEventListener('submit', onFormSubmit);


function onFormSubmit(e) {
    e.preventDefault();

    fetchImg(refs.inputEl.value).then(({hits}) => {
        const hitsMoreEl = createMoreHitsEl(hits);
        refs.hitsContainer.insertAdjacentHTML('beforeend', hitsMoreEl)
            });
}

refs.loadMoreBtn.addEventListener('click', e => {
    if (currentPage > totalPages) return
    currentPage = Number(currentPage) + 1;

    fetchImg(refs.inputEl.value).then(({hits}) => {
const hitsMoreEl = createMoreHitsEl(hits);
refs.hitsContainer.insertAdjacentHTML('beforeend', hitsMoreEl)
    });
})


function calculatePagination(totalHits) {
    totalPages = Math.floor(totalHits / pageSize)
    // createPagesElements ()
  }

// function createPagesElements () {
//     let pagesElements = '';
    
//     for (let i = 1; i <= totalPages; i += 1 ) {
//       pagesElements += `<li class="page-item"><a class="page-link" href="#" data-page=${i}>${i}</a></li>`
//     }
  
//     return pagesElements
//   }

function fetchImg(query) {
    const urlAPI = `${BASE_URL}/?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${pageSize}&page=${currentPage}`;
   return axios.get(urlAPI)

  .then(res => res.data)
  .then(({hits, totalHits}) => {
        if (hits.length === 0) {
            Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.'); 
        }
    //  renderHTML(hits)
    calculatePagination(totalHits)
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

// function renderHTML() {
// refs.hitsContainer.innerHTML = '';
// const hitsEl = hits.map(({webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
//     return `
//     <div class="photo-card">
//     <a class="gallery__item" href="${largeImageURL}">
//       <img src="${webformatURL}" alt="${tags}" loading="lazy" />
//       </a>
//       <div class="info">
//         <p class="info-item">
//           <b>Likes: <br/><span class="info-span">${likes}</span></b>
//         </p>
//         <p class="info-item">
//           <b>Views: <br/><span class="info-span">${views}</span></b>
//         </p>
//         <p class="info-item">
//           <b>Comments: <br/><span class="info-span">${comments}</span></b>
//         </p>
//         <p class="info-item">
//           <b>Downloads: <br/><span class="info-span">${downloads}</span></b>
//         </p>
//       </div>
//     </div>`
// }).join('');

// refs.hitsContainer.insertAdjacentHTML('beforeend', hitsEl)

// let gallery = new SimpleLightbox('.gallery a', { 
//     captions: true,
//     captionType:'attr',
//     captionsData: "alt",
//     captionPosition:'bottom',
//     captionDelay: 250,
    
//  });

// gallery.refresh()

// gallery.on('show.simplelightbox', function () {
// 	// do something…
// });

// gallery.on('error.simplelightbox', function (e) {
// 	console.log(e); // some usefull information
// });

// }






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