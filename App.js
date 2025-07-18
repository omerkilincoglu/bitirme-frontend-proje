// App.js
import React from "react";
import { StatusBar } from "react-native";
<<<<<<< HEAD
import { SafeAreaProvider } from "react-native-safe-area-context"; 
=======
>>>>>>> f4c47392e4a2687f55dcc9ef902610ef1a3bdc01
import AuthProvider from "./store/AuthContext";
import RootNavigation from "./navigation/RootNavigation";
import colors from "./constants/colors";

export default function App() {
  return (
<<<<<<< HEAD
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar
          backgroundColor={colors.background}
          barStyle="dark-content"
        />
        <RootNavigation />
      </AuthProvider>
    </SafeAreaProvider>
=======
    <AuthProvider>
      <StatusBar backgroundColor={colors.background} barStyle="dark-content" />
      <RootNavigation />
    </AuthProvider>
>>>>>>> f4c47392e4a2687f55dcc9ef902610ef1a3bdc01
  );
}
