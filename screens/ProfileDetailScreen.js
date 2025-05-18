import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import colors from "../constants/colors";

export default function ProfileDetailScreen() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axios.get(
        "http://10.7.85.158:3000/api/kullanici/profil",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUser(res.data.kullanici);
    } catch (err) {
      Alert.alert("Hata", "Profil bilgileri alınamadı.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Kullanıcı Bilgileri</Text>

      <View style={styles.card}>
        <Ionicons
          name="person-circle-outline"
          size={24}
          color={colors.primary}
        />
        <View style={styles.textBox}>
          <Text style={styles.label}>Kullanıcı Adı</Text>
          <Text style={styles.value}>{user.kullaniciAdi}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Ionicons name="mail-outline" size={24} color={colors.primary} />
        <View style={styles.textBox}>
          <Text style={styles.label}>E-posta</Text>
          <Text style={styles.value}>{user.eposta}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.primaryText,
    marginBottom: 16,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    padding: 14,
    borderRadius: 12,
    elevation: 1,
    marginBottom: 16,
  },
  textBox: {
    marginLeft: 12,
    flex: 1,
  },
  label: {
    fontSize: 13,
    color: colors.gray,
  },
  value: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.primaryText,
    marginTop: 4,
  },
});
