// NotificationsScreen.js
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
} from "react-native";
import { AuthContext } from "../store/AuthContext";
import axios from "axios";
import colors from "../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import EmptyState from "../components/EmptyState";

export default function NotificationsScreen() {
  const { token } = useContext(AuthContext);
  const [bildirimler, setBildirimler] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBildirimler = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://10.7.85.158:3000/api/bildirim", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBildirimler(res.data);
    } catch (err) {
      console.log("Bildirim yüklenemedi", err);
      Alert.alert("Hata", "Bildirimler alınamadı.");
    } finally {
      setLoading(false);
    }
  };

  const isaretleOkundu = async (id) => {
    try {
      await axios.put(
        `http://10.7.85.158:3000/api/bildirim/${id}/okundu`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchBildirimler();
    } catch (err) {
      Alert.alert("Hata", "Bildirim işaretlenemedi.");
    }
  };

  useEffect(() => {
    fetchBildirimler();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => isaretleOkundu(item.id)}
      style={[styles.card, !item.okundu && styles.unread]}
    >
      <Text style={styles.text}>{item.mesaj}</Text>
      <Text style={styles.time}>
        {new Date(item.zaman).toLocaleString("tr-TR")}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
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
          keyExtractor={(item) => item.id.toString()}
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
    borderRadius: 8,
    elevation: 2,
  },
  unread: {
    borderLeftWidth: 5,
    borderLeftColor: colors.primary,
    backgroundColor: "#FFF7E6",
  },
  text: {
    fontSize: 15,
    color: colors.primaryText,
  },
  time: {
    fontSize: 13,
    color: colors.secondaryText,
    marginTop: 4,
  },
});
