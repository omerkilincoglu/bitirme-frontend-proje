import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import colors from "../constants/colors";
import { api_url } from "../constants/api_url";

export default function UpdatePasswordScreen({ navigation }) {
  const [mevcutSifre, setMevcutSifre] = useState("");
  const [yeniSifre, setYeniSifre] = useState("");
  const [yeniSifreTekrar, setYeniSifreTekrar] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showNewPasswordAgain, setShowNewPasswordAgain] = useState(false);

  const handlePasswordUpdate = async () => {
    // Trimlenmiş boşluk kontrolü
    if (
      mevcutSifre.trim() === "" ||
      yeniSifre.trim() === "" ||
      yeniSifreTekrar.trim() === ""
    ) {
      Alert.alert("Eksik Alan", "Lütfen tüm alanları doldurun.");
      return;
    }

    if (yeniSifre.length < 6) {
      Alert.alert("Geçersiz Şifre", "Yeni şifre en az 6 karakter olmalı.");
      return;
    }

    if (yeniSifre !== yeniSifreTekrar) {
      Alert.alert("Hata", "Yeni şifreler uyuşmuyor.");
      return;
    }

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      const res = await axios.put(
        `${api_url}/api/kullanici/sifre`,
        {
          sifreMevcut: mevcutSifre,
          sifreYeni: yeniSifre,
          sifreYeniTekrar: yeniSifreTekrar,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Alert.alert("Başarılı", res.data.mesaj);
      navigation.goBack();
    } catch (err) {
      const msg =
        err?.response?.data?.mesaj ||
        "Şifre güncellenemedi. Lütfen tekrar deneyin.";
      Alert.alert("Hata", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Mevcut Şifre</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        value={mevcutSifre}
        onChangeText={setMevcutSifre}
      />

      <Text style={styles.label}>Yeni Şifre</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        value={yeniSifre}
        onChangeText={setYeniSifre}
      />

      <Text style={styles.label}>Yeni Şifre (Tekrar)</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        value={yeniSifreTekrar}
        onChangeText={setYeniSifreTekrar}
      />

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.6 }]}
        onPress={handlePasswordUpdate}
        disabled={loading}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Ionicons
            name="lock-closed"
            size={18}
            color="white"
            style={{ marginRight: 6 }}
          />
          <Text style={styles.buttonText}>Şifreyi Güncelle</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF5EB", // favoriler ile aynı pastel açık zemin
    padding: 20,
  },

  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 20,
    color: "#666",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    color: colors.primaryText,
  },

  button: {
    marginTop: 40,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
