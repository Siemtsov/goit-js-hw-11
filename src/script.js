import { searchService } from './js/api-key';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const elem = {
  form: document.querySelector('.search-form'),
  loadMore: document.querySelector('.load-more'),
  cardList: document.querySelector('.gallery'),
};

const gallery = new SimpleLightbox('.gallery a');
let quantityImage = 0;
let page = 1;

elem.form.addEventListener('submit', handlerSubmit);
elem.cardList.addEventListener('click', cardWorkout);
elem.loadMore.addEventListener('click', handlerLoad);

elem.loadMore.style.display = 'none';
async function handlerSubmit(evt) {
  evt.preventDefault();
  const searchQuery = evt.target.elements.searchQuery.value;
  localStorage.setItem('search-query', JSON.stringify(searchQuery));
  page = 1;
  if (!searchQuery) {
    Notify.failure('Please, enter search details!');
  } else {
    try {
      const data = await searchService(page, searchQuery);
      elem.cardList.insertAdjacentHTML('afterbegin', createCard(data.hits));
      if (data.totalHits !== 0) {
        Notify.success(`We found ${data.totalHits} images.`);
      }
      if (data.totalHits < 40) {
        elem.loadMore.style.display = 'none';
      }
    } catch (error) {
      Notify.failure(error.message);
    } finally {
      gallery.refresh();
    }
  }
}

async function handlerLoad() {
  try {
    const inputValue = JSON.parse(localStorage.getItem('search-query'));
    page += 1;

    const data = await searchService(page, inputValue);

    quantityImage += data.hits.length;

    const newCards = createCard(data.hits);

    elem.cardList.insertAdjacentHTML('beforeend', newCards);
    if (data.hits.length < 40) {
      elem.loadMore.style.display = 'none';
      Notify.info('Sorry, you have reached the end of the page!');
    }
  } catch (err) {
    Notify.failure(`${err.message}`);
  } finally {
    gallery.refresh();
  }
}

async function cardWorkout(evt) {
  evt.preventDefault();
  // gallery.next();
}

function createCard(arr) {
  return arr
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `
    <div class="photo-card">
      <a class="gallery-link" href="${largeImageURL}">
            <div class="fit-image">
              <img src="${webformatURL}" alt="${tags}" loading="lazy"  width="265"/>
            </div>
            <div class="info">
                <p class="info-item">
                    <b>Likes:</b> ${likes}
                </p>
                <p class="info-item">
                    <b>Views:</b> ${views}
                </p>
                <p class="info-item">
                   <b>Comments:</b> ${comments}
                </p>
                <p class="info-item">
                    <b>Downloads:</b> ${downloads}
                </p>
            </div>
        </a>
    </div>
    `;
      }
    )
    .join('');
}
