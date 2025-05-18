// api/axiosInstance.js
import axios from 'axios';
import { API_URL } from '@env';

const axiosInstance = axios.create({
  baseURL: API_URL, // .env'den alıyoruz artık
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});

export default axiosInstance;
