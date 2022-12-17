import axios from 'axios';
import Notiflix from 'notiflix';

import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const BASE_URL = 'https://pixabay.com/api';
const API_KEY = '32102465-275d51e71b27b4572d9937886';
let pageSize = 40;
let currentPage = 1;
let totalPages = undefined;

// console.log(totalPages)

const refs = {
    formEl: document.getElementById('search-form'),
    inputEl: document.querySelector('#search-form input'),
    hitsContainer: document.querySelector('.gallery'),
    loadMoreBtn: document.querySelector('.load-more')
};

const API = axios.create({
    baseURL: BASE_URL,
});

refs.loadMoreBtn.classList.add('hiden')
refs.formEl.addEventListener('submit', onFormImgSubmit);
refs.loadMoreBtn.addEventListener('click', loadMoreImg );



function onFormImgSubmit(e) {
    e.preventDefault();
    refs.loadMoreBtn.classList.remove('hiden')
    
    getImgbyAxios(refs.inputEl.value.trim()).then(({hits, totalHits}) => {
        const hitsMoreEl = createMoreHitsEl(hits);
        refs.hitsContainer.insertAdjacentHTML('beforeend', hitsMoreEl)

        Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
        simplelightboxGallery();
            });
}

function loadMoreImg() {
  
  refs.loadMoreBtn.classList.remove('hiden')

 console.log(totalPages)

  if (currentPage === totalPages) {
    refs.loadMoreBtn.classList.add('hiden');
    Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
  return;
  }
    currentPage = Number(currentPage) + 1;

    getImgbyAxios(refs.inputEl.value).then(({hits, totalHits}) => {
  const hitsMoreEl = createMoreHitsEl(hits);
  refs.hitsContainer.insertAdjacentHTML('beforeend', hitsMoreEl);
  calculatePagination(totalHits);
  console.log(totalPages)
  
  simplelightboxGallery();
    });
}

function getImgbyAxios(query) {
  const urlAPI = `${BASE_URL}/?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${pageSize}&page=${currentPage}`;
  
  return axios.get(urlAPI)

.then(res => res.data)
.then(({hits, totalHits}) => {
      if (hits.length === 0) {
          Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.'); 
      } else {
        // Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
        return {hits, totalHits}
      }
      })

.catch(error => console.log(error))
}

function createMoreHitsEl (hits) {
  clearGelleryContainer()

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

function clearGelleryContainer() {
  refs.hitsContainer.innerHTML = '';
}

function calculatePagination(totalHits) {
   return totalPages = Math.floor(totalHits / pageSize)
}

function simplelightboxGallery() {
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























// function createPagesElements () {
//     let pagesElements = '';
    
//     for (let i = 1; i <= totalPages; i += 1 ) {
//       pagesElements += `<li class="page-item"><a class="page-link" href="#" data-page=${i}>${i}</a></li>`
//     }
  
//     return pagesElements
//   }



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