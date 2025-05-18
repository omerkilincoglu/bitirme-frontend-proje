// EditProductScreen.js
import React, { useEffect, useState } from "react";
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
  TouchableOpacity,
  Platform,
  ScrollView as HorizontalScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { useRoute, useNavigation } from "@react-navigation/native";
import axios from "axios";
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
  "Diğer",
];

export default function EditProductScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params;

  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [imageError, setImageError] = useState("");
  const [image, setImage] = useState(null);
  const [baslik, setBaslik] = useState("");
  const [aciklama, setAciklama] = useState("");
  const [fiyat, setFiyat] = useState("");
  const [kategori, setKategori] = useState("");
  const [ozelKategori, setOzelKategori] = useState("");
  const [durum, setDurum] = useState("");
  const [il, setIl] = useState("");
  const [ilce, setIlce] = useState("");
  const [ulke, setUlke] = useState("");

  const [showDurumModal, setShowDurumModal] = useState(false);
  const [showKategoriModal, setShowKategoriModal] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://10.7.85.158:3000/api/urun/${id}`);
        const urun = res.data.urun;
        setBaslik(urun.baslik);
        setAciklama(urun.aciklama);
        setFiyat(String(urun.fiyat));
        setKategori(urun.kategori);
        setDurum(urun.durum);
        setIl(urun.konum.il);
        setIlce(urun.konum.ilce);
        setUlke(urun.konum.ulke);
        setImage(`http://10.7.85.158:3000/uploads/${urun.resim}`);
      } catch (err) {
        Alert.alert("Hata", "Ürün bilgisi getirilemedi.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Galeri izni gerekli", "Lütfen izin verin");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsEditing: false,
    });

    if (!result.canceled && result.assets?.length > 0) {
      const selected = result.assets[0];
      try {
        const fileInfo = await FileSystem.getInfoAsync(selected.uri);
        if (!fileInfo.exists || !fileInfo.size) {
          setImage(null);
          Alert.alert("❌ Hata", "Dosya boyutu kontrol edilemedi.");
          return;
        }

        if (fileInfo.size > 5 * 1024 * 1024) {
          setImage(null);
          Alert.alert("❌ Hata", "Fotoğraf 5MB'dan büyük olamaz.");
          return;
        }

        setImage(selected.uri);
      } catch (err) {
        setImage(null);
        Alert.alert("❌ Hata", "Dosya kontrolünde hata oluştu.");
      }
    }
  };

  const handleUpdate = async () => {
    setImageError("");
    if (
      !baslik ||
      !aciklama ||
      !fiyat ||
      !kategori ||
      !durum ||
      !il ||
      !ilce ||
      !ulke
    ) {
      setShowError(true);
      Alert.alert("Eksik bilgi", "Tüm alanlar zorunludur");
      return;
    }

    if (imageError.startsWith("❌")) {
      Alert.alert("Hata", "Geçerli bir fotoğraf yükleyin.");
      return;
    }

    setShowError(false);
    setUpdating(true);
    try {
      const token = await AsyncStorage.getItem("token");
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

      if (image && !image.includes("http")) {
        const filename = image.split("/").pop();
        const filetype = filename.split(".").pop();
        formData.append("resim", {
          uri: Platform.OS === "android" ? image : image.replace("file://", ""),
          name: filename,
          type: `image/${filetype}`,
        });
      }

      await axios.put(`http://10.7.85.158:3000/api/urun/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      Alert.alert("Başarılı", "Ürün güncellendi ✅");
      navigation.goBack();
    } catch (err) {
      Alert.alert("Hata", err.response?.data?.mesaj || "Güncelleme başarısız");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* ✅ Zorunlu alan uyarısı */}
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
          {image ? (
            <View style={styles.photoBox}>
              <Image source={{ uri: image }} style={styles.photo} />
              <Pressable
                style={styles.photoRemove}
                onPress={() => setImage(null)}
              >
                <Ionicons name="close-circle" size={20} color="red" />
              </Pressable>
            </View>
          ) : (
            <Pressable style={styles.addBox} onPress={pickImage}>
              <Ionicons name="camera" size={24} color={colors.gray} />
              <Text style={styles.addText}>Fotoğraf Ekle</Text>
            </Pressable>
          )}
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
      <TextInput
        style={styles.input}
        placeholder="Ürün Adı"
        value={baslik}
        onChangeText={setBaslik}
      />
      <TextInput
        style={[styles.input, styles.multiline]}
        placeholder="Ürün Açıklaması"
        multiline
        numberOfLines={3}
        value={aciklama}
        onChangeText={setAciklama}
      />
      <TextInput
        style={styles.input}
        placeholder="Fiyat (\u00f6r. 4999,99)"
        keyboardType="decimal-pad"
        value={fiyat}
        onChangeText={setFiyat}
      />

      <Pressable
        style={styles.durumSelector}
        onPress={() => setShowKategoriModal(true)}
      >
        <Text style={styles.durumLabel}>Kategori</Text>
        <Text style={styles.durumValue}>{kategori || "Seç"}</Text>
        <Ionicons name="chevron-down" size={18} color={colors.gray} />
      </Pressable>
      {kategori === "Diğer" && (
        <TextInput
          style={styles.input}
          placeholder="Kategori girin"
          value={ozelKategori}
          onChangeText={setOzelKategori}
        />
      )}

      <Pressable
        style={styles.durumSelector}
        onPress={() => setShowDurumModal(true)}
      >
        <Text style={styles.durumLabel}>Durum</Text>
        <Text style={styles.durumValue}>
          {durum
            ? durum === "azkullanılmış"
              ? "Az Kullanılmış"
              : "Yeni"
            : "Seç"}
        </Text>
        <Ionicons name="chevron-down" size={18} color={colors.gray} />
      </Pressable>

      <TextInput
        style={styles.input}
        placeholder="İl"
        value={il}
        onChangeText={setIl}
      />
      <TextInput
        style={styles.input}
        placeholder="İlçe"
        value={ilce}
        onChangeText={setIlce}
      />
      <TextInput
        style={styles.input}
        placeholder="Ülke"
        value={ulke}
        onChangeText={setUlke}
      />

      <Pressable
        style={[styles.button, updating && { backgroundColor: "gray" }]}
        onPress={handleUpdate}
        disabled={updating}
      >
        {updating ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Güncelle</Text>
        )}
      </Pressable>

      {/* MODALLAR */}
      <Modal visible={showKategoriModal} transparent animationType="fade">
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowKategoriModal(false)}
        >
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
        </Pressable>
      </Modal>

      <Modal visible={showDurumModal} transparent animationType="fade">
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowDurumModal(false)}
        >
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
                <Text style={{ color: durum === item ? "white" : colors.dark }}>
                  {item === "azkullanılmış" ? "Az Kullanılmış" : "Yeni"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
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
  durumSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.gray,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
  },
  durumLabel: {
    flex: 1,
    fontSize: 16,
    color: colors.dark,
  },
  durumValue: {
    flex: 2,
    fontSize: 16,
    textAlign: "right",
    paddingRight: 10,
  },
  input: {
    backgroundColor: colors.white,
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    fontSize: 16,
    borderColor: colors.gray,
    borderWidth: 1,
  },
  multiline: {
    height: 90,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#4CAF50", // açık yeşil ton
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
  imageSizeInfo: {
    fontSize: 12,
    color: "#888",
    fontStyle: "italic",
    textAlign: "right",
  },
});
