import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import colors from "../constants/colors";

const kategoriler = [
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
  "Masa",
  "Saat",
];

export default function FilterScreen({ navigation }) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [minFiyat, setMinFiyat] = useState("");
  const [maxFiyat, setMaxFiyat] = useState("");
  const [durum, setDurum] = useState(null);

  useFocusEffect(
    useCallback(() => {
      setSearch("");
      setSelectedCategory(null);
      setMinFiyat("");
      setMaxFiyat("");
      setDurum(null);
    }, [])
  );

  const applyFilters = () => {
    navigation.navigate("FilterResult", {
      arama: search,
      kategori: selectedCategory,
      minFiyat,
      maxFiyat,
      durum,
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Ürün Ara</Text>
      <TextInput
        style={styles.input}
        placeholder="Ürün adı, kategori ..."
        value={search}
        onChangeText={setSearch}
      />

      <Text style={styles.label}>Kategori</Text>
      <View style={styles.categoryList}>
        {kategoriler.map((kategori) => (
          <Pressable
            key={kategori}
            onPress={() => setSelectedCategory(kategori)}
            style={[
              styles.categoryButton,
              selectedCategory === kategori && styles.selectedButton,
            ]}
          >
            <Text
              style={
                selectedCategory === kategori
                  ? styles.selectedText
                  : styles.buttonText
              }
            >
              {kategori}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.label}>Fiyat Aralığı (₺)</Text>
      <View style={styles.priceRow}>
        <TextInput
          style={styles.priceInput}
          placeholder="En az"
          keyboardType="numeric"
          value={minFiyat}
          onChangeText={setMinFiyat}
        />
        <Text style={{ marginHorizontal: 10 }}>-</Text>
        <TextInput
          style={styles.priceInput}
          placeholder="En çok"
          keyboardType="numeric"
          value={maxFiyat}
          onChangeText={setMaxFiyat}
        />
      </View>

      <Text style={styles.label}>Durum</Text>
      <View style={styles.categoryList}>
        {["yeni", "azkullanılmış"].map((d) => (
          <Pressable
            key={d}
            onPress={() => setDurum(d)}
            style={[
              styles.categoryButton,
              durum === d && styles.selectedButton,
            ]}
          >
            <Text style={durum === d ? styles.selectedText : styles.buttonText}>
              {d === "yeni" ? "Yeni" : "Az Kullanılmış"}
            </Text>
          </Pressable>
        ))}
      </View>

      <Pressable style={styles.submitButton} onPress={applyFilters}>
        <Ionicons
          name="funnel"
          size={18}
          color="#fff"
          style={{ marginRight: 6 }}
        />
        <Text style={styles.submitText}>Filtreleri Uygula</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: colors.background,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginVertical: 8,
    color: colors.primaryText,
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 12,
    borderColor: colors.gray,
    borderWidth: 1,
    marginBottom: 12,
    fontSize: 15,
  },
  categoryList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  categoryButton: {
    backgroundColor: "#eee",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  selectedButton: {
    backgroundColor: colors.primary,
  },
  buttonText: {
    color: colors.dark,
  },
  selectedText: {
    color: "white",
    fontWeight: "bold",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  priceInput: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 12,
    borderRadius: 10,
    borderColor: colors.gray,
    borderWidth: 1,
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    padding: 14,
    borderRadius: 10,
    marginTop: 10,
  },
  submitText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
