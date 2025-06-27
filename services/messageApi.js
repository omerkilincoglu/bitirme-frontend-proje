// 📄 messageApi.js
import axios from "axios";
import { api_url } from "../constants/api_url";

const API_URL = `${api_url}/api`;

/**
 * 📨 Belirli sohbetin mesajlarını getirir
 */
export async function getChatMessages(sohbetId, token) {
  try {
    const response = await axios.get(`${API_URL}/mesaj/${sohbetId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      success: true,
      data: response.data.mesajlar || [],
    };
  } catch (error) {
    console.error("❌ Mesajlar alınamadı:", error);
    return {
      success: false,
      message: "Mesajlar alınamadı",
    };
  }
}

/**
 * ✉️ Yeni sohbet başlatır ve ilk mesajı gönderir
 */
export async function sendMessage(urunId, mesaj, token) {
  console.log("📤 Yeni mesaj gönderiliyor:", { urunId, mesaj });

  try {
    const response = await axios.post(
      `${API_URL}/mesaj/gonder`,
      { urunId, mesaj },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return {
      success: true,
      data: response.data.veri,
      sohbetId: response.data.sohbetId,
    };
  } catch (error) {
    console.error("❌ Yeni sohbet mesaj gönderme hatası:", error);
    return {
      success: false,
      message:
        error?.response?.data?.mesaj ||
        "Yeni sohbet sırasında mesaj gönderilemedi.",
    };
  }
}

/**
 * ✅ Mevcut sohbetin mesajlarını okundu olarak işaretler
 */
export async function markMessagesAsRead(sohbetId, token) {
  try {
    await axios.put(
      `${API_URL}/mesaj/okundu/${sohbetId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return { success: true };
  } catch (error) {
    console.error("❌ Okundu güncelleme hatası:", error);
    return { success: false };
  }
}

/**
 * 💬 Var olan bir sohbete mesaj gönderir
 * (Bu eksikti, eklendi!)
 */
export async function sendMessageByChatId(sohbetId, mesaj, urunId, token) {
  try {
    const response = await axios.post(
      `${API_URL}/mesaj/sohbet/${sohbetId}`,
      { mesaj, urunId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return {
      success: true,
      data: response.data.veri,
    };
  } catch (error) {
    console.error("❌ Mevcut sohbete mesaj gönderilemedi:", error);
    return {
      success: false,
      message:
        error?.response?.data?.mesaj || "Mevcut sohbete mesaj gönderilemedi.",
    };
  }
}
