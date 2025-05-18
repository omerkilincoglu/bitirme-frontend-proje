// services/cartApi.js
import axios from "axios";

const API_URL = "http://10.7.85.158:3000/api";

// ✅ Aldığım Ürünler (Satın alınanlar)
export const getMyPurchases = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/satilan/aldiklarim`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
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
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Sattıklarım verisi çekilemedi", error);
    throw error;
  }
};


// 🟠 Ürün bazlı gelen talepleri getir
export const getProductRequests = async (urunId, token) => {
  try {
    const response = await axios.get(`${API_URL}/talep/${urunId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Talepler alınamadı", error);
    throw error;
  }
};
