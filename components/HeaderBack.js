import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Alert,
  StatusBar,
} from 'react-native';
import { AuthContext } from '../store/AuthContext';


export default function LoginScreen({ navigation }) {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const authCtx = useContext(AuthContext);

  async function handleLogin() {
    if (!usernameOrEmail || !password) {
      Alert.alert('Uyarı', 'Lütfen tüm alanları doldurun.');
      return;
    }

    const result = await authCtx.login(usernameOrEmail, password);
    if (result.error) {
      Alert.alert('Giriş Hatası', result.message || 'Sunucu hatası');
    } else {
      Alert.alert('Başarılı', 'Giriş başarılı!');
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF6EC" />
      <Text style={styles.title}>Giriş Yap</Text>
      <TextInput
        style={styles.input}
        placeholder="Kullanıcı Adı / E-posta"
        value={usernameOrEmail}
        onChangeText={setUsernameOrEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Şifre"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Pressable style={styles.primaryButton} onPress={handleLogin}>
        <Text style={styles.buttonText}>Giriş Yap</Text>
      </Pressable>
      <Pressable onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.link}>Hesabın yok mu? Kayıt Ol</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF6EC',
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  primaryButton: {
    backgroundColor: '#EA6721',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  link: {
    color: '#2D2D2D',
    textAlign: 'center',
    marginTop: 8,
  },
});
