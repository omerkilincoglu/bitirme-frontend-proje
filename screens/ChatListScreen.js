// 📄 ChatListScreen.js
import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../store/AuthContext";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import EmptyState from "../components/EmptyState";
import colors from "../constants/colors";

export default function ChatListScreen({ navigation }) {
  const { token, user } = useContext(AuthContext);
  const [sohbetler, setSohbetler] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedChats, setSelectedChats] = useState([]);

  const fetchChats = async () => {
    try {
      const res = await axios.get("http://10.7.85.158:3000/api/sohbet", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSohbetler(res.data.sohbetler || []);
    } catch (err) {
      console.error("Sohbetler alınamadı:", err);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchChats();
    }, [])
  );

  useEffect(() => {
    navigation.setOptions({
      headerTitle: selectionMode
        ? `${selectedChats.length} seçildi`
        : "Sohbetlerim",
      headerLeft: () =>
        selectionMode ? (
          <TouchableOpacity
            onPress={cancelSelection}
            style={{ marginLeft: 12 }}
          >
            <Ionicons name="close" size={24} color="black" />
          </TouchableOpacity>
        ) : null,
      headerRight: () =>
        selectionMode ? (
          <TouchableOpacity
            onPress={deleteSelectedChats}
            style={{ marginRight: 12 }}
          >
            <Ionicons name="trash" size={24} color="red" />
          </TouchableOpacity>
        ) : null,
    });
  }, [navigation, selectionMode, selectedChats]);

  const toggleSelectChat = (id) => {
    setSelectedChats((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const cancelSelection = () => {
    setSelectionMode(false);
    setSelectedChats([]);
  };

  const deleteSelectedChats = async () => {
    Alert.alert("Sil", "Seçilen sohbetleri silmek istiyor musun?", [
      {
        text: "İptal",
        style: "cancel",
      },
      {
        text: "Sil",
        style: "destructive",
        onPress: async () => {
          try {
            await Promise.all(
              selectedChats.map((chatId) =>
                axios.delete(`http://10.7.85.158:3000/api/sohbet/${chatId}`, {
                  headers: { Authorization: `Bearer ${token}` },
                })
              )
            );
            cancelSelection();
            fetchChats();
          } catch (err) {
            Alert.alert("Hata", "Silme işlemi başarısız.");
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }) => {
    const karsiTaraf = item.karsiTaraf;
    const unread =
      item.sonMesaj &&
      !item.sonMesaj.okundu &&
      item.sonMesaj.gondericiId !== user.id;

    const isSelected = selectedChats.includes(item.id);

    return (
      <TouchableOpacity
        style={[
          styles.chatItem,
          isSelected && { borderColor: colors.primary, borderWidth: 2 },
        ]}
        onPress={() => {
          if (selectionMode) {
            toggleSelectChat(item.id);
          } else {
            navigation.navigate("ChatScreen", {
              sohbetId: item.id,
              urunId: item.urun.id,
              karsiTarafAdi: karsiTaraf.kullaniciAdi,
              karsiTarafAvatar: karsiTaraf.avatar || null,
            });
          }
        }}
        onLongPress={() => {
          if (!selectionMode) {
            setSelectionMode(true);
            setSelectedChats([item.id]);
          }
        }}
      >
        <View style={styles.row}>
          <Ionicons
            name="person-circle-outline"
            size={42}
            color={colors.primary}
            style={{ marginRight: 12 }}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.username}>{karsiTaraf.kullaniciAdi}</Text>
            <Text style={styles.title}>{item.urun.baslik}</Text>
            {item.okunmamis > 0 && (
              <Text style={styles.lastMessage}>🟠 Yeni mesaj</Text>
            )}
          </View>

          <View style={styles.timeBadgeWrapper}>
            <Text style={styles.timeText}>
              {item.sonMesaj?.zaman?.slice(11, 16)}
            </Text>
            {item.okunmamis > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.badgeText}>{item.okunmamis}</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return sohbetler.length === 0 ? (
    <EmptyState
      icon="chatbubble-ellipses-outline"
      title="Henüz Mesajlaşma Yok"
      message="Mesajlaştığınız kullanıcılar burada görüntülenecek."
    />
  ) : (
    <FlatList
      data={sohbetler}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.container}
      style={{ backgroundColor: colors.background }} // ✅ bu satırı ekle
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: colors.background,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  chatItem: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    elevation: 2,
    position: "relative",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  username: {
    fontWeight: "bold",
    fontSize: 16,
    color: colors.primaryText,
  },
  title: {
    fontSize: 14,
    color: colors.secondaryText,
    marginTop: 2,
  },
  lastMessage: {
    fontSize: 13,
    color: colors.primary,
    marginTop: 4,
  },
  timeBadgeWrapper: {
    alignItems: "flex-end",
  },
  timeText: {
    fontSize: 11,
    color: colors.gray,
    marginBottom: 4,
  },
  unreadBadge: {
    backgroundColor: "#FFA500",
    borderRadius: 12,
    minWidth: 22,
    paddingHorizontal: 6,
    paddingVertical: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
});
