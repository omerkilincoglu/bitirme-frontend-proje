// App.js
import React from "react";
import { StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context"; 
import AuthProvider from "./store/AuthContext";
import RootNavigation from "./navigation/RootNavigation";
import colors from "./constants/colors";

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar
          backgroundColor={colors.background}
          barStyle="dark-content"
        />
        <RootNavigation />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
