// services/api.js
import axiosInstance from "../api/axiosInstance";
import axios from "axios";
import { api_url } from "../constants/api_url";

export async function login(girisBilgisi, sifre) {
  try {
    const res = await axios.post(`${api_url}/api/kullanici/giris`, {
      kullaniciAdi: girisBilgisi,
      sifre,
    });

    return {
      error: !res.data.basarili,
      message: res.data.mesaj,
      token: res.data.token,
      user: res.data.kullanici,
    };
  } catch (err) {
    return {
      error: true,
      message: err.response?.data?.mesaj || "Sunucu hatası",
    };
  }
}

export async function signup(kullaniciAdi, eposta, sifre) {
  try {
    const res = await axiosInstance.post("/kullanici/kayit", {
      kullaniciAdi,
      eposta,
      sifre,
    });

    return {
      error: !res.data.basarili,
      message: res.data.mesaj,
      token: res.data.token,
      user: res.data.kullanici,
    };
  } catch (err) {
    return {
      error: true,
      message: err.response?.data?.mesaj || "Sunucu hatası",
    };
  }
}

export async function getProfile(token) {
  try {
    const res = await axiosInstance.get("/kullanici/profil", {
      headers: { Authorization: `Bearer ${token}` },
    });

    return {
      error: !res.data.basarili,
      user: res.data.kullanici,
    };
  } catch (err) {
    return {
      error: true,
      message: err.response?.data?.mesaj || "Profil alınamadı",
    };
  }
}
