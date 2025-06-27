// services/productApi.js
import axios from "axios";
import { api_url } from "../constants/api_url";

const API_URL = `${api_url}/api`;

// 🔍 1. Ürünleri Listele-filtreme (GET /urun)
export async function getProducts(filters = {}) {
  try {
    const params = {};

    if (filters.arama) params.arama = filters.arama;
    if (filters.kategori) params.kategori = filters.kategori;
    if (filters.durum) params.durum = filters.durum;
    if (filters.minFiyat) params.minFiyat = filters.minFiyat;
    if (filters.maxFiyat) params.maxFiyat = filters.maxFiyat;

    const response = await axios.get(`${API_URL}/urun`, { params });
    return response.data;
  } catch (error) {
    return { error: true, message: "Ürünler getirilemedi" };
  }
}

// ➕ 2. Ürün Ekleme (POST /urun/ekle) – multipart/form-data ile
export async function addProduct(formData, token) {
  try {
    const response = await axios.post(`${API_URL}/urun/ekle`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    return {
      error: true,
      message:
        error.response?.data?.mesaj || "Ürün eklenemedi. Lütfen tekrar deneyin",
    };
  }
}

// 🗑️ 3. Ürün Silme (DELETE /urun/:id) – yalnızca ürün sahibi siler
export async function deleteProduct(id, token) {
  try {
    const res = await axios.delete(`${API_URL}/urun/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { error: false, message: res.data.mesaj };
  } catch (error) {
    return {
      error: true,
      message: error.response?.data?.mesaj || "Silme işlemi başarısız",
    };
  }
}

// ✏️ 4. Ürün Güncelleme (PUT /urun/:id) – multipart/form-data ile
export async function updateProduct(id, formData, token) {
  try {
    const response = await axios.put(`${API_URL}/urun/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    return { error: true, message: "Ürün güncellenemedi" };
  }
}

// ✅ Satıştaki Ürünler
export const getActiveListings = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/urun/satistaki`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.urunler;
  } catch (error) {
    throw error;
  }
};

// ✅ Talebi Onayla
export async function approveRequest(productId, token) {
  try {
    const res = await axios.put(
      `${API_URL}/talep/onayla/${productId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return { error: false, message: res.data.message };
  } catch (error) {
    return {
      error: true,
      message: error.response?.data?.mesaj || "Talep onaylanamadı.",
    };
  }
}

// ✅ Satış İptal Et
export async function cancelSale(productId, token) {
  try {
    const res = await axios.put(
      `${API_URL}/talep/iptal/${productId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return { error: false, message: res.data.message };
  } catch (error) {
    return {
      error: true,
      message: error.response?.data?.mesaj || "Satış iptali başarısız.",
    };
  }
}
