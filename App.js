// App.js
import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "react-native";
import AuthProvider, { AuthContext } from "./store/AuthContext";
import AuthNavigator from "./navigation/AuthNavigator";
import MainNavigator from "./navigation/MainNavigator";
import { navigationRef } from "./navigation/RootNavigation";
import colors from "./constants/colors";

function RootNavigation() {
  const { token, isLoading } = useContext(AuthContext);

  if (isLoading) return null;

  return (
    <NavigationContainer ref={navigationRef}>
      {token ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <StatusBar backgroundColor={colors.background} barStyle="dark-content" />
      <RootNavigation />
    </AuthProvider>
  );
}
