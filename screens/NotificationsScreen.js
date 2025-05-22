import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  RefreshControl,
  StatusBar,
} from "react-native";
import { AuthContext } from "../store/AuthContext";
import axios from "axios";
import colors from "../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import EmptyState from "../components/EmptyState";

export default function NotificationsScreen({ navigation }) {
  const { token } = useContext(AuthContext);
  const [bildirimler, setBildirimler] = useState([]);
  const [loading, setLoading] = useState(true);
  const [secimModu, setSecimModu] = useState(false);
  const [seciliBildirimler, setSeciliBildirimler] = useState([]);

  const fetchBildirimler = async () => {
    setLoading(true);
    setBildirimler([]);
    try {
      const res = await axios.get("http://10.7.85.158:3000/api/bildirim", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Veriyi doğru yerden çek
      const all = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data.data)
        ? res.data.data
        : [];

      // Logla kaç bildirim geldi

      const filtered = all.filter((b) =>
        ["TALEP_ONAY", "TALEP_RED", "TALEP_BILGI", "URUN_SATILDI"].includes(
          b.tip
        )
      );

      const sorted = filtered.sort(
        (a, b) => new Date(b.zaman || 0) - new Date(a.zaman || 0)
      );

      setBildirimler(sorted);
    } catch (err) {
      console.log("Bildirim yüklenemedi", err);
      Alert.alert("Hata", "Bildirimler alınamadı.");
    } finally {
      setLoading(false);
    }
  };

  const isaretleOkunduHepsi = async () => {
    try {
      await axios.put(
        "http://10.7.85.158:3000/api/bildirim/tumunu-okundu",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (err) {
      console.log("Okundu olarak işaretleme başarısız");
    }
  };

  const bildirimSil = async (id) => {
    try {
      await axios.delete(`http://10.7.85.158:3000/api/bildirim/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchBildirimler();
    } catch (err) {
      Alert.alert("Hata", "Bildirim silinemedi.");
    }
  };

  const toggleSecim = (id) => {
    if (seciliBildirimler.includes(id)) {
      setSeciliBildirimler((prev) => prev.filter((x) => x !== id));
    } else {
      setSeciliBildirimler((prev) => [...prev, id]);
    }
  };

  const topluSil = async () => {
    try {
      await axios.post(
        "http://10.7.85.158:3000/api/bildirim/toplu-sil",
        { ids: seciliBildirimler },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSeciliBildirimler([]);
      setSecimModu(false);
      fetchBildirimler();
    } catch (err) {
      Alert.alert("Hata", "Bildirimler silinemedi.");
    }
  };

  const handleHepsiniSil = () => {
    if (bildirimler.length === 0) return;

    Alert.alert("Tüm Bildirimler Silinsin mi?", "Bu işlem geri alınamaz.", [
      { text: "İptal", style: "cancel" },
      {
        text: "Evet, Sil",
        style: "destructive",
        onPress: async () => {
          try {
            const ids = bildirimler.map((b) => b.id);
            await axios.post(
              "http://10.7.85.158:3000/api/bildirim/toplu-sil",
              { ids },
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            setSecimModu(false);
            setSeciliBildirimler([]);
            fetchBildirimler();
          } catch (err) {
            Alert.alert("Hata", "Bildiriler silinemedi.");
          }
        },
      },
    ]);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      await isaretleOkunduHepsi();
      await fetchBildirimler();
    });

    const blurListener = navigation.addListener("blur", () => {
      setSecimModu(false);
      setSeciliBildirimler([]);
    });

    return () => {
      unsubscribe();
      blurListener();
    };
  }, [navigation]);

  useEffect(() => {
    if (secimModu && seciliBildirimler.length === 0) {
      setSecimModu(false);
    }
  }, [seciliBildirimler]);

  const getTipStili = (tip) => {
    switch (tip) {
      case "TALEP_ONAY":
        return { backgroundColor: "#E6F4EA", borderLeftColor: "#4CAF50" };
      case "TALEP_RED":
        return { backgroundColor: "#FDEAEA", borderLeftColor: "#f44336" };
      case "TALEP_BILGI":
        return { backgroundColor: "#FFF9E5", borderLeftColor: "#FFC107" };
      case "URUN_SATILDI":
        return { backgroundColor: "#E8EAF6", borderLeftColor: "#3F51B5" };
      default:
        return { backgroundColor: "#F5F5F5", borderLeftColor: "#ccc" };
    }
  };

  const renderItem = ({ item }) => {
    try {
      const temizMesaj = item.mesaj?.replace(/\n/g, " ") || "";
      const [mesajMetniRaw, urunSatiri] = temizMesaj.split("Ürün:");
      const mesajMetni = mesajMetniRaw?.trim() || temizMesaj;
      const urunAdi = urunSatiri?.trim() || "";
      const stil = getTipStili(item.tip);

      return (
        <TouchableOpacity
          onLongPress={() => {
            setSecimModu(true);
            toggleSecim(item.id);
          }}
          onPress={() => {
            if (secimModu) {
              toggleSecim(item.id);
            }
          }}
          style={[
            styles.card,
            {
              backgroundColor: stil.backgroundColor,
              borderLeftWidth: 5,
              borderLeftColor: stil.borderLeftColor,
            },
            !item.okundu && styles.unread,
            seciliBildirimler.includes(item.id) && styles.selectedCard,
          ]}
        >
          <Text style={styles.text}>{mesajMetni}</Text>

          {urunAdi !== "" && <Text style={styles.productName}>{urunAdi}</Text>}

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              flexWrap: "nowrap", // 👈 Alt alta geçmeyi engeller
              marginTop: 8,
            }}
          >
            <Ionicons
              name="calendar"
              size={14}
              color="#777"
              style={{ marginRight: 4 }}
            />
            <Text style={styles.infoText}>
              {new Date(item.zaman).toLocaleDateString("tr-TR")}
            </Text>
            <View style={{ width: 12 }} />
            <Ionicons
              name="time"
              size={14}
              color="#777"
              style={{ marginRight: 4 }}
            />
            <Text style={styles.infoText}>
              {new Date(item.zaman).toLocaleTimeString("tr-TR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </View>
        </TouchableOpacity>
      );
    } catch (e) {
      return null;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <View style={styles.topBar}>
        <Text style={styles.pageTitle}>Bildirimler</Text>
        <TouchableOpacity onPress={handleHepsiniSil}>
          <Ionicons name="trash-bin" size={22} color="red" />
        </TouchableOpacity>
      </View>

      {secimModu && seciliBildirimler.length > 0 && (
        <View style={styles.selectionBar}>
          <Text style={styles.selectionText}>
            {seciliBildirimler.length} seçildi
          </Text>
          <TouchableOpacity onPress={topluSil}>
            <Ionicons name="trash" size={24} color="red" />
          </TouchableOpacity>
        </View>
      )}

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : bildirimler.length === 0 ? (
        <EmptyState
          icon="notifications-off"
          title="Henüz Bildirimin Yok"
          message="İşlemlerden, teklifler ve satışlardan bildirim alırsın."
        />
      ) : (
        <FlatList
          data={bildirimler}
          renderItem={renderItem}
          keyExtractor={(item, index) =>
            item.id?.toString() || index.toString()
          }
          extraData={seciliBildirimler}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={fetchBildirimler}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  card: {
    backgroundColor: colors.white,
    padding: 12,
    marginBottom: 10,
    borderRadius: 12,
    elevation: 2,
  },
  unread: {
    borderLeftWidth: 5,
    borderLeftColor: colors.primary,
    backgroundColor: "#FFF7E6",
  },
  text: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.primaryText,
    marginBottom: 4,
  },
  selectionBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: "#FFE5E5",
  },
  selectionText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: "#FFF3E0",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.primaryText,
  },
  productName: {
    fontSize: 14,
    color: colors.dark,
    marginTop: 4,
    fontWeight: "500",
  },
  infoText: {
    fontSize: 13,
    color: "#666",
  },
});
