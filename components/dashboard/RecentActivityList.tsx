import ExportIcons from "@/assets/icons/ExportIcons";
import ImportIcons from "@/assets/icons/ImportIcons";
import { resFont } from "@/utils/utils";
import React from "react";
import {
  Platform,
  SafeAreaView,
  SectionList,
  StyleSheet,
  Text,
  View,
} from "react-native";

const DATA = [
  {
    title: "YESTERDAY",
    data: [
      {
        id: "1",
        title: "You just made a contribution",
        time: "4:30 PM",
        amount: "+ $120",
      },
      {
        id: "2",
        title: "You just made a contribution",
        time: "4:30 PM",
        amount: "- $120",
      },
    ],
  },
  {
    title: "12 JUNE",
    data: [
      {
        id: "3",
        title: "You just made a contribution",
        time: "4:30 PM",
        amount: "+ $120",
      },
      {
        id: "4",
        title: "You just made a contribution",
        time: "4:30 PM",
        amount: "- $120",
      },
    ],
  },
  {
    title: "13 JUNE",
    data: [
      {
        id: "5",
        title: "You just made a contribution",
        time: "4:30 PM",
        amount: "+ $120",
      },
      {
        id: "6",
        title: "You just made a contribution",
        time: "4:30 PM",
        amount: "- $120",
      },
    ],
  },
];

export default function RecentActivityList() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.header}>Recent Activity</Text>
        <SectionList
          sections={DATA}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 32 }}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.sectionHeader}>{title}</Text>
          )}
          renderItem={({ item }) => {
            const isCredit = item.amount.includes("+");
            return (
              <View style={styles.item}>
                <View style={styles.left}>
                  <View
                    style={[
                      styles.iconContainer,
                      { backgroundColor: isCredit ? "#e0f9f1" : "#fde9e9" },
                    ]}
                  >
                    {isCredit ? <ImportIcons /> : <ExportIcons />}
                  </View>
                  <View style={{ marginLeft: 10 }}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.time}>{item.time}</Text>
                  </View>
                </View>
                <Text
                  style={[
                    styles.amount,
                    { color: isCredit ? "#00C281" : "#D01D1D" },
                  ]}
                >
                  {item.amount}
                </Text>
              </View>
            );
          }}
          stickySectionHeadersEnabled={false}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 20,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    ...Platform.select({
      android: { elevation: 2 },
      ios: { shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 4 },
    }),
  },
  header: {
    fontSize: resFont(13),
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 10,
    fontFamily: "OutfitMedium",
  },
  sectionHeader: {
    fontSize: resFont(10),
    fontFamily: "OutfitMedium",
    color: "#6B6B6B",
    marginTop: 12,
    marginBottom: 4,
    fontWeight: "500",
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: resFont(11),
    color: "#1A1A1A",
    fontFamily: "OutfitMedium",
  },
  time: {
    fontSize: resFont(11),
    color: "#999",
    marginTop: 2,
    fontFamily: "OutfitRegular",
  },
  amount: {
    fontSize: resFont(12),
    fontWeight: "bold",
    fontFamily: "OutfitMedium",
  },
});
