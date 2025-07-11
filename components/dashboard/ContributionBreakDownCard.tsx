import { Colors } from "@/constants/Colors";
import { resFont, resHeight } from "@/utils/utils";
import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";

export default function ContributionsCard() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Contributions made</Text>
      <View style={styles.divider} />
      <View style={styles.row}>
        <Text style={styles.label}>Subscription amount</Text>
        <Text style={styles.value}>₦ 12,000</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Installments</Text>
        <Text style={styles.value}>5 of 12</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    marginTop:resHeight(2),
    ...Platform.select({
      android: { elevation: 2 },
      ios: { shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 4 },
    }),
  },
  header: {
    fontSize: resFont(14),
    fontWeight: "600",
    color: Colors.dark.background,
    marginBottom: resHeight(1.5),
    fontFamily: "OutfitMedium",
  },
  divider: {
    height: 1,
    backgroundColor: '#CCCCCC',
    marginBottom: resHeight(1.5),
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: resHeight(1),
  },
  label: {
    fontSize: resFont(13),
    color: "#999",
    fontFamily: "OutfitRegular", 
  },
  value: {
    fontSize: resFont(13),
    color: "#1A1A1A",
    fontWeight: "700",
    fontFamily: "OutfitMedium", 
  },
});
