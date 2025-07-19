import React, { useState, useContext } from "react";
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
import { AuthContext } from "../store/AuthContext";
import colors from "../constants/colors";
import { api_url } from "../constants/api_url";
export default function DeleteAccountScreen({ navigation }) {
  const [sifre, setSifre] = useState("");
  const [loading, setLoading] = useState(false);
  const { logout } = useContext(AuthContext);

  const handleDelete = async () => {
    if (!sifre.trim()) {
      Alert.alert("Uyarı", "Lütfen şifrenizi girin.");
      return;
    }

    Alert.alert(
      "Emin misiniz?",
      "Bu işlem geri alınamaz. Hesabınız tamamen silinecektir..",
      [
        { text: "İptal", style: "cancel" },
        {
          text: "Evet",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              const token = await AsyncStorage.getItem("token");

              await axios({
                method: "delete",
                url: `${api_url}/api/kullanici/hesap-sil`,
                data: { sifre },
                headers: { Authorization: `Bearer ${token}` },
              });

              Alert.alert("Silindi", "Hesabınız Tamamen silindi.");
              logout();
            } catch (err) {
              const msg =
                err?.response?.data?.mesaj || "Silme işlemi başarısız.";
              Alert.alert("Hata", msg);
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.warningBox}>
        <View style={styles.warningRow}>
          <Ionicons
            name="warning-outline"
            size={18}
            color="red"
            style={{ marginRight: 6 }}
          />
          <Text style={styles.warningText}>
            <Text style={{ fontWeight: "bold" }}>
              Bu işlem kalıcıdır. Hesabınızla birlikte tüm ürünleriniz,
              mesajlarınız ve verileriniz silinecek.
            </Text>
          </Text>
        </View>
      </View>

      <Text style={styles.label}>Şifrenizi Girin</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        value={sifre}
        onChangeText={setSifre}
      />

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.6 }]}
        onPress={handleDelete}
        disabled={loading}
      >
        <View style={styles.buttonContent}>
          <Ionicons
            name="trash-outline"
            size={18}
            color="#fff"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.buttonText}>
            {loading ? "Siliniyor..." : "Hesabımı Sil"}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF5EB", padding: 20 },
  warningBox: {
    backgroundColor: "#FEF3C7", // daha sıcak sarı
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#FCD34D", // sınır tonu
  },
  warningRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  warningText: {
    color: "#92400E", // yazı için sıcak turuncu-kahve tonu
    fontSize: 14,
    fontWeight: "bold",
    lineHeight: 20,
  },

  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#666",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 40,
    borderWidth: 1,
    borderColor: "#ddd",
    color: colors.primaryText,
  },

  button: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
