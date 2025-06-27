// services/chatApi.js
import axios from "axios";
import { api_url } from "../constants/api_url";
const API_URL = `${api_url}`;

// 💬 Sohbetleri getir
export async function getMyChats(token) {
  try {
    const res = await axios.get(`${API_URL}/sohbet`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.sohbetler;
  } catch (error) {
    console.error("Sohbetleri alma hatası:", error);
    return [];
  }
}
