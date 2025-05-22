// AddProductScreen.js
import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { addProduct } from "../services/productApi";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ScrollView,
  Alert,
  Image,
  ActivityIndicator,
  Modal,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Platform,
  Keyboard,
  ScrollView as HorizontalScrollView,
} from "react-native";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import colors from "../constants/colors";

const KATEGORILER = [
  "Ev Eşyaları",
  "Elektronik",
  "Giyim",
  "Ayakkabı",
  "Çanta",
  "Kozmetik",
  "Mobilya",
  "Aksesuar",
  "Kitap",
  "Spor",
  "Oyuncak",
  "Saat",
  "Masa",
  "Diğer",
];

export default function AddProductScreen() {
  const [images, setImages] = useState([]); // çoklu resim
  const [baslik, setBaslik] = useState("");
  const [aciklama, setAciklama] = useState("");
  const [fiyat, setFiyat] = useState("");
  const [kategori, setKategori] = useState("");
  const [ozelKategori, setOzelKategori] = useState("");
  const [durum, setDurum] = useState("");
  const [showDurumModal, setShowDurumModal] = useState(false);
  const [showKategoriModal, setShowKategoriModal] = useState(false);
  const [il, setIl] = useState("");
  const [ilce, setIlce] = useState("");
  const [ulke, setUlke] = useState("");
  const [loading, setLoading] = useState(false);
  const [detayliKonum, setDetayliKonum] = useState("");
  const [showError, setShowError] = useState(false);
  const [imageError, setImageError] = useState("");

  const pickImages = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Galeri izni gerekli", "Lütfen izin verin");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true, // ✅ Çoklu seçim
      selectionLimit: 6, // ✅ Maksimum 6
      quality: 0.7,
      allowsEditing: false,
    });

    if (!result.canceled && result.assets?.length > 0) {
      const validImages = [];

      for (const asset of result.assets) {
        try {
          const fileInfo = await FileSystem.getInfoAsync(asset.uri);
          if (!fileInfo.exists || !fileInfo.size) {
            Alert.alert("❌ Hata", "Dosya kontrol edilemedi.");
            continue;
          }

          if (fileInfo.size > 5 * 1024 * 1024) {
            Alert.alert("❌ Hata", "Fotoğraf 5MB'dan büyük olamaz.");
            continue;
          }

          validImages.push(asset.uri);
        } catch {
          Alert.alert("❌ Hata", "Dosya kontrolünde hata oluştu.");
        }
      }

      if (validImages.length === 0) {
        Alert.alert("❌ Hata", "Geçerli fotoğraf seçilemedi.");
        return;
      }

      // ✅ Toplam sayıyı kontrol et ve slice ile sınırla
      setImages((prev) => [...prev, ...validImages].slice(0, 6)); // ❗️ 6 foto ile sınırla
    }
  };

  const handleSubmit = async () => {
    if (
      !baslik ||
      !aciklama ||
      !fiyat ||
      !kategori ||
      (kategori === "Diğer" && !ozelKategori) ||
      !il ||
      !ilce ||
      !ulke ||
      images.length === 0 ||
      images.length > 6 || // ✅ YENİ KONTROL
      !durum ||
      !detayliKonum
    ) {
      setShowError(true);
      Alert.alert(
        "Eksik veya Hatalı Bilgi",
        images.length > 6
          ? "En fazla 6 fotoğraf yükleyebilirsiniz."
          : "Tüm alanlar ve en az 1 fotoğraf zorunludur."
      );
      return;
    }

    setShowError(false);
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Oturum Hatası", "Lütfen tekrar giriş yapın.");
        return;
      }

      const formData = new FormData();
      formData.append("baslik", baslik);
      formData.append("aciklama", aciklama);
      formData.append("fiyat", fiyat);
      formData.append(
        "kategori",
        kategori === "Diğer" ? ozelKategori : kategori
      );
      formData.append("durum", durum);
      formData.append("konum", JSON.stringify({ il, ilce, ulke }));
      formData.append("detayliKonum", detayliKonum);

      // ✅ Çoklu fotoğrafları ekle
      images.forEach((uri) => {
        const filename = uri.split("/").pop();
        const type = `image/${filename.split(".").pop()}`;

        formData.append("resimler", {
          uri: Platform.OS === "android" ? uri : uri.replace("file://", ""),
          name: filename,
          type,
        });
      });

      // Sunucuya gönder
      const result = await addProduct(formData, token);
      if (!result.error) {
        Alert.alert("Başarılı", "Ürün başarıyla eklendi ✅");
        // Formu sıfırla
        setImages([]);
        setBaslik("");
        setAciklama("");
        setFiyat("");
        setKategori("");
        setOzelKategori("");
        setDurum("");
        setIl("");
        setIlce("");
        setUlke("");
        setDetayliKonum("");
      } else {
        Alert.alert("Hata", result.message || "Ürün eklenemedi");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {showError && (
        <Text style={{ color: "red", marginBottom: 10 }}>
          * Tüm alanlar zorunludur
        </Text>
      )}

      {/* FOTOĞRAF */}
      <View style={{ flexDirection: "column", marginBottom: 10 }}>
        <HorizontalScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.photoRow}
        >
          {images.map((imgUri, index) => (
            <View key={index} style={styles.photoBox}>
              <Image source={{ uri: imgUri }} style={styles.photo} />
              <Pressable
                style={styles.photoRemove}
                onPress={() => setImages(images.filter((_, i) => i !== index))}
              >
                <Ionicons name="close-circle" size={20} color="red" />
              </Pressable>
            </View>
          ))}
          <Pressable style={styles.addBox} onPress={pickImages}>
            <Ionicons name="camera" size={24} color={colors.gray} />
            <Text style={styles.addText}>Fotoğraf Ekle</Text>
          </Pressable>
        </HorizontalScrollView>

        {imageError && (
          <Text
            style={{
              color: imageError.includes("❌") ? "red" : "green",
              fontSize: 13,
              marginTop: 6,
            }}
          >
            {imageError}
          </Text>
        )}
      </View>

      {/* FORM */}
      <View style={{ marginBottom: 12 }}>
        <Text style={styles.inlineLabel}>
          Ürün Adı <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="iPhone 13"
          value={baslik}
          onChangeText={setBaslik}
        />
      </View>

      <View style={{ marginBottom: 12 }}>
        <Text style={styles.inlineLabel}>
          Ürün Açıklaması <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, styles.multiline]}
          placeholder="Temiz kullanılmış, garantili"
          multiline
          numberOfLines={3}
          value={aciklama}
          onChangeText={setAciklama}
        />
      </View>

      <View style={{ marginBottom: 12 }}>
        <Text style={styles.inlineLabel}>
          Fiyat <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="199.99"
          keyboardType="decimal-pad"
          value={fiyat}
          onChangeText={setFiyat}
        />
      </View>

      <View style={{ marginBottom: 12 }}>
        <Text style={styles.inlineLabel}>
          Kategori <Text style={styles.required}>*</Text>
        </Text>
        <Pressable
          style={styles.durumSelector}
          onPress={() => setShowKategoriModal(true)}
        >
          <Text style={styles.durumValue}>{kategori || "Seç"}</Text>
          <Ionicons name="chevron-down" size={18} color={colors.gray} />
        </Pressable>
      </View>

      {kategori === "Diğer" && (
        <View style={{ marginBottom: 12 }}>
          <Text style={styles.inlineLabel}>Özel Kategori</Text>
          <TextInput
            style={styles.input}
            placeholder="Kategori girin"
            value={ozelKategori}
            onChangeText={setOzelKategori}
          />
        </View>
      )}

      <View style={{ marginBottom: 12 }}>
        <Text style={styles.inlineLabel}>
          Durum <Text style={styles.required}>*</Text>
        </Text>
        <Pressable
          style={styles.durumSelector}
          onPress={() => setShowDurumModal(true)}
        >
          <Text style={styles.durumValue}>
            {durum === "azkullanılmış"
              ? "Az Kullanılmış"
              : durum === "yeni"
              ? "Yeni"
              : "Seç"}
          </Text>
          <Ionicons name="chevron-down" size={18} color={colors.gray} />
        </Pressable>
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.inlineLabel}>
          İlçe <Text style={styles.required}>*</Text>
        </Text>
        <TextInput style={styles.input} value={ilce} onChangeText={setIlce} />
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.inlineLabel}>
          İl <Text style={styles.required}>*</Text>
        </Text>
        <TextInput style={styles.input} value={il} onChangeText={setIl} />
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.inlineLabel}>
          Ülke <Text style={styles.required}>*</Text>
        </Text>
        <TextInput style={styles.input} value={ulke} onChangeText={setUlke} />
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.inlineLabel}>
          Detaylı Konum <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Cadde, sokak, no, daire"
          value={detayliKonum}
          onChangeText={setDetayliKonum}
        />
      </View>

      {/* GÖNDER BUTONU */}
      <Pressable
        style={styles.button}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>Ürünü Ekle</Text>
        )}
      </Pressable>

      {/* MODALLAR */}
      <Modal visible={showKategoriModal} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={() => setShowKategoriModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              {KATEGORILER.map((item) => (
                <TouchableOpacity
                  key={item}
                  onPress={() => {
                    setKategori(item);
                    setShowKategoriModal(false);
                  }}
                  style={[
                    styles.modalOption,
                    kategori === item && styles.modalOptionSelected,
                  ]}
                >
                  <Text
                    style={{ color: kategori === item ? "white" : colors.dark }}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <Modal visible={showDurumModal} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={() => setShowDurumModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              {["azkullanılmış", "yeni"].map((item) => (
                <TouchableOpacity
                  key={item}
                  onPress={() => {
                    setDurum(item);
                    setShowDurumModal(false);
                  }}
                  style={[
                    styles.modalOption,
                    durum === item && styles.modalOptionSelected,
                  ]}
                >
                  <Text
                    style={{ color: durum === item ? "white" : colors.dark }}
                  >
                    {item === "azkullanılmış" ? "Az Kullanılmış" : "Yeni"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: colors.background,
  },
  photoRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  photoBox: {
    width: 80,
    height: 80,
    borderRadius: 10,
    overflow: "hidden",
    marginRight: 10,
    position: "relative",
  },
  photo: {
    width: "100%",
    height: "100%",
  },
  photoRemove: {
    position: "absolute",
    top: 2,
    right: 2,
    backgroundColor: "white",
    borderRadius: 10,
  },
  addBox: {
    width: 80,
    height: 80,
    borderRadius: 10,
    borderColor: colors.gray,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  addText: {
    fontSize: 12,
    color: colors.gray,
    marginTop: 4,
  },

  // 📌 Etiket ve Alanlar
  fieldContainer: {
    marginBottom: 10,
  },
  inlineLabel: {
    fontSize: 15,
    fontWeight: "500",
    color: "#333",
    marginBottom: 4,
    paddingLeft: 6,
  },
  required: {
    color: "red",
  },

  input: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    fontSize: 15,
  },
  multiline: {
    height: 90,
    textAlignVertical: "top",
  },

  // 🔽 Seçiciler (Kategori / Durum)
  durumSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gray,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  durumValue: {
    fontSize: 15,
    flex: 1,
    textAlign: "right",
    paddingRight: 8,
  },

  // 🔘 Modal stilleri
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  modalBox: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 12,
    width: "70%",
  },
  modalOption: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  modalOptionSelected: {
    backgroundColor: colors.primary,
  },

  // 📷 Fotoğraf gösterimi
  imageBox: {
    alignItems: "center",
    justifyContent: "center",
    height: 180,
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
    overflow: "hidden",
  },
  placeholderBox: {
    alignItems: "center",
    justifyContent: "center",
  },
  imageText: {
    color: colors.gray,
    fontSize: 16,
    marginTop: 8,
  },
  imagePreview: {
    width: "100%",
    height: "100%",
  },
  removeIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "white",
    borderRadius: 20,
  },

  // 🔘 Butonlar
  button: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  // ⚠️ Hatalar ve bilgi metinleri
  errorText: {
    color: "red",
    fontWeight: "bold",
    marginBottom: 10,
    fontSize: 13,
    paddingHorizontal: 4,
  },
  imageHint: {
    marginLeft: 10,
    color: colors.gray,
    fontSize: 12,
  },
  imageSizeInfo: {
    fontSize: 12,
    color: "#888",
    fontStyle: "italic",
    textAlign: "right",
  },
});
