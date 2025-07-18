<<<<<<< HEAD
import axios from "axios";
import { api_url } from "../constants/api_url"; // ✅ env yerine sabit

const axiosInstance = axios.create({
  baseURL: `${api_url}/api`, // ✅ önemli kısım burası
  headers: {
    "Content-Type": "application/json",
=======
// api/axiosInstance.js
import axios from 'axios';
import { API_URL } from '@env';

const axiosInstance = axios.create({
  baseURL: API_URL, // .env'den alıyoruz artık
  headers: {
    'Content-Type': 'application/json',
>>>>>>> f4c47392e4a2687f55dcc9ef902610ef1a3bdc01
  },
  timeout: 5000,
});

export default axiosInstance;
