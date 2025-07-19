// ChatScreen.js
import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  useLayoutEffect,
} from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../store/AuthContext";
import {
  getChatMessages,
  sendMessageByChatId,
  sendMessage,
} from "../services/messageApi";
import axios from "axios";
import colors from "../constants/colors";
import EmptyState from "../components/EmptyState";
import { api_url } from "../constants/api_url";

// Hazır mesajları satırlara bölen yardımcı fonksiyon
function chunkArray(array, size) {
  const chunked = [];
  for (let i = 0; i < array.length; i += size) {
    chunked.push(array.slice(i, i + size));
  }
  return chunked;
}

export default function ChatScreen({ route, navigation }) {
  const {
    sohbetId: initialSohbetId = null,
    urunId,
    karsiTarafAdi,
    karsiTarafAvatar,
  } = route.params;
  const [sohbetId, setSohbetId] = useState(initialSohbetId || null);
  const { token, user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");
  const flatListRef = useRef();
  const [aktifUrun, setAktifUrun] = useState(null);

  const quickReplies = [
    "Merhaba, teklifte bulunmak istiyorum.",
    "Ürün hâlâ satılık mı?",
    "Fiyatta pazarlık olur mu?",
    "Detaylı bilgi alabilir miyim?",
  ];

  useLayoutEffect(() => {
    if (karsiTarafAdi && karsiTarafAvatar) {
      navigation.setOptions({
        headerTitle: () => (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              source={{ uri: karsiTarafAvatar }}
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                marginRight: 8,
                backgroundColor: "#ccc",
              }}
            />
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>
              {karsiTarafAdi}
            </Text>
          </View>
        ),
      });
    }
  }, [navigation, karsiTarafAdi, karsiTarafAvatar]);

  useEffect(() => {
    const fetchUrun = async () => {
      try {
        const res = await axios.get(`${api_url}/api/urun/${urunId}`);
        setAktifUrun(res.data.urun);
      } catch (err) {
        console.log("Ürün bilgisi alınamadı:", err);
      }
    };
    if (urunId) {
      fetchUrun();
    }
  }, [urunId]);

  useEffect(() => {
    if (sohbetId) {
      const timeout = setTimeout(() => {
        fetchMessages();
        markMessagesAsRead();
      }, 300);
      return () => clearTimeout(timeout);
    } else {
      setLoading(false); // ✅ sohbetId yoksa da loading kapanmalı
    }
  }, [sohbetId]);

  const scrollToEnd = () => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const fetchMessages = async () => {
    if (!sohbetId) {
      setLoading(false); // sohbet yoksa bile loading kapatılmalı
      return;
    }

    setLoading(true);
    try {
      const result = await getChatMessages(sohbetId, token);

      if (result.success && Array.isArray(result.data)) {
        setMessages(result.data);

        // ilk mesajlardan birinde ürün varsa, aktif ürünü set et
        const urunluMesaj = result.data.find((msg) => msg.urun);
        if (urunluMesaj) {
          setAktifUrun(urunluMesaj.urun);
        }
      } else {
        setMessages([]);
      }

      scrollToEnd();
    } catch (error) {
      console.log("❌ fetchMessages error:", error);
      setMessages([]);
    } finally {
      setLoading(false); // hata olsa bile loading kapanmalı
    }
  };

  const markMessagesAsRead = async () => {
    try {
      await axios.put(
        `${api_url}/api/mesaj/okundu/${sohbetId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.log("Okundu güncelleme hatası:", err);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    let result;

    if (sohbetId) {
      result = await sendMessageByChatId(sohbetId, input, urunId, token);

      if (!result.success) {
        result = await sendMessage(urunId, input, token);
        if (result.success) {
          setSohbetId(result.sohbetId);
        }
      }
    } else {
      result = await sendMessage(urunId, input, token);
      if (result.success) {
        setSohbetId(result.sohbetId);
      }
    }

    if (result.success && result.data) {
      // ✅ Sadece ilk mesajda ürün bilgisini al
      if (result.data.urun && messages.length === 0) {
        setAktifUrun(result.data.urun);
      }

      setMessages((prev) => [...prev, result.data]);
      setInput("");
      scrollToEnd();
    } else {
      Alert.alert("Hata", result.message || "Mesaj gönderilemedi.");
    }
  };

  const renderMessage = ({ item, index }) => {
    const isMine = item.gondericiId === user.id;
    const isFirstForThisProduct =
      messages.findIndex((msg) => msg.urunId === item.urunId) === index;

    return (
      <View
        style={[
          styles.messageWrapper,
          isMine ? styles.alignRight : styles.alignLeft,
        ]}
      >
        <View
          style={[
            styles.messageBubble,
            isMine ? styles.myMessage : styles.theirMessage,
          ]}
        >
          {/* ÜRÜN KARTI ÜZERİNDEN ÜRÜN DETAYINA GİTME */}
          {item.urun && isFirstForThisProduct && (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("ProductDetail", { id: item.urun.id })
              }
            >
              <View style={styles.productCard}>
                <Image
                  source={{
                    uri: `${api_url}/uploads/${item.urun.resim}`,
                  }}
                  style={styles.productImage}
                />
                <View style={{ marginLeft: 8 }}>
                  <Text style={styles.productTitle}>{item.urun.baslik}</Text>
                  <Text style={styles.productPrice}>{item.urun.fiyat} ₺</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}

          <Text style={styles.messageText}>{item.mesaj}</Text>

          <View style={styles.metaInfo}>
            <Text style={styles.timeText}>
              {item.zaman ? item.zaman.slice(11, 16) : ""}
            </Text>
            {isMine && (
              <Ionicons
                name={item.okundu ? "checkmark-done" : "checkmark"}
                size={14}
                color={item.okundu ? "#4CAF50" : "#999"}
                style={{ marginLeft: 6 }}
              />
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={90}
    >
      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <>
          {/* Genel ürün bilgisi üstte (sohbetin başında gösterilir) */}
          {aktifUrun && (
            <View style={styles.aktifUrunContainer}>
              <Image
                source={{
                  uri: `${api_url}/uploads/${aktifUrun.resim}`,
                }}
                style={styles.aktifUrunImage}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.aktifUrunTitle}>{aktifUrun.baslik}</Text>
                <Text style={styles.aktifUrunFiyat}>{aktifUrun.fiyat} ₺</Text>
              </View>
            </View>
          )}

          {/* Mesaj listesi veya boş durumu */}
          {messages.length === 0 ? (
            <EmptyState
              icon="chatbubbles-outline"
              title="Henüz mesaj yok"
              message="Bu sohbette henüz hiç mesajlaşma yapılmamış."
            />
          ) : (
            <FlatList
              ref={flatListRef}
              data={messages}
              extraData={messages}
              renderItem={renderMessage}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.listContent}
              onContentSizeChange={() =>
                flatListRef.current?.scrollToEnd({ animated: true })
              }
            />
          )}
        </>
      )}

      {/* Hızlı mesajlar */}
      <View style={styles.quickReplyContainer}>
        {chunkArray(quickReplies, 2).map((row, rowIndex) => (
          <View key={rowIndex} style={styles.quickReplyRow}>
            {row.map((item, colIndex) => (
              <TouchableOpacity
                key={colIndex}
                onPress={() => setInput(item)}
                style={styles.quickReplyButton}
              >
                <Text style={styles.quickReplyText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>

      {/* Mesaj yazma alanı */}
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Mesaj yaz..."
          value={input}
          onChangeText={setInput}
          style={styles.input}
        />
        <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
          <Ionicons name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8F0",
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF8F0",
  },
  listContent: {
    padding: 12,
  },
  messageWrapper: {
    flexDirection: "row",
    marginBottom: 10,
  },
  alignRight: {
    justifyContent: "flex-end",
  },
  alignLeft: {
    justifyContent: "flex-start",
  },
  messageBubble: {
    maxWidth: "75%",
    padding: 10,
    borderRadius: 16,
  },
  myMessage: {
    backgroundColor: "#FFE0C2",
    alignSelf: "flex-end",
    borderTopRightRadius: 0,
  },
  theirMessage: {
    backgroundColor: "#ECECEC",
    alignSelf: "flex-start",
    borderTopLeftRadius: 0,
  },
  messageText: {
    color: "#000",
    fontSize: 14,
  },
  metaInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 4,
  },
  timeText: {
    fontSize: 10,
    color: "#666",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#f1f1f1",
  },
  sendButton: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    padding: 10,
    marginLeft: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  quickReplyContainer: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  quickReplyRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    flexWrap: "wrap",
    marginBottom: 8,
  },
  quickReplyButton: {
    backgroundColor: "#f1f1f1",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 10,
    marginBottom: 6,
    maxWidth: "48%",
  },
  quickReplyText: {
    fontSize: 13,
    color: "#333",
  },
  productCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 8,
    marginBottom: 6,
    borderColor: "#ddd",
    borderWidth: 1,
  },

  productImage: {
    width: 50,
    height: 50,
    borderRadius: 4,
  },

  productTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
  },

  productPrice: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
});
