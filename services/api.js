// services/api.js
<<<<<<< HEAD
import axiosInstance from "../api/axiosInstance";
import axios from "axios";
import { api_url } from "../constants/api_url";

export async function login(girisBilgisi, sifre) {
  try {
    const res = await axios.post(`${api_url}/api/kullanici/giris`, {
=======
import axiosInstance from '../api/axiosInstance';

export async function login(girisBilgisi, sifre) {
  try {
    const res = await axiosInstance.post('/kullanici/giris', {
>>>>>>> f4c47392e4a2687f55dcc9ef902610ef1a3bdc01
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
<<<<<<< HEAD
      message: err.response?.data?.mesaj || "Sunucu hatası",
=======
      message: err.response?.data?.mesaj || 'Sunucu hatası',
>>>>>>> f4c47392e4a2687f55dcc9ef902610ef1a3bdc01
    };
  }
}

export async function signup(kullaniciAdi, eposta, sifre) {
  try {
<<<<<<< HEAD
    const res = await axiosInstance.post(`${api_url}/api/kullanici/kayit`, {
=======
    const res = await axiosInstance.post('/kullanici/kayit', {
>>>>>>> f4c47392e4a2687f55dcc9ef902610ef1a3bdc01
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
<<<<<<< HEAD
      message: err.response?.data?.mesaj || "Sunucu hatası",
=======
      message: err.response?.data?.mesaj || 'Sunucu hatası',
>>>>>>> f4c47392e4a2687f55dcc9ef902610ef1a3bdc01
    };
  }
}

export async function getProfile(token) {
  try {
<<<<<<< HEAD
    const res = await axiosInstance.get("/kullanici/profil", {
=======
    const res = await axiosInstance.get('/kullanici/profil', {
>>>>>>> f4c47392e4a2687f55dcc9ef902610ef1a3bdc01
      headers: { Authorization: `Bearer ${token}` },
    });

    return {
      error: !res.data.basarili,
      user: res.data.kullanici,
    };
  } catch (err) {
    return {
      error: true,
<<<<<<< HEAD
      message: err.response?.data?.mesaj || "Profil alınamadı",
=======
      message: err.response?.data?.mesaj || 'Profil alınamadı',
>>>>>>> f4c47392e4a2687f55dcc9ef902610ef1a3bdc01
    };
  }
}
