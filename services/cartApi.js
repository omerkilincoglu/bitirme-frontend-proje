// services/cartApi.js
import axios from "axios";
<<<<<<< HEAD
import { api_url } from "../constants/api_url";

const API_URL = `${api_url}/api`;
=======

const API_URL = "http://10.7.85.158:3000/api";
>>>>>>> f4c47392e4a2687f55dcc9ef902610ef1a3bdc01

// ✅ Aldığım Ürünler
export const getMyPurchases = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/satilan/aldiklarim`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  } catch (error) {
    console.error("Aldıklarım verisi çekilemedi", error);
    throw error;
  }
};

// ✅ Sattığım Ürünler
export const getMySales = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/satilan/sattiklarim`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  } catch (error) {
    console.error("Sattıklarım verisi çekilemedi", error);
    throw error;
  }
};

// ✅ Ürün bazlı talepleri getir (sadece satıcı görebilir)
export const getProductRequests = async (urunId, token) => {
  try {
    const response = await axios.get(`${API_URL}/talep/${urunId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  } catch (error) {
    console.error("Talepler alınamadı", error?.response?.data?.mesaj || error);
    throw error;
  }
};
