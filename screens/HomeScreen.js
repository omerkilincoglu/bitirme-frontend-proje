// Güncellenmiş HomeScreen.js - Favori işlemleri entegre ve veritabanına kayıt garantili
import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Pressable,
  RefreshControl,
  TextInput,
  StatusBar,
  Alert,
} from "react-native";
import axios from "axios";
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useCallback } from "react";
import { AuthContext } from "../store/AuthContext";
import { getProducts } from "../services/productApi";
import EmptyState from "../components/EmptyState";
import {
  getFavorites,
  addFavorite,
  deleteFavorite,
} from "../services/favoriteApi";
import colors from "../constants/colors";

export default function HomeScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { logout, token } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCondition, setSelectedCondition] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [bildirimSayisi, setBildirimSayisi] = useState(0);
  const [sohbetler, setSohbetler] = useState([]);

  const fetchFavorites = async () => {
    try {
      const list = await getFavorites();
      const ids = list.map((fav) => fav.urunId);
      setFavoriteIds(ids);
    } catch (err) {
      console.log("Favoriler alınamadı", err);
    }
  };

  const toggleFavorite = async (urunId) => {
    try {
      const list = await getFavorites();
      const fav = list.find((f) => f.urunId === urunId);

      if (fav) {
        await deleteFavorite(fav.id);
        console.log("Favori silindi:", urunId);
        Alert.alert("Favori Kaldırıldı", "Ürün favorilerden çıkarıldı.");
      } else {
        const res = await addFavorite(urunId);
        console.log("Favori eklendi:", res);
        Alert.alert("Favori Eklendi", "Ürün favorilere eklendi.");
      }

      await fetchFavorites();
    } catch (err) {
      console.log("Favori işlemi hatası", err);
      Alert.alert("Hata", "Favori işlemi sırasında bir hata oluştu.");
    }
  };

  const fetchProducts = async (customFilters = null) => {
    setLoading(true);
    try {
      const filters = customFilters || {
        arama: searchQuery,
        kategori: selectedCategory,
        durum: selectedCondition,
        minFiyat: minPrice,
        maxFiyat: maxPrice,
      };
      const result = await getProducts(filters);
      if (!result.error) setProducts(result.urunler);
    } catch (e) {
      console.error("Ürün çekme hatası:", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchBildirimSayisi = async () => {
    if (!token) return; // token yoksa çalıştırma
    try {
      const res = await axios.get(
        "http://10.7.85.158:3000/api/bildirim/sayac",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setBildirimSayisi(res.data.okunmamisSayisi);
    } catch (err) {
      console.log("Bildirim sayısı alınamadı:", err);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchProducts();
      fetchFavorites();
      fetchBildirimSayisi();
    });
    return unsubscribe;
  }, [navigation, token]);

  useEffect(() => {
    if (route.params) {
      const { arama, kategori, durum, minFiyat, maxFiyat } = route.params;
      setSearchQuery(arama || "");
      setSelectedCategory(kategori || "");
      setSelectedCondition(durum || "");
      setMinPrice(minFiyat || "");
      setMaxPrice(maxFiyat || "");
    }
  }, [route.params]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchProducts();
      fetchFavorites();
      fetchBildirimSayisi(); // 🔔 burada eklendi
    });
    return unsubscribe;
  }, [navigation]);

  // 🟢 sohbetleri çekmek için useFocusEffect
  useFocusEffect(
    useCallback(() => {
      const fetchSohbetler = async () => {
        try {
          const res = await axios.get("http://10.7.85.158:3000/api/sohbet", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setSohbetler(res.data.sohbetler || []);
        } catch (err) {
          console.log("Sohbet verisi alınamadı", err);
        }
      };

      fetchSohbetler();
    }, [token])
  );

  // 🟢 okunmamış sohbet sayısını hesapla
  const okunmamisSohbetSayisi = sohbetler.filter((s) => s.okunmamis > 0).length;

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity
        onPress={() => navigation.navigate("ProductDetail", { id: item.id })}
      >
        <Image
          source={{ uri: `http://10.7.85.158:3000/uploads/${item.resim}` }}
          style={styles.image}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.favoriteIcon}
        onPress={() => toggleFavorite(item.id)}
      >
        <Ionicons
          name={favoriteIds.includes(item.id) ? "heart" : "heart-outline"}
          size={18}
          color="orange"
        />
      </TouchableOpacity>

      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {item.baslik}
        </Text>
        <Text style={styles.price}>{item.fiyat} ₺</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <View style={styles.topBar}>
        <View style={styles.topRow}>
          <View style={styles.searchContainer}>
            <Ionicons
              name="search"
              size={20}
              color={colors.gray}
              style={styles.searchIcon}
            />
            <TextInput
              placeholder="Ürün ara..."
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <TouchableOpacity onPress={() => navigation.navigate("Filter")}>
              <Ionicons
                name="options-outline"
                size={20}
                color={colors.primary}
              />
            </TouchableOpacity>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <TouchableOpacity
              onPress={() => navigation.navigate("ChatListScreen")}
              style={styles.iconButton}
            >
              <Ionicons name="mail-outline" size={20} color={colors.primary} />
              {okunmamisSohbetSayisi > 0 && <View style={styles.redDot} />}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate("NotificationsScreen")}
              style={styles.iconButton}
            >
              <Ionicons
                name="notifications-outline"
                size={24}
                color={colors.primary}
              />
              {bildirimSayisi > 0 && <View style={styles.redDot} />}
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color={colors.primary}
          style={{ marginTop: 20 }}
        />
      ) : products.length === 0 ? (
        <EmptyState
          icon="search-outline"
          title="Ürün Bulunamadı"
          message="Aradığınız kriterlere uygun ürün bulunamadı."
        />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={fetchProducts} />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  topBar: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  topRow: { flexDirection: "row", alignItems: "center" },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 10,
    paddingHorizontal: 12,
    elevation: 2,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 16, color: colors.primaryText },
  roundIcon: {
    backgroundColor: "#FFE5B4",
    padding: 10,
    borderRadius: 24,
    marginLeft: 12,
  },
  listContent: { paddingHorizontal: 12, paddingBottom: 16, paddingTop: 12 },
  card: {
    backgroundColor: colors.white,
    borderRadius: 10,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 3,
    width: "48%",
    position: "relative",
  },
  image: { width: "100%", height: 160 },
  favoriteIcon: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 6,
    elevation: 3,
    zIndex: 2,
  },
  info: { padding: 10 },
  title: { fontSize: 14, fontWeight: "bold", color: colors.primaryText },
  price: { fontSize: 13, color: colors.dark, marginTop: 4 },
  emptyContainer: {
    flex: 1,
    backgroundColor: "#FFF3F3",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#D32F2F",
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#D32F2F",
    marginTop: 6,
    textAlign: "center",
  },
  iconButton: {
    backgroundColor: "#FFE9CC",
    padding: 8,
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "red",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  redDot: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 10,
    height: 10,
    backgroundColor: "red",
    borderRadius: 5,
  },
  redDot: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 10,
    height: 10,
    backgroundColor: "red",
    borderRadius: 5,
  },
});
