// AuthContext.js

import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  login as apiLogin,
  signup as apiSignup,
  getProfile,
} from "../services/api";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        if (storedToken) {
          const result = await getProfile(storedToken);
          if (!result.error) {
            setToken(storedToken);
            setUser(result.user);
          } else {
            await AsyncStorage.removeItem("token");
            setToken(null); // ❗️ burada kritik
            setUser(null);
          }
        } else {
          setToken(null); // ❗️ token yoksa yine de açıkça sıfırla
        }
      } catch (e) {
        setToken(null); // ❗️ hata olursa yine sıfırla
      } finally {
        setIsLoading(false);
      }
    };

    bootstrapAsync();
  }, []);

  //Giris
  const login = async (usernameOrEmail, password) => {
    const result = await apiLogin(usernameOrEmail, password);
    if (!result.error) {
      await AsyncStorage.setItem("token", result.token);
      setToken(result.token);
      setUser(result.user);

      await saveUserToHistory(result.user); // ✅ Giris bilgileri saklamak icin
    }
    return result;
  };

  //Kayıt
  const signup = async (username, email, password) => {
    const result = await apiSignup(username, email, password);
    return result;
  };

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    
    <AuthContext.Provider
      value={{ user, setUser, token, login, signup, logout, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}
