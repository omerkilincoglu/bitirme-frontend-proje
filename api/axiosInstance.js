import axios from "axios";
import { api_url } from "../constants/api_url"; // ✅ env yerine sabit

const axiosInstance = axios.create({
  baseURL: `${api_url}/api`, // ✅ önemli kısım burası
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 5000,
});

export default axiosInstance;
