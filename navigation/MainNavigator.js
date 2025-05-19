// navigation/MainNavigator.js
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";

import HomeScreen from "../screens/HomeScreen";
import FavoritesScreen from "../screens/FavoritesScreen";
import AddProductScreen from "../screens/AddProductScreen";
import CartScreen from "../screens/CartScreen";
import ProfileScreen from "../screens/ProfileScreen";
import ProductDetailScreen from "../screens/ProductDetailScreen";
import DeleteProductScreen from "../screens/DeleteProductScreen";
import FilterScreen from "../screens/FilterScreen";
import FilterResultScreen from "../screens/FilterResultScreen";
import EditProductScreen from "../screens/EditProductScreen";
import UpdateEmailScreen from "../screens/UpdateEmailScreen";
import UpdatePasswordScreen from "../screens/UpdatePasswordScreen";
import UpdateUsernameScreen from "../screens/UpdateUsernameScreen";
import DeleteAccountScreen from "../screens/DeleteAccountScreen";
import LanguageScreen from "../screens/LanguageScreen";
import ProfileDetailScreen from "../screens/ProfileDetailScreen";
import RequestsScreen from "../screens/RequestsScreen";
import CancelSaleScreen from "../screens/CancelSaleScreen";
import ChatListScreen from "../screens/ChatListScreen";
import ChatScreen from "../screens/ChatScreen";
import NotificationsScreen from "../screens/NotificationsScreen";
import colors from "../constants/colors";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function CustomAddButton({ onPress }) {
  return (
    <TouchableOpacity style={styles.addButtonContainer} onPress={onPress}>
      <View style={styles.addButton}>
        <Ionicons name="add" size={28} color="white" />
      </View>
      <Text style={styles.addLabel}>İlan Ekle</Text>
    </TouchableOpacity>
  );
}

function Tabs({ navigation }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarShowLabel: true,
        tabBarLabelStyle: { fontSize: 13, fontWeight: "bold" },
        tabBarStyle: {
          backgroundColor: colors.white,
          height: 70,
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          position: "absolute",
          paddingBottom: 6,
        },
        tabBarActiveTintColor: colors.primaryText,
        tabBarInactiveTintColor: colors.gray,
        tabBarIcon: ({ color, focused }) => {
          let iconName;
          if (route.name === "Home") iconName = "home-outline";
          else if (route.name === "Favorites") iconName = "heart-outline";
          else if (route.name === "Cart") iconName = "cart-outline";
          else if (route.name === "Profile") iconName = "person-outline";

          return iconName ? (
            <Ionicons
              name={iconName}
              size={24}
              color={focused ? colors.primaryText : colors.gray}
            />
          ) : null;
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "Ana Sayfa", headerShown: false }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          title: "Favorilerim",
          headerTitleAlign: "left",
          headerTitleStyle: { fontSize: 16, fontWeight: "bold" },
          headerShown: true, // ✅ başlığı göster
        }}
      />

      <Tab.Screen
        name="AddButton"
        component={HomeScreen} // dummy
        options={{
          tabBarButton: () => (
            <CustomAddButton
              onPress={() => navigation.navigate("AddProduct")}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{ title: "Sepetim", headerShown: false }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: "Hesabım", headerShown: false }}
      />
    </Tab.Navigator>
  );
}

export default function MainNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Tabs"
        component={Tabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{ title: "Ürün Detayı" }}
      />

      <Stack.Screen
        name="Filter"
        component={FilterScreen}
        options={{
          title: "Filtrele",
          headerBackTitleVisible: false,
          headerTitleAlign: "left",
          headerTitleStyle: { fontSize: 16, fontWeight: "500" },
          headerStyle: {
            height: 42,
            backgroundColor: "#fff",
            shadowColor: "transparent",
            elevation: 0,
          },
        }}
      />
      <Stack.Screen
        name="FilterResult"
        component={FilterResultScreen}
        options={{
          title: "Filtre Sonuçları",
          headerTitleAlign: "left",
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name="AddProduct"
        component={AddProductScreen}
        options={{
          title: "İlan Ekle",
          presentation: "modal",
          headerBackTitleVisible: false,
          headerTitleAlign: "left",
          headerTitleStyle: { fontSize: 16, fontWeight: "500" },
          headerStyle: {
            height: 36,
            backgroundColor: "#fff",
            shadowColor: "transparent",
            elevation: 0,
          },
        }}
      />
      <Stack.Screen
        name="EditProduct"
        component={EditProductScreen}
        options={{
          title: "Ürünü Güncelle",
          presentation: "modal",
          headerBackTitleVisible: false,
          headerTitleAlign: "center",
          headerTitleStyle: { fontSize: 16, fontWeight: "500" },
          headerStyle: {
            height: 36,
            backgroundColor: "#fff",
            shadowColor: "transparent",
            elevation: 0,
          },
        }}
      />

      <Stack.Screen
        name="RequestsScreen"
        component={RequestsScreen}
        options={{
          title: "Gelen Talepler",
          headerTitleAlign: "left", // Ortadan sola
          headerTitleStyle: { fontSize: 16, fontWeight: "bold" },
        }}
      />

      <Stack.Screen
        name="DeleteProduct"
        component={DeleteProductScreen}
        options={{ title: "Ürünü Sil" }}
      />
      <Stack.Screen
        name="UpdateEmail"
        component={UpdateEmailScreen}
        options={{ title: "E-posta Güncelle" }}
      />
      <Stack.Screen
        name="UpdatePassword"
        component={UpdatePasswordScreen}
        options={{ title: "Şifre Değiştir" }}
      />
      <Stack.Screen
        name="UpdateUsername"
        component={UpdateUsernameScreen}
        options={{ title: "Kullanıcı Adı Güncelle" }}
      />
      <Stack.Screen
        name="Language"
        component={LanguageScreen}
        options={{ title: "Dil Seçimi" }}
      />
      <Stack.Screen
        name="ProfileDetail"
        component={ProfileDetailScreen}
        options={{ title: "Kullanıcı Bilgileri" }}
      />
      <Stack.Screen
        name="DeleteAccount"
        component={DeleteAccountScreen}
        options={{ title: "Hesabımı Kapat" }}
      />

      <Stack.Screen
        name="CancelSale"
        component={CancelSaleScreen}
        options={{ title: "Satışı İptal Et" }}
      />

      <Stack.Screen
        name="ChatListScreen"
        component={ChatListScreen}
        options={{ title: "Sohbetlerim" }}
      />

      <Stack.Screen
        name="ChatScreen"
        component={ChatScreen}
        options={({ route }) => ({
          headerShown: true,
          headerTitle: () => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons
                name="person-circle-outline"
                size={36}
                color={colors.primary} // dışarıdaki avatar rengiyle aynı
                style={{ marginRight: 8 }}
              />
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                {route.params?.karsiTarafAdi || "Sohbet"}
              </Text>
            </View>
          ),
        })}
      />
      <Stack.Screen
        name="NotificationsScreen"
        component={NotificationsScreen}
        options={{ title: "Bildirimler" }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  addButtonContainer: {
    top: -18,
    justifyContent: "center",
    alignItems: "center",
  },
  addButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#FF8C00",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  addLabel: {
    marginTop: 2,
    fontSize: 13,
    fontWeight: "bold",
    color: colors.primaryText,
    textAlign: "center",
    opacity: 0.4,
  },
  editButton: {
    backgroundColor: "orange",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
  },
  editButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
