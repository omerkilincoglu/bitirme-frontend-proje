import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import colors from "../constants/colors";
<<<<<<< HEAD
import { api_url } from "../constants/api_url";
=======
>>>>>>> f4c47392e4a2687f55dcc9ef902610ef1a3bdc01

export default function UpdateUsernameScreen({ navigation }) {
  const [kullaniciAdi, setKullaniciAdi] = useState("");
  const [sifre, setSifre] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (!kullaniciAdi || !sifre) {
      Alert.alert("Hata", "Tüm alanları doldurun.");
      return;
    }

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      const res = await axios.put(
<<<<<<< HEAD
        `${api_url}/api/kullanici/kullanici-adi`,
=======
        "http://10.7.85.158:3000/api/kullanici/kullanici-adi",
>>>>>>> f4c47392e4a2687f55dcc9ef902610ef1a3bdc01
        { kullaniciAdiYeni: kullaniciAdi, sifre },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Alert.alert("Başarılı", res.data.mesaj);
      navigation.goBack();
    } catch (err) {
      const msg =
        err?.response?.data?.mesaj || "Bir hata oluştu. Tekrar deneyin.";
      Alert.alert("Hata", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Yeni Kullanıcı Adı</Text>
      <TextInput
        style={styles.input}
        value={kullaniciAdi}
        onChangeText={setKullaniciAdi}
        autoCapitalize="none"
      />

      <Text style={styles.label}>Mevcut Şifre</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        value={sifre}
        onChangeText={setSifre}
      />

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.6 }]}
        onPress={handleUpdate}
        disabled={loading}
      >
        <Ionicons
          name="person"
          size={18}
          color="white"
          style={{ marginRight: 6 }}
        />
        <Text style={styles.buttonText}>Kullanıcı Adını Güncelle</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF5EB", padding: 20 },
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
