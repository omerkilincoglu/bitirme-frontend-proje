// navigation/RootNavigation.js
import React, { useState, useEffect, useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import SplashScreen from "../screens/SplashScreen";
import AuthNavigator from "./AuthNavigator";
import MainNavigator from "./MainNavigator";
import { AuthContext } from "../store/AuthContext";

const Stack = createNativeStackNavigator();

export default function RootNavigation() {
  const { token, isLoading } = useContext(AuthContext);
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      const timeout = setTimeout(() => {
        setIsAppReady(true);
      }, 2500);
      return () => clearTimeout(timeout);
    }
  }, [isLoading]);

  if (isLoading || !isAppReady) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {token ? (
          <Stack.Screen name="Main" component={MainNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
