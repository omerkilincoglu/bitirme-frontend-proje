import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
<<<<<<< HEAD
import { api_url } from "../constants/api_url";

const API_URL = `${api_url}/api/favori`;
=======

const API_URL = "http://10.7.85.158:3000/api/favori";
>>>>>>> f4c47392e4a2687f55dcc9ef902610ef1a3bdc01

const getAuthHeader = async () => {
  const token = await AsyncStorage.getItem("token");
  if (!token) console.warn("Token bulunamadı!");
  return { Authorization: `Bearer ${token}` };
};

// ✅ Favori ekle
export const addFavorite = async (urunId) => {
  const headers = await getAuthHeader();
  console.log("Favori ekleniyor:", urunId);
  const res = await axios.post(API_URL, { urunId }, { headers });
  console.log("Favori yanıtı:", res.data);
  return res.data;
};

// ✅ Favorilerimi getir
export const getFavorites = async () => {
  const headers = await getAuthHeader();
  const res = await axios.get(API_URL, { headers });
  return res.data.favoriler;
};

// ✅ Favori sil
export const deleteFavorite = async (favoriId) => {
  const headers = await getAuthHeader();
  const res = await axios.delete(`${API_URL}/${favoriId}`, { headers });
  return res.data;
};
