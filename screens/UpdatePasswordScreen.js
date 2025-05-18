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
        "http://10.7.85.158:3000/api/kullanici/sifre",
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
        <Ionicons
          name="lock-closed"
          size={18}
          color="white"
          style={{ marginRight: 6 }}
        />
        <Text style={styles.buttonText}>Şifreyi Güncelle</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 20,
    color: colors.gray,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 8,
    fontSize: 16,
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
