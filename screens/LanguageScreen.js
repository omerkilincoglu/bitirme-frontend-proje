import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../constants/colors";

export default function LanguageScreen() {
  const [selectedLang, setSelectedLang] = useState("tr");

  const handleSelect = (lang) => {
    setSelectedLang(lang);
    console.log("Dil seçildi:", lang);
    Alert.alert("Dil", `${lang.toUpperCase()} seçildi (şimdilik demo).`);
  };

  const LanguageOption = ({ label, value, flag }) => (
    <TouchableOpacity
      style={[
        styles.optionBox,
        selectedLang === value && styles.optionSelected,
      ]}
      onPress={() => handleSelect(value)}
    >
      <Text style={styles.flag}>{flag}</Text>
      <Text
        style={[
          styles.optionText,
          selectedLang === value && { color: colors.primaryText },
        ]}
      >
        {label}
      </Text>
      {selectedLang === value && (
        <Ionicons
          name="checkmark"
          size={18}
          color={colors.primary}
          style={{ marginLeft: "auto" }}
        />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dil Seçimi</Text>

      <LanguageOption label="Türkçe" value="tr" flag="🇹🇷" />
      <LanguageOption label="İngilizce" value="en" flag="🇬🇧" />
      <LanguageOption label="Arapça" value="ar" flag="🇸🇦" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.primaryText,
    marginBottom: 24,
  },
  optionBox: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: "#f8f8f8",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#eee",
  },
  optionSelected: {
    backgroundColor: "#fff8e1",
    borderColor: colors.primary,
  },
  optionText: {
    fontSize: 16,
    color: colors.gray,
    fontWeight: "500",
    marginLeft: 12,
  },
  flag: {
    fontSize: 20,
  },
});
