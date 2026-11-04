import axios from "axios";

const api = axios.create({
  baseURL:"http://localhost:3000"
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");//asumption here if token is available it will be in localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// api.interceptors.response.use(
//   (response)=> response.data,
//   (error)=>{
//     const message = error.response?.data?.status_message || "Something went wrong"
//     console.log("API Error : ", message);
//     return Promise.reject(new Error(message));
//   }
// )

export default api;