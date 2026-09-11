import axios from "axios";

const api = axios.create({
  baseURL:import.meta.env.VITE_TMDB_BASE_URL,
  params:{
    api_key:import.meta.env.VITE_TMDB_API_KEY
  }
})

api.interceptors.response.use(
  (response)=> response.data,
  (error)=>{
    const message = error.response?.data?.status_message || "Something went wrong"
    console.log("API Error : ", message);
    return Promise.reject(new Error(message));
  }
)

export default api;