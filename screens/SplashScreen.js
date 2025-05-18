// SplashScreen.js
import React, { useEffect, useContext } from 'react';
import { View, Image, StyleSheet, StatusBar, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../store/AuthContext';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const navigation = useNavigation();
  const { token } = useContext(AuthContext);

  useEffect(() => {
  const timer = setTimeout(() => {
    navigation.replace('Welcome'); // Her zaman Welcome’a yönlendir
  }, 3000);
  return () => clearTimeout(timer);
}, []);


  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <Image
        source={require('../assets/logo.png')}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E46420',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: width * 1.1,
    height: height * 1.9,
  },
});
