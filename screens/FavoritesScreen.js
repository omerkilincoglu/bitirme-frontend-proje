import React, { useState, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { AuthContext } from "../store/AuthContext";
import { deleteFavorite, getFavorites } from "../services/favoriteApi";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import colors from "../constants/colors";
import EmptyState from "../components/EmptyState";
import { api_url } from "../constants/api_url";
export default function FavoritesScreen({ navigation }) {
  const { token } = useContext(AuthContext);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    try {
      const list = await getFavorites();
      setFavorites(list);
    } catch (err) {
      Alert.alert("Hata", "Favoriler alınamadı");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (favoriId) => {
    try {
      await deleteFavorite(favoriId);
      setFavorites((prev) => prev.filter((item) => item.id !== favoriId));
      Alert.alert("💔 Favori Silindi", "Bu ürün artık favorilerinizde değil.");
    } catch (err) {
      Alert.alert("Hata", "Favori silinemedi");
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      fetchFavorites();
    }, [])
  );

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.row}
        onPress={() =>
          navigation.navigate("ProductDetail", { id: item.urun.id })
        }
      >
        <Image
          source={{ uri: `${api_url}/uploads/${item.urun.resim}` }}
          style={styles.image}
        />
        <View style={styles.infoBox}>
          <Text style={styles.title}>{item.urun.baslik}</Text>
          <Text style={styles.price}>{item.urun.fiyat} ₺</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => handleRemove(item.id)}
        style={styles.favoriteIcon}
      >
        <Ionicons name="heart" size={18} color="orange" />
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {favorites.length === 0 ? (
        <EmptyState
          icon="heart-dislike-outline"
          title="Favori Ürün Yok"
          message="Favorilerinize eklediğiniz ürünler burada görüntülenecek."
        />
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 16 }}
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
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
    overflow: "hidden",
    position: "relative",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 100,
    height: 100,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  infoBox: {
    flex: 1,
    padding: 10,
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.primaryText,
  },
  price: {
    fontSize: 14,
    marginTop: 4,
    color: colors.primary,
  },
  favoriteIcon: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "white",
    padding: 6,
    borderRadius: 20,
    elevation: 3,
    zIndex: 2,
  },
});
