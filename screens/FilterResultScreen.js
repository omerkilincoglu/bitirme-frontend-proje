//FilterResultScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import colors from "../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { getProducts } from "../services/productApi";
import EmptyState from "../components/EmptyState";

export default function FilterResultScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFilteredProducts = async () => {
    try {
      const result = await getProducts(route.params || {});
      if (!result.error) setProducts(result.urunler);
    } catch (error) {
      console.error("Filtreli ürün hatası:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilteredProducts();
  }, [route.params]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("ProductDetail", { id: item.id })}
    >
      <Image
        source={{ uri: `http://10.7.85.158:3000/uploads/${item.resim}` }}
        style={styles.image}
      />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {item.baslik}
        </Text>
        <Text style={styles.price}>{item.fiyat} ₺</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (products.length === 0) {
    return (
      <EmptyState
        icon="search-outline"
        title="Sonuç Bulunamadı"
        message="Seçilen filtrelere uygun ürün bulunamadı. Filtreleri değiştirerek tekrar deneyebilirsiniz."
        actionLabel="Filtreyi Değiştir"
        onAction={() => navigation.goBack()}
      />
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        contentContainerStyle={styles.listContent}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: 12,
    paddingVertical: 16,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 10,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 3,
    width: "48%",
  },
  image: {
    width: "100%",
    height: 160,
  },
  info: {
    padding: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.primaryText,
  },
  price: {
    fontSize: 13,
    color: colors.dark,
    marginTop: 4,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
});
