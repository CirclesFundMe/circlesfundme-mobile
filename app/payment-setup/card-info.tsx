/* eslint-disable import/no-unresolved */
 
import Button from "@/components/ui/Buttton";
import Input from "@/components/ui/Input";
import SelectInput from "@/components/ui/SelectInput";
import { Colors } from "@/constants/Colors";
import handleFetch from "@/services/api/handleFetch";
import { resHeight } from "@/utils/utils";
import { AntDesign } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Bank {
  bankName: string;
}

interface BanksResponse {
  data: Bank[];
}

export default function CardInfoScreen() {
  const { data: banksData } = useQuery({
    queryKey: ["banks"],
    queryFn: () => handleFetch({ endpoint: "financials/banks", auth: true }),
  });

  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [holderName, setHolderName] = useState("");
  const [bank, setBank] = useState("");

  const bankOptions: string[] =
    (banksData as BanksResponse)?.data?.map((bank: Bank) => bank.bankName) ||
    [];

  const selectedBankCode = banksData?.data?.find(
    (item: { bankName: string; bankCode: string }) =>
      item.bankName.toLowerCase().includes(bank.toLowerCase())
  )?.bankCode;

  return (
    <View style={[styles.container, { marginTop: insets.top || 40 }]}>
      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Card</Text>
      </View>

      <Input
        label="Card Information"
        placeholder="0000 0000 0000 0000"
        value={cardNumber}
        onChangeText={setCardNumber}
      />
      <View style={{ flexDirection: "row", gap: 10 }}>
        <Input
          label="Expiration date"
          placeholder="MM/YY"
          value={expiry}
          onChangeText={setExpiry}
          containerStyle={{ flex: 1 }}
        />
        <Input
          label="Security code"
          placeholder="CVV"
          value={cvv}
          onChangeText={setCvv}
          containerStyle={{ flex: 1 }}
        />
      </View>
      <Input
        label="Cardholder name"
        placeholder="Full name on card"
        value={holderName}
        onChangeText={setHolderName}
      />
      <SelectInput
        label="Select Bank"
        value={bank}
        onSelect={setBank}
        placeholder="Select Bank"
        options={bankOptions}
        hasSearch
      />
      <View style={{ marginBottom: resHeight(10) }} />
      <Button
        title="Add"
        onPress={() => router.push("/payment-setup/withdraw-setup")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
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
