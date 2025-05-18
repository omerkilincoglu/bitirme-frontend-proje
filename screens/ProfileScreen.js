import React, { useContext, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../store/AuthContext";
import colors from "../constants/colors";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const LANGUAGES = [
  { code: "tr", flag: "🇹🇷" },
  { code: "en", flag: "🇬🇧" },
  { code: "ar", flag: "🇸🇦" },
];

export default function ProfileScreen() {
  const { user, setUser, logout } = useContext(AuthContext);
  const navigation = useNavigation();
  const [selectedLang, setSelectedLang] = useState("tr");
  const [showLangs, setShowLangs] = useState(false);

  const MenuItem = ({ icon, label, color = colors.primaryText, onPress }) => (
    <TouchableOpacity style={styles.itemBox} onPress={onPress}>
      <View style={styles.iconLabelRow}>
        <Ionicons
          name={icon}
          size={20}
          color={color}
          style={{ marginRight: 12 }}
        />
        <Text style={[styles.itemText, { color }]}>{label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.gray} />
    </TouchableOpacity>
  );

  // Kullanıcıyı yeniden çek (güncellemeden sonra)
  useFocusEffect(
    useCallback(() => {
      const fetchUser = async () => {
        try {
          const token = await AsyncStorage.getItem("token");

          const res = await axios.get(
            "http://10.7.85.158:3000/api/kullanici/profil",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setUser(res.data.kullanici);
        } catch (err) {
          console.log(
            "Kullanıcı güncellenemedi:",
            err.response?.data || err.message
          );
        }
      };
      fetchUser();
    }, [])
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backRow}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.dark} />
            <Text style={styles.headerTitle}>Hesabım</Text>
          </TouchableOpacity>

          <View style={styles.languageContainer}>
            {showLangs ? (
              LANGUAGES.map((lang) => (
                <TouchableOpacity
                  key={lang.code}
                  style={[
                    styles.langFlag,
                    lang.code === selectedLang && styles.selectedLang,
                  ]}
                  onPress={() => {
                    setSelectedLang(lang.code);
                    setShowLangs(false);
                  }}
                >
                  <Text style={styles.langText}>{lang.flag}</Text>
                </TouchableOpacity>
              ))
            ) : (
              <TouchableOpacity onPress={() => setShowLangs(true)}>
                <Text style={styles.langText}>
                  {LANGUAGES.find((l) => l.code === selectedLang)?.flag}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.avatarContainer}>
          <Ionicons name="person" size={40} color="white" />
        </View>
        <Text style={styles.username}>{user?.kullaniciAdi}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.menuList}>
        <MenuItem
          icon="person-circle-outline"
          label="Bilgilerim"
          onPress={() => navigation.navigate("ProfileDetail")}
        />
        <MenuItem
          icon="person-outline"
          label="Kullanıcı Adı Değiştir"
          onPress={() => navigation.navigate("UpdateUsername")}
        />
        <MenuItem
          icon="lock-closed-outline"
          label="Şifre Değiştir"
          onPress={() => navigation.navigate("UpdatePassword")}
        />
        <MenuItem
          icon="mail-outline"
          label="E-posta Değiştir"
          onPress={() => navigation.navigate("UpdateEmail")}
        />
        <MenuItem
          icon="log-out-outline"
          label="Çıkış Yap"
          color="red"
          onPress={logout}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.lightGray,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.primaryText,
    marginLeft: -16, // biraz sola kaydırmak için
  },
  avatarContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 16,
    marginBottom: 8,
  },
  username: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    color: colors.primaryText,
  },
  menuList: { padding: 16 },
  itemBox: {
    backgroundColor: colors.white,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 1,
  },
  iconLabelRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemText: {
    fontSize: 16,
    fontWeight: "500",
  },
  languageContainer: {
    flexDirection: "column",
    alignItems: "center",
  },
  langFlag: {
    backgroundColor: "#fff",
    padding: 4,
    borderRadius: 6,
    elevation: 2,
    marginVertical: 2,
  },
  selectedLang: {
    borderWidth: 2,
    borderColor: colors.primary,
  },
  langText: {
    fontSize: 20,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  backRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.primaryText,
    marginLeft: 12,
  },
});
