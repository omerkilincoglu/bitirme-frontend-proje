//CancelSaleScreen.js
import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
  Alert,
} from "react-native";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../store/AuthContext";
import colors from "../constants/colors";
import { cancelSale } from "../services/productApi";
import { api_url } from "../constants/api_url";

export default function CancelSaleScreen({ route, navigation }) {
  const { id } = route.params;
  const { token } = useContext(AuthContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`${api_url}/api/urun/${id}`);
      setProduct(res.data.urun);
    } catch (err) {
      Alert.alert("Hata", "Ürün bilgisi alınamadı.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    const result = await cancelSale(id, token);
    if (!result.error) {
      Alert.alert("Başarılı", result.message, [
        {
          text: "Tamam",
          onPress: () => navigation.goBack(),
        },
      ]);
    } else {
      Alert.alert("Hata", result.message);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  if (loading || !product) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: `${api_url}/uploads/${product.resim}` }}
        style={styles.image}
      />
      <Text style={styles.title}>{product.baslik}</Text>
      <Text style={styles.description}>
        Bu ürünün satış sürecini iptal etmek üzeresin. Devam etmek istiyor
        musun?
      </Text>

      <TouchableOpacity style={styles.cancelSaleButton} onPress={handleCancel}>
        <Ionicons name="close-circle-outline" size={18} color="white" />
        <Text style={styles.cancelSaleButtonText}>Evet, Satışı İptal</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.cancelButtonText}>Vazgeç</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF3E9",
    padding: 20,
    alignItems: "center",
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF3E9",
  },
  image: {
    width: "100%",
    height: 220,
    borderRadius: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: colors.primaryText,
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    color: colors.secondaryText,
    marginBottom: 30,
    textAlign: "center",
  },
  cancelSaleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f44336", // Gri-mavi tonu
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 12,
    width: "100%",
  },
  cancelSaleButtonText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 12,
  },
  cancelButton: {
    backgroundColor: "#ccc",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#333",
    fontWeight: "bold",
  },
});
