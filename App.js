// App.js
import React from "react";
import { StatusBar } from "react-native";
import AuthProvider from "./store/AuthContext";
import RootNavigation from "./navigation/RootNavigation";
import colors from "./constants/colors";

export default function App() {
  return (
    <AuthProvider>
      <StatusBar backgroundColor={colors.background} barStyle="dark-content" />
      <RootNavigation />
    </AuthProvider>
  );
}
