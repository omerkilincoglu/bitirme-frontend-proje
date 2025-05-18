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
