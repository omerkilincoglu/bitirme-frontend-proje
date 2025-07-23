import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Alert,
  StatusBar,
  Platform, // 👁 Göz ikonunun padding'i için lazım
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // 👁 Göz ikonu
import { AuthContext } from "../store/AuthContext";
import colors from "../constants/colors";

export default function SignupScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 👁 Toggle state

  const authCtx = useContext(AuthContext);

  async function handleSignup() {
    if (!username || !email || !password) {
      Alert.alert("Uyarı", "Lütfen tüm alanları doldurun.");
      return;
    }

    const result = await authCtx.signup(username, email, password);
    if (result.error) {
      Alert.alert("Kayıt Hatası", result.message);
    } else {
      Alert.alert("Başarılı", "Kayıt başarılı! Giriş yapabilirsiniz.");
      navigation.navigate("Login");
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <Text style={styles.title}>Kayıt Ol</Text>

      <TextInput
        style={styles.input}
        placeholder="Kullanıcı Adı"
        placeholderTextColor="#888888"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="E-posta"
        placeholderTextColor="#888888"
        value={email}
        onChangeText={setEmail}
      />

      {/* 👁 Şifre giriş alanı göz ikonu ile */}
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Şifre"
          placeholderTextColor="#888888"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <Pressable onPress={() => setShowPassword((prev) => !prev)}>
          <Ionicons
            name={showPassword ? "eye-off" : "eye"}
            size={20}
            color={colors.gray}
          />
        </Pressable>
      </View>

      <Pressable style={styles.primaryButton} onPress={handleSignup}>
        <Text style={styles.buttonText}>Kayıt Ol</Text>
      </Pressable>

      <Pressable onPress={() => navigation.navigate("Login")}>
        <Text style={styles.link}>Zaten hesabın var mı? Giriş Yap</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 24,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.primaryText,
    textAlign: "center",
    marginBottom: 24,
  },
  input: {
    backgroundColor: colors.white,
    padding: 14,
    borderRadius: 10,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.gray,
    color: 'black'
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.gray,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === "ios" ? 14 : 0,
    marginBottom: 16,
    
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 14,
    color: 'black'
  },
  primaryButton: {
    backgroundColor: colors.dark,
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 16,
  },
  buttonText: {
    color: colors.white,
    fontWeight: "600",
    fontSize: 16,
  },
  link: {
    color: colors.primary,
    textAlign: "center",
    marginTop: 8,
  },
});
