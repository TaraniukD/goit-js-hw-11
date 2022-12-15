import SimpleLightbox from "simplelightbox";
// Додатковий імпорт стилів
import "simplelightbox/dist/simple-lightbox.min.css";
import SimpleLightbox from "simplelightbox";

const BASE_URL = 'https://pixabay.com/api';
const myKey = '32102465-275d51e71b27b4572d9937886';

function fetchImg() {
    return fetch(`${BASE_URL}/?key=${myKey}&q=yellow+flowers&image_type=photo&orientation=horizontal&safesearch=true`).then(res => res.json());
}

fetchImg(cat).then(res => res.json(
    console.log(res);
));

console.log(21)