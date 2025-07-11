import Button from "@/components/ui/Buttton";
import Input from "@/components/ui/Input";
import { Colors } from "@/constants/Colors";
import { resHeight } from "@/utils/utils";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function CardInfoScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [holderName, setHolderName] = useState("");

  const handleSubmit = () => {
    router.push("/profile/verify-otp");
  };

  return (
    <View style={[styles.container, { marginTop: insets.top || 40 }]}>
      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Card Settings</Text>
      </View>
      <Input
        label="Card Name"
        placeholder="Full name on card"
        value={holderName}
        onChangeText={setHolderName}
      />
      <Input
        label="Card Number"
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
          label="CVV"
          placeholder="CVV"
          value={cvv}
          secureTextEntry
          onChangeText={setCvv}
          containerStyle={{ flex: 1 }}
        />
        <Input
          label="PIN"
          placeholder="PIN"
          secureTextEntry
          value={cvv}
          onChangeText={setCvv}
          containerStyle={{ flex: 1 }}
        />
      </View>

      <View style={{ marginBottom: resHeight(10) }} />
      <Button
        title="Save"
        onPress={() => handleSubmit()}
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
    fontFamily: "OutfitMedium",
    color: "#000",
  },
});
