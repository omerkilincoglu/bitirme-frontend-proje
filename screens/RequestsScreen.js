// 📄 screens/RequestsScreen.js

import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from "react-native";
import { AuthContext } from "../store/AuthContext";
import axios from "axios";
import colors from "../constants/colors";
import EmptyState from "../components/EmptyState";
import { Ionicons } from "@expo/vector-icons";
import { api_url } from "../constants/api_url";

export default function RequestsScreen({ route }) {
  const { token } = useContext(AuthContext);
  const { id } = route.params; // Ürün ID
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchRequests();
  }, [id]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${api_url}/api/talep/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(res.data.data || []);
    } catch (err) {
      Alert.alert("Hata", "Talepler yüklenemedi.");
    } finally {
      setLoading(false);
    }
  };

  const handleRequestAction = async (urunId, action) => {
    try {
      const url = `${api_url}/api/talep/${action}/${urunId}`;
      await axios.put(
        url,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setRequests((prev) =>
        prev.map((req) =>
          req.urunId === urunId
            ? {
                ...req,
                durum: action === "onayla" ? "ONAYLANDI" : "REDDEDILDI",
              }
            : req
        )
      );

      Alert.alert(
        "Başarılı",
        `Talep ${action === "onayla" ? "onaylandı" : "reddedildi"}.`
      );
    } catch (err) {
      Alert.alert("Hata", "İşlem gerçekleştirilemedi.");
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.rowBetween}>
        <View style={styles.row}>
          <Ionicons name="person-circle" size={36} color={colors.primary} />
          <Text style={styles.username}>{item.alici.kullaniciAdi}</Text>
        </View>
        <Text style={[styles.statusBadge, getStatusStyle(item.durum)]}>
          {item.durum}
        </Text>
      </View>

      <Text style={styles.message}>{item.mesaj}</Text>

      <View style={styles.bottomRow}>
        <View style={styles.row}>
          <Ionicons
            name="calendar"
            size={14}
            color="#777"
            style={{ marginRight: 4 }}
          />
          <Text style={styles.infoText}>
            {new Date(item.tarih).toLocaleDateString("tr-TR")}
          </Text>
          <Ionicons
            name="time"
            size={14}
            color="#777"
            style={{ marginHorizontal: 8 }}
          />
          <Text style={styles.infoText}>
            {new Date(item.tarih).toLocaleTimeString("tr-TR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>

        {item.durum === "BEKLIYOR" && (
          <View style={styles.row}>
            <TouchableOpacity
              style={styles.acceptBtn}
              onPress={() => handleRequestAction(item.urunId, "onayla")}
            >
              <Text style={styles.btnText}>Onayla</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.rejectBtn}
              onPress={() => handleRequestAction(item.urunId, "reddet")}
            >
              <Text style={styles.btnText}>Reddet</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );

  const getStatusStyle = (durum) => {
    switch (durum) {
      case "ONAYLANDI":
        return { backgroundColor: "#4CAF50" };
      case "REDDEDILDI":
        return { backgroundColor: "#f44336" };
      default:
        return { backgroundColor: "#FFC107" };
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : requests.length === 0 ? (
        <EmptyState
          icon="people-outline"
          title="Henüz Talep Yok"
          message="İlanınıza gelen teklifler burada listelenecek."
        />
      ) : (
        <FlatList
          data={requests}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.background,
  },
  card: {
    backgroundColor: colors.white,
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  username: {
    marginLeft: 8,
    fontWeight: "600",
    fontSize: 15,
    color: colors.primaryText,
  },
  message: {
    marginTop: 6,
    fontSize: 14,
    color: colors.dark,
  },
  infoText: {
    fontSize: 13,
    color: "#666",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: "bold",
    color: "#fff",
  },
  acceptBtn: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: 6,
  },
  rejectBtn: {
    backgroundColor: "#f44336",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: 6,
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 13,
  },
  bottomRow: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
