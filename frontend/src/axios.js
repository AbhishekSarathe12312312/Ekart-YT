import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://ekart-yt.onrender.com",
});

export default API;
