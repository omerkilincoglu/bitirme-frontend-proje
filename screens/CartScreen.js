// CartScreen.js
import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { getMyPurchases, getMySales } from "../services/cartApi";
import { getActiveListings } from "../services/productApi";
import { AuthContext } from "../store/AuthContext";
import colors from "../constants/colors";
import EmptyState from "../components/EmptyState";
import { api_url } from "../constants/api_url";

export default function CartScreen() {
  const { token } = useContext(AuthContext);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState("purchases");
  const [purchases, setPurchases] = useState([]);
  const [sales, setSales] = useState([]);
  const [activeListings, setActiveListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          setLoading(true);
          if (activeTab === "purchases") {
            const data = await getMyPurchases(token);
            setPurchases(data);
          } else if (activeTab === "sales") {
            const data = await getMySales(token);
            setSales(data);
          } else if (activeTab === "active") {
            const data = await getActiveListings(token);
            setActiveListings(data);
          }
        } catch (err) {
          console.error("Veri çekme hatası:", err);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }, [activeTab, token])
  );

  // Sattıklarım ve Aldıklarım için renderItem
  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("ProductDetail", { id: item.urun?.id })
      }
    >
      <View style={styles.item}>
        <View style={styles.row}>
          <Image
            source={{
              uri: `${api_url}/uploads/${item.urun?.resim}`,
            }}
            style={styles.imageThumb}
          />

          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.itemTitle}>{item.urun?.baslik}</Text>
            <Text style={styles.itemPrice}>{item.urun?.fiyat} ₺</Text>
            <Text style={styles.itemStatus}>Durum: Satıldı</Text>
            <Text style={styles.itemStatus}>
              Alıcı: {item.alici?.kullaniciAdi}
            </Text>
          </View>

          {/* 👉 BUTON SADECE SATTIKLARIMDA GÖRÜNSÜN */}
          {activeTab === "sales" && (
            <View style={{ justifyContent: "center", alignItems: "flex-end" }}>
              <TouchableOpacity
                style={[styles.operationButton, { backgroundColor: "#f44336" }]}
                onPress={() =>
                  navigation.navigate("CancelSale", { id: item.urun?.id })
                }
              >
                <Ionicons name="close-circle-outline" size={14} color="white" />
                <Text style={styles.operationText}> Satışı İptal</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderActiveItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("ProductDetail", { id: item.id })}
    >
      <View style={styles.item}>
        <View style={styles.row}>
          <Image
            source={{ uri: `${api_url}/uploads/${item.resim}` }}
            style={styles.imageThumb}
          />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.itemTitle}>{item.baslik}</Text>
            <Text style={styles.itemPrice}>{item.fiyat} ₺</Text>
            <Text style={styles.itemStatus}>Durum: Aktif</Text>
          </View>
          <View style={{ justifyContent: "center" }}>
            <TouchableOpacity
              style={[styles.operationButton, { backgroundColor: "#4CAF50" }]}
              onPress={() =>
                navigation.navigate("EditProduct", { id: item.id })
              }
            >
              <Ionicons name="create-outline" size={14} color="white" />
              <Text style={styles.operationText}> Güncelle</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.operationButton, { backgroundColor: "#f44336" }]}
              onPress={() =>
                navigation.navigate("DeleteProduct", { id: item.id })
              }
            >
              <Ionicons name="trash-outline" size={14} color="white" />
              <Text style={styles.operationText}> Sil</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.operationButton, { backgroundColor: "#FF9800" }]}
              onPress={() =>
                navigation.navigate("RequestsScreen", { id: item.id })
              }
            >
              <Ionicons name="document-text-outline" size={14} color="white" />
              <Text style={styles.operationText}> Talepler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <View style={styles.tabBar}>
        <TouchableOpacity
          onPress={() => setActiveTab("purchases")}
          style={[
            styles.tabButton,
            activeTab === "purchases" && styles.activeTabButton,
          ]}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "purchases" && styles.activeTabText,
            ]}
          >
            Aldıklarım
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab("sales")}
          style={[
            styles.tabButton,
            activeTab === "sales" && styles.activeTabButton,
          ]}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "sales" && styles.activeTabText,
            ]}
          >
            Sattıklarım
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab("active")}
          style={[
            styles.tabButton,
            activeTab === "active" && styles.activeTabButton,
          ]}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "active" && styles.activeTabText,
            ]}
          >
            Satışta Olanlar
          </Text>
        </TouchableOpacity>
      </View>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : activeTab === "purchases" && purchases.length === 0 ? (
        <EmptyState
          icon="cart-outline"
          title="Henüz Ürün Almadınız"
          message="Satın aldığınız ürünler burada görüntülenecek."
        />
      ) : activeTab === "sales" && sales.length === 0 ? (
        <EmptyState
          icon="pricetag-outline"
          title="Henüz Ürün Satmadınız"
          message="Satış yaptığınız ürünler burada görüntülenecek."
        />
      ) : activeTab === "active" && activeListings.length === 0 ? (
        <EmptyState
          icon="cube-outline"
          title="Aktif Ürün Yok"
          message="Şu an satışta olan ürününüz bulunmamaktadır."
        />
      ) : (
        <FlatList
          data={
            activeTab === "purchases"
              ? purchases
              : activeTab === "sales"
              ? sales
              : activeListings
          }
          renderItem={activeTab === "active" ? renderActiveItem : renderItem}
          keyExtractor={(item, index) =>
            `${activeTab === "active" ? item.id : item.urun?.id}-${index}`
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF3E9",
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#FF8C00",
    paddingVertical: 6,
    marginTop: 10,
    width: "100%",
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: 2,
    borderColor: "transparent",
  },
  activeTabButton: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 16,
    color: colors.secondaryText,
  },
  activeTabText: {
    color: colors.primaryText,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  item: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  imageThumb: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: "#eee",
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.primaryText,
  },
  itemPrice: {
    fontSize: 14,
    color: colors.secondaryText,
    marginTop: 4,
  },
  itemStatus: {
    fontSize: 13,
    color: colors.dark,
    marginTop: 2,
  },
  operationButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginBottom: 4,
  },
  operationText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
});
