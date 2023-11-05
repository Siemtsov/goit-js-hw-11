import { Notify } from 'notiflix/build/notiflix-notify-aio';
import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '40485321-9784daa101826a12726fe4187';

async function searchService(page, searchValue) {
  const params = new URLSearchParams({
    key: API_KEY,
    image_type: 'photo',
    q: searchValue,
    safeserch: true,
    per_page: '40',
    page,
  });
  try {
    const resp = await axios.get(`${BASE_URL}?${params}`);
    if (resp.status !== 200) {
      throw new Error(`HTTP Error! Status:${resp.status}`);
    }
    return resp.data;
  } catch (error) {
    Notify.failure(
      'Unfortunately, there are no images matching your request. Please try again.'
    );
    throw error;
  }
}
module.exports = { searchService };
