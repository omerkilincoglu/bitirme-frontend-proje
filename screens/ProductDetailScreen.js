// ProductDetailScreen.js
import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
} from "react-native";
import axios from "axios";
import { AuthContext } from "../store/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import {
  addFavorite,
  deleteFavorite,
  getFavorites,
} from "../services/favoriteApi";
import colors from "../constants/colors";

export default function ProductDetailScreen({ navigation, route }) {
  const { user, token } = useContext(AuthContext);
  const { id } = route.params;
  const [isImageModalVisible, setImageModalVisible] = useState(false);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [favoriId, setFavoriId] = useState(null);
  const [talepDurumu, setTalepDurumu] = useState(null);

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`http://10.7.85.158:3000/api/urun/${id}`);
      setProduct(res.data.urun);
    } catch (err) {
      Alert.alert("Hata", "Ürün detayları alınamadı.");
    } finally {
      setLoading(false);
    }
  };

  const fetchTalepDurumu = async () => {
    try {
      const res = await axios.get(
        `http://10.7.85.158:3000/api/talep/durum/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTalepDurumu(res.data.durum);
    } catch (err) {
      console.log("Talep durumu alınamadı:", err);
    }
  };

  const checkFavorite = async () => {
    try {
      const list = await getFavorites();
      const fav = list.find((f) => f.urunId === parseInt(id));
      if (fav) setFavoriId(fav.id);
    } catch (err) {
      console.log("Favori kontrol hatası", err);
    }
  };

  const toggleFavorite = async () => {
    try {
      if (favoriId) {
        await deleteFavorite(favoriId);
        setFavoriId(null);
        Alert.alert("Favori Kaldırıldı", "Ürün favorilerden çıkarıldı.");
      } else {
        const result = await addFavorite(parseInt(id));
        setFavoriId(result.favori.id);
        Alert.alert("Favori Eklendi", "Ürün favorilere eklendi.");
      }
    } catch (err) {
      Alert.alert("Hata", "Favori işlemi başarısız oldu.");
    }
  };

  const goToChat = async () => {
    try {
      const sohbetRes = await axios.get(`http://10.7.85.158:3000/api/sohbet`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const sohbet = sohbetRes.data.sohbetler.find(
        (s) => s.karsiTaraf.id === product.saticiId
      );

      navigation.navigate("ChatScreen", {
        urunId: product.id,
        sohbetId: sohbet?.id || null,
        karsiTarafAdi: product.satici?.kullaniciAdi,
        karsiTarafAvatar: product.satici?.avatar || null,
      });
    } catch (err) {
      console.log("Sohbet kontrol hatası:", err);
      Alert.alert("Hata", "Sohbet alınamadı.");
    }
  };

  useEffect(() => {
    fetchProduct();
    checkFavorite();
  }, [id]);

  useEffect(() => {
    if (product && product.saticiId && user && product.saticiId !== user.id) {
      fetchTalepDurumu();
    }
  }, [product]);

  if (loading || !product) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <>
      <ScrollView style={styles.container}>
        <View style={styles.imageContainer}>
          <TouchableOpacity onPress={() => setImageModalVisible(true)}>
            <Image
              source={{
                uri: `http://10.7.85.158:3000/uploads/${product.resim}`,
              }}
              style={styles.image}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.favoriteIcon}
            onPress={toggleFavorite}
          >
            <Ionicons
              name={favoriId ? "heart" : "heart-outline"}
              size={18}
              color="orange"
            />
          </TouchableOpacity>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{product.durum}</Text>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>{product.baslik}</Text>
          <Text style={styles.price}>{product.fiyat} ₺</Text>
          <Text style={styles.label}>Açıklama</Text>
          <View style={styles.descBox}>
            <Text style={styles.description}>{product.aciklama}</Text>
          </View>
          <View style={styles.sectionRow}>
            <Ionicons name="pricetag" size={18} color={colors.gray} />
            <Text style={styles.meta}>{product.kategori}</Text>
          </View>
          <View style={styles.sectionRow}>
            <Ionicons name="location-outline" size={18} color={colors.gray} />
            <Text style={styles.meta}>
              {product.konum.il}, {product.konum.ulke}
            </Text>
          </View>

          {user?.id !== product?.satici?.id && (
            <View style={{ flexDirection: "row", marginTop: 16, gap: 8 }}>
              {/* Teklif Ver */}
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: "#607D8B" }]}
                onPress={goToChat}
              >
                <Ionicons
                  name="chatbubble-ellipses-outline"
                  size={16}
                  color="white"
                />
                <Text style={styles.actionButtonText}>Teklif Ver</Text>
              </TouchableOpacity>

              {/* Satın Al */}
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  { backgroundColor: colors.primary },
                ]}
                onPress={async () => {
                  try {
                    await axios.post(
                      `http://10.7.85.158:3000/api/talep`,
                      {
                        urunId: product.id,
                        mesaj: "Satın almak istiyorum.",
                      },
                      { headers: { Authorization: `Bearer ${token}` } }
                    );
                    Alert.alert(
                      "Talebiniz Gönderildi",
                      "Satıcı onaylarsa ürün sizin olacak."
                    );
                    fetchTalepDurumu();
                  } catch (err) {
                    Alert.alert("Hata", "Satın alma talebi gönderilemedi.");
                  }
                }}
              >
                <Ionicons name="cart-outline" size={16} color="white" />
                <Text style={styles.actionButtonText}>Satın Al</Text>
              </TouchableOpacity>

              {/* Talebi İptal Et */}
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: "#f44336" }]}
                onPress={async () => {
                  try {
                    await axios.delete(
                      `http://10.7.85.158:3000/api/talep/${product.id}`,
                      {
                        headers: { Authorization: `Bearer ${token}` },
                      }
                    );
                    Alert.alert(
                      "Talep İptal Edildi",
                      "Satın alma talebiniz iptal edildi."
                    );
                    fetchTalepDurumu();
                  } catch (err) {
                    Alert.alert("Hata", "Talep iptal edilemedi.");
                  }
                }}
              >
                <Ionicons name="close-circle-outline" size={16} color="white" />
                <Text style={styles.actionButtonText}>Talebi İptal Et</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      <Modal visible={isImageModalVisible} transparent={true}>
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setImageModalVisible(false)}
          >
            <Ionicons name="close-circle" size={36} color="white" />
          </TouchableOpacity>
          <Image
            source={{
              uri: `http://10.7.85.158:3000/uploads/${product.resim}`,
            }}
            style={styles.fullImage}
            resizeMode="contain"
          />
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    width: "100%",
    height: 300,
  },
  favoriteIcon: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "white",
    padding: 6,
    borderRadius: 20,
    elevation: 3,
    zIndex: 2,
  },
  badge: {
    position: "absolute",
    top: 16,
    left: 16,
    backgroundColor: "orange",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    color: colors.primaryText,
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
  },
  descBox: {
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 10,
  },
  description: {
    fontSize: 14,
    color: colors.secondaryText,
  },
  sectionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  meta: {
    fontSize: 14,
    color: colors.dark,
    marginLeft: 6,
  },
  offerButton: {
    flex: 1,
    backgroundColor: colors.primary,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  offerText: {
    color: colors.white,
    fontWeight: "600",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.95)",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 2,
  },
  fullImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "black",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 6,
    flex: 1,
    justifyContent: "center",
  },

  actionButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 13,
  },
});
