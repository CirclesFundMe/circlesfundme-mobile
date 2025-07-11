// screens/loan/LoanHistoryScreen.tsx
import React from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

import LoanHistoryCard from "@/components/history/LoanHistoryCard";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { resFont, resHeight } from "@/utils/utils";

export default function LoanHistoryScreen() {
  const insets = useSafeAreaInsets();

  const history = [
    {
      amount: "1,380,000",
      dateRange: "30/6/25 - 30/6/2027",
      status: "Completed",
      progress: 1,
    },
    {
      amount: "1,380,000",
      dateRange: "30/6/25 - 30/6/2027",
      status: "Completed",
      progress: 1,
    },
    {
      amount: "1,380,000",
      dateRange: "30/6/25 - 30/6/2027",
      status: "Completed",
      progress: 1,
    },
    {
      amount: "1,380,000",
      dateRange: "30/6/25 - 30/6/2027",
      status: "Incompleted",
      progress: 0,
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: insets.top || 40 }}>
      <View style={styles.container}>
        <Text style={styles.title}>Loan History</Text>
        <ScrollView showsVerticalScrollIndicator={false}>
          {history.map((item, index) => (
            <LoanHistoryCard
              key={index}
              amount={item.amount}
              dateRange={item.dateRange}
              status={item.status}
              progress={item.progress}
            />
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: resFont(22),
    fontFamily: "OutfitBold",
    marginBottom: resHeight(2),
  },
});
