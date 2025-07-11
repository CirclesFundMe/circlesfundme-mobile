// components/dashboard/LoanHistoryCard.tsx
import { Colors } from "@/constants/Colors";
import { resFont } from "@/utils/utils";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { ProgressBar } from "react-native-paper";

interface LoanHistoryCardProps {
  amount: string;
  dateRange: string;
  status: string;
  progress: number;
}

const LoanHistoryCard: React.FC<LoanHistoryCardProps> = ({
  amount,
  dateRange,
  status,
  progress,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.label}>Amount Repaid</Text>
          <Text style={styles.amount}>₦{amount}</Text>
        </View>
        <Text style={styles.date}>{dateRange}</Text>
      </View>

      <View style={styles.progressRow}>
        <Text style={styles.status}>{status}</Text>
        <Text style={styles.percent}>100%</Text>
      </View>

      <ProgressBar
        progress={progress}
        color={Colors.dark.primary}
        style={styles.progressBar}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    color: "#888",
    fontSize: resFont(11),
    fontFamily: "OutfitRegular",
  },
  amount: {
    fontFamily: "OutfitMedium",
    fontSize: resFont(16),
    marginTop: 4,
  },
  date: {
    fontSize: resFont(11),
    color: "#888",
  },
  progressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    marginBottom: 6,
  },
  status: {
    color: Colors.dark.primary,
    fontSize: resFont(12),
    fontWeight: "600",
    fontFamily: "OutfitMedium",
  },
  percent: {
    fontSize: resFont(12),
    fontFamily: "OutfitMedium",
  },
  progressBar: {
    height: 6,
    borderRadius: 4,
    backgroundColor: "#eee",
  },
});

export default LoanHistoryCard;
