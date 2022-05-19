import './css/style.css';
import ImagesApiService from "./js/image-service";

import { Notify } from 'notiflix/build/notiflix-notify-aio';

import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";


const refs = {
    form: document.querySelector('.search-form'),
    galerry: document.querySelector('.gallery'),
    loadMorebtn: document.querySelector('.load-more')
}
const options = {
    simpleLightbox: {
        captions: true,
        captionDelay: 250,
        captionsData: 'alt',
    },
    intersectionObserver: {
        rootMargin: "100px",
    },
}

const imagesApiService = new ImagesApiService();
let gallery = new SimpleLightbox('.gallery a', options.simpleLightbox);

refs.form.addEventListener('submit', onSearch);

function onSearch(e) {
    e.preventDefault();
    
    imagesApiService.query = e.currentTarget.elements.searchQuery.value;
    imagesApiService.resetPage();

    if (imagesApiService.query) {
        imagesApiService.fetchImages().then(({ totalHits, hits }) => {
            clearGallery();
            window.scrollTo(0, 0);

            if (hits.length === 0) {
                return Notify.failure('Sorry, there are no images matching your search query. Please try again.');
            }

            Notify.success(`Hooray! We found ${totalHits} images.`);
            renderImages(hits);
            gallery.refresh();
        });
    }
}

function renderImages(images) {
  const imagesArr = images;

  const markup = imagesArr
    .map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
        return `
      <div class="photo-card">
        <a href="${largeImageURL}">
          <img src="${webformatURL}" alt="${tags}" loading="lazy" />
          <div class="info">
            <p class="info-item">
              <b>Likes</b> ${likes}
            </p>
            <p class="info-item">
              <b>Views</b> ${views}
            </p>
            <p class="info-item">
              <b>Comments</b> ${comments}
            </p>
            <p class="info-item">
              <b>Downloads</b> ${downloads}
            </p>
          </div>
        </a>
      </div>`;
    })
      .join("");
    
  refs.galerry.insertAdjacentHTML('beforeend', markup);
}

function clearGallery() {
    refs.galerry.innerHTML = '';
}

function smoothScroll() {
    const { height: cardHeight } = document.querySelector(".gallery").firstElementChild.getBoundingClientRect();
    window.scrollBy({
        top: cardHeight * 2,
        behavior: "smooth",
    });
}


const callback = entries => {
    entries.forEach(entry => {  
        if (entry.isIntersecting && imagesApiService.query !== '') {
            imagesApiService.fetchImages().then(({ hits }) => {
                if (hits.length !== 0) {
                    renderImages(hits);
                    gallery.refresh();
                    smoothScroll();
                }
            }).catch((error) => {
            Notify.warning("We're sorry, but you've reached the end of search results.");
            console.log(error);
            });
        }
    });
}

const observer = new IntersectionObserver(callback, options.intersectionObserver);

const target = document.querySelector('.target');
observer.observe(target);