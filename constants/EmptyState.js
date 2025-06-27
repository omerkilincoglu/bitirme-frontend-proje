import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../constants/colors";

export default function EmptyState({
  icon = "alert-circle-outline",
  title,
  message,
}) {
  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={64} color={colors.primary} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.primaryText,
    marginTop: 16,
  },
  message: {
    color: colors.secondaryText,
    textAlign: "center",
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
  },
});
