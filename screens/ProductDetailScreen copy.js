// ProductDetailScreen.js
import React, { useRef, useEffect, useState, useContext } from "react";
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
import { Dimensions } from "react-native";
import { AuthContext } from "../store/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import {
  addFavorite,
  deleteFavorite,
  getFavorites,
} from "../services/favoriteApi";
import colors from "../constants/colors";
import { api_url } from "../constants/api_url";

const screenWidth = Dimensions.get("window").width;

export default function ProductDetailScreen({ navigation, route }) {
  const { user, token } = useContext(AuthContext);
  const { id } = route.params;
  const [isImageModalVisible, setImageModalVisible] = useState(false);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [favoriId, setFavoriId] = useState(null);
  const [talepDurumu, setTalepDurumu] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isManualScroll, setIsManualScroll] = useState(false);
  const scrollRef = useRef(null);

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`${api_url}/api/urun/${id}`);
      setProduct(res.data.urun);
    } catch (err) {
      Alert.alert("Hata", "Ürün detayları alınamadı.");
    } finally {
      setLoading(false);
    }
  };

  const fetchTalepDurumu = async () => {
    try {
      const res = await axios.get(`${api_url}/api/talep/durum/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
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
        Alert.alert(
          "💔 Favori Silindi",
          "Bu ürün artık favorilerinizde değil."
        );
      } else {
        const result = await addFavorite(parseInt(id));
        setFavoriId(result.favori.id);
        Alert.alert(
          "💖 Favoriye Eklendi",
          "Bu ürünü favoriler arasında saklıyoruz!"
        );
      }
    } catch (err) {
      Alert.alert("Hata", "Favori işlemi başarısız oldu.");
    }
  };

  const goToChat = async () => {
    try {
      const sohbetRes = await axios.get(`${api_url}/api/sohbet`, {
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
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        x: currentIndex * screenWidth,
        animated: true,
      });

      // Kaydırma tamamlandıktan sonra elle scroll kontrolünü kapat
      const timeout = setTimeout(() => setIsManualScroll(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex]);

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
          <ScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={(e) => {
              if (isManualScroll) return; // Scroll programatikse ignore et

              const offsetX = e.nativeEvent.contentOffset.x;
              const index = Math.round(offsetX / screenWidth);
              if (index !== currentIndex) setCurrentIndex(index);
            }}
            scrollEventThrottle={16}
          >
            {(product.resimler?.length > 0
              ? product.resimler
              : [product.resim]
            ).map((img, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  setCurrentIndex(index);
                  setImageModalVisible(true);
                }}
              >
                <Image
                  source={{ uri: `${api_url}/uploads/${img}` }}
                  style={{ width: screenWidth, height: 300 }}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Favori ikonu */}
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

          {/* Durum etiketi */}
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{product.durum}</Text>
          </View>

          {/* Sol-sağ oklar sadece çoklu görsellerde */}
          {product.resimler?.length > 1 && (
            <>
              {currentIndex > 0 && (
                <TouchableOpacity
                  style={styles.leftArrow}
                  onPress={() => {
                    setIsManualScroll(true);
                    setCurrentIndex(currentIndex - 1);
                  }}
                >
                  <Ionicons
                    name="chevron-back-circle"
                    size={36}
                    color="white"
                  />
                </TouchableOpacity>
              )}
              {currentIndex < product.resimler.length - 1 && (
                <TouchableOpacity
                  style={styles.rightArrow}
                  onPress={() => {
                    setIsManualScroll(true);
                    setCurrentIndex(currentIndex + 1);
                  }}
                >
                  <Ionicons
                    name="chevron-forward-circle"
                    size={36}
                    color="white"
                  />
                </TouchableOpacity>
              )}
            </>
          )}
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
          <View
            style={[
              styles.sectionRow,
              { alignItems: "flex-start", marginTop: 12 },
            ]}
          >
            <Ionicons name="location-outline" size={18} color={colors.gray} />
            <View style={{ flex: 1, marginLeft: 6 }}>
              <Text style={{ color: colors.primaryText, fontSize: 14 }}>
                {product.tamAdres?.split(" - ")[1]?.trim() ||
                  "Adres bulunamadı"}
              </Text>
              <Text
                style={{
                  color: colors.secondaryText,
                  fontSize: 13,
                  marginTop: 2,
                }}
              >
                {product.konum.ilce} / {product.konum.il} / {product.konum.ulke}
              </Text>
            </View>
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
                      `${api_url}/api/talep`,
                      {
                        urunId: product.id,
                        mesaj: "Satın almak istiyorum.",
                      },
                      { headers: { Authorization: `Bearer ${token}` } }
                    );

                    Alert.alert(
                      "📩 Talebiniz Gönderildi",
                      "Satıcı onaylarsa ürün sizin olacak! 🤝"
                    );

                    fetchTalepDurumu();
                  } catch (err) {
                    const sunucuMesaji = err?.response?.data?.mesaj;

                    if (sunucuMesaji?.includes("Zaten")) {
                      Alert.alert("Uyarı", "Bu ürüne zaten talep gönderdiniz.");
                    } else if (
                      sunucuMesaji?.includes("Kendi ürününü alamazsın")
                    ) {
                      Alert.alert(
                        "Uyarı",
                        "Kendi ürününüze talep gönderemezsiniz."
                      );
                    } else if (sunucuMesaji?.includes("Ürün zaten satıldı")) {
                      Alert.alert("Uyarı", "Bu ürün zaten satılmış.");
                    } else {
                      Alert.alert(
                        "Hata",
                        sunucuMesaji || "Satın alma talebi gönderilemedi."
                      );
                    }
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
                    await axios.delete(`${api_url}/api/talep/${product.id}`, {
                      headers: { Authorization: `Bearer ${token}` },
                    });
                    Alert.alert(
                      "Talep İptal Edildi",
                      "Satın alma talebiniz başarıyla iptal edildi. 🗑️"
                    );
                    fetchTalepDurumu();
                  } catch (err) {
                    let mesaj = "Bilinmeyen bir hata oluştu. 😕";

                    // Backend'den gelen mesaj varsa onu kullan
                    if (
                      err.response &&
                      err.response.data &&
                      err.response.data.mesaj
                    ) {
                      mesaj = err.response.data.mesaj + " 🤷‍♂️";
                    }

                    Alert.alert("Talep İptal Edilemedi", mesaj);
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

          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            contentOffset={{ x: selectedImageIndex * screenWidth, y: 0 }}
          >
            {(product.resimler?.length > 0
              ? product.resimler
              : [product.resim]
            ).map((img, idx) => (
              <Image
                key={idx}
                source={{ uri: `${api_url}/uploads/${img}` }}
                style={{ width: screenWidth, height: "100%" }}
                resizeMode="contain"
              />
            ))}
          </ScrollView>
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
    marginTop: 20,
  },
  actionButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 13,
  },
  leftArrow: {
    position: "absolute",
    top: "45%",
    left: 16,
    zIndex: 10,
  },

  rightArrow: {
    position: "absolute",
    top: "45%",
    right: 16,
    zIndex: 10,
  },
});
