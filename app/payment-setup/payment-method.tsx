import Button from "@/components/ui/Buttton";
import ProgressStepsBar from "@/components/ui/ProgressStepsBar";
import { Colors } from "@/constants/Colors";
import { resFont, resHeight } from "@/utils/utils";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const options = [
  { label: "Card", icon: "credit-card-outline" },
  { label: "Bank Transfer", icon: "bank-transfer" },
  { label: "Mobile Money", icon: "cellphone" },
] as const;

export default function PaymentMethodScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState("Card");

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { marginTop: insets.top || 40 },
      ]}
    >
      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Payment method</Text>
      </View>

      <ProgressStepsBar currentStep={1} totalSteps={2} />
      <Text style={styles.title}>Funding</Text>
      {options.map((opt) => (
        <TouchableOpacity
          key={opt.label}
          onPress={() => setSelected(opt.label)}
          style={[
            styles.option,
            selected === opt.label && styles.selectedOption,
          ]}
        >
          <MaterialCommunityIcons name={opt.icon} size={20} />
          <Text style={styles.optionText}>{opt.label}</Text>
          {selected === opt.label && (
            <View style={styles.radioOuter}>
              <View style={styles.radioInner} />
            </View>
          )}
        </TouchableOpacity>
      ))}
      <View style={{ marginVertical: resHeight(5) }} />
      <Button
        title="Continue"
        onPress={() => router.push("/payment-setup/card-info")}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: {
    fontSize: resFont(22),
    fontWeight: "bold",
    marginVertical: 20,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    padding: resHeight(2),
    backgroundColor: "#F6F6F6",
    borderRadius: resHeight(6),
    marginBottom: resHeight(2),
  },
  optionText: {
    marginLeft: 10,
    fontSize: resFont(14),
    flex: 1,
  },
  selectedOption: {
    borderColor: Colors.dark.primary,
    borderWidth: 1,
  },
  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: Colors.dark.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  radioInner: {
    width: 8,
    height: 8,
    backgroundColor: Colors.dark.tint,
    borderRadius: 4,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    position: "relative",
    marginBottom: resHeight(3),
  },
  backButton: {
    position: "absolute",
    left: 0,
    backgroundColor: Colors.dark.text,
    borderRadius: 20,
    width: 40,
    height: 40,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    zIndex: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
});
