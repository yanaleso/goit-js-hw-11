import axios from 'axios';

export default class ImagesApiService {
  constructor() {
    this.options = {
      params: {
        key: '27490013-9148c53e2810ac9eb458ae5f0',
        q: '',
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: 1,
        per_page: 40,
      },
    };
  }
  
  async fetchImages() {
    const url = `https://pixabay.com/api/`;
    try {
      const {data} = await axios.get(url, this.options);
      this.incrementPage();
      return data;
    } catch (error) {
      console.error(error);
    }
  }
  
  incrementPage() {
    this.options.params.page += 1;
  }

  resetPage() {
    this.options.params.page = 1;
  }

  get query() {
    return this.options.params.q;
  }

  set query(newQuery) {
    this.options.params.q = newQuery;
  }
}

