// screens/SplashScreen.js
import React from "react";
import { View, Image, StyleSheet, StatusBar, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <Image
        source={require("../assets/logo.png")}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E46420",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: width * 1.1,
    height: height * 1.9,
  },
});
