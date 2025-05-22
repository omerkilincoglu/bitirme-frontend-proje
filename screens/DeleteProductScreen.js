import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { AuthContext } from "../store/AuthContext";
import { deleteProduct } from "../services/productApi";
import axios from "axios";
import colors from "../constants/colors";

export default function DeleteProductScreen() {
  const route = useRoute();

  const navigation = useNavigation();
  const { token } = useContext(AuthContext);
  const { id } = route.params;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await axios.get(`http://10.7.85.158:3000/api/urun/${id}`);
        setProduct(res.data.urun);
      } catch (error) {
        Alert.alert("Hata", "Ürün getirilemedi.");
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  const handleDelete = async () => {
    const result = await deleteProduct(product.id, token);
    if (!result.error) {
      Alert.alert("Silindi", "Ürün başarıyla silindi 🗑️");
      navigation.goBack();
    } else {
      Alert.alert("Hata", result.message);
    }
  };

  if (loading || !product) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: `http://10.7.85.158:3000/uploads/${product.resim}` }}
        style={styles.image}
      />
      <Text style={styles.title}>{product.baslik}</Text>
      <Text style={styles.warning}>
        Bu ürünü silmek üzeresin. Devam etmek istiyor musun?
      </Text>

      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Text style={styles.deleteText}>Evet, Sil</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.cancelText}>Vazgeç</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: colors.background,
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 240,
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.primaryText,
    marginBottom: 10,
  },
  warning: {
    fontSize: 16,
    color: colors.dark,
    marginBottom: 24,
  },
  deleteButton: {
    backgroundColor: "red",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 12,
  },
  deleteText: {
    color: "white",
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#ccc",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  cancelText: {
    color: colors.dark,
    fontWeight: "bold",
  },
});
