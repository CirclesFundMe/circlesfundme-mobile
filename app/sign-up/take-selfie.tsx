import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

import ProgressStepsBar from "@/components/ui/ProgressStepsBar";
import { Colors } from "@/constants/Colors";
import { resFont, resHeight } from "@/utils/utils";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Button from "../../components/ui/Buttton";

export default function TakeASelfie() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    fullName,
    phone,
    dob,
    gender,
    documentUri,
    documentName,
    documentType,
    userAddress,
    utilityBillUri,
    utilityBillName,
    utilityBillType,
    bvn,
  } = useLocalSearchParams<{
    fullName: string;
    phone: string;
    dob: string;
    gender: string;
    documentUri: string;
    documentName: string;
    documentType: string;
    userAddress: string;
    utilityBillUri: string;
    utilityBillName: string;
    utilityBillType: string;
    bvn: string;
  }>();

  const handleTakeSelfie = () => {
    router.push({
      pathname: "/sign-up/take-a-selfie-camera",
      params: {
        fullName,
        phone,
        dob,
        gender,
        bvn,
        documentUri,
        documentName,
        documentType,
        userAddress,
        utilityBillUri,
        utilityBillName,
        utilityBillType,
      },
    });
  };
  const handleSkipped = () => {
    router.push({
      pathname: "/sign-up/contribution-scheme",
      params: {
        fullName,
        phone,
        dob,
        gender,
      },
    });
  };

  return (
    <View style={[styles.container, { marginTop: insets.top || 40 }]}>
      <ProgressStepsBar currentStep={4} />
      <Text style={styles.title}>Take a Selfie</Text>
      <Text style={styles.subtitle}>
        Enhance your security and speed up future verifications.
      </Text>
      <View
        style={{
          alignItems: "center",
        }}
      >
        <View style={styles.iconContainer}>
          <Image
            source={require("../../assets/images/onboarding/face-id.png")}
            style={styles.image}
          />
        </View>
      </View>
      <Text style={styles.instruction}>
        Ensure you are in a well-lit environment{"\n"}
        looking directly at the camera
      </Text>
      <View style={{ marginBottom: resHeight(7) }} />
      <Button title="Take Selfie" onPress={handleTakeSelfie} />
      <View style={{ marginBottom: resHeight(3) }} />
      <Button
        title="Skip for Now"
        onPress={handleSkipped}
        style={{ backgroundColor: "transparent", paddingVertical: 0 }}
        textStyle={{ color: Colors.dark.primary, fontSize: resFont(12) }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    alignItems: "center",
  },
  title: {
    fontSize: resFont(30),
    fontWeight: "500",
    marginTop: resHeight(4),
    fontFamily: "OutfitMedium",
  },
  subtitle: {
    fontSize: resFont(12),
    marginTop: 10,
    marginBottom: resHeight(4),
    color: Colors.dark.textLight,
    fontFamily: "OutfitRegular",
  },
  iconContainer: {
    marginVertical: resHeight(10),
    alignItems: "center",
    height: resHeight(20),
    backgroundColor: "#EEEEEE",
    width: resHeight(20),
    borderRadius: resHeight(10),
    justifyContent: "center",
  },
  instruction: {
    fontSize: resFont(14),
    color: Colors.dark.background,
    textAlign: "center",
    lineHeight: 24,
    fontWeight: "400",
    fontFamily: "OutfitRegular",
  },
  image: { height: 80, resizeMode: "contain" },
});
