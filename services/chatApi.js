<<<<<<< HEAD
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
=======
  // services/chatApi.js
  import axios from "axios";
  const API_URL = "http://10.7.85.158:3000/api";

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
>>>>>>> f4c47392e4a2687f55dcc9ef902610ef1a3bdc01
