import api from './api';

const movieService = {
  getPopular(page=1){
     return api.get("/movie/popular", { params: { page } });
  },
  getTrending(page=1){
    return api.get("/movie/trending/week",{params:{page}})
  },
  getSearch(query,page=1){
     return api.get("/search/movie", { params: { query, page } });
  },
  getById(movieId){
    return api.get(`/movie/${movieId}`);
  }
}

export default movieService;