/* eslint-disable import/no-unresolved */
import {
  AntDesign,
  FontAwesome5,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import ProfileOptionCard from "@/components/profile/ProfileOptionCard";
import Button from "@/components/ui/Buttton";
import { Colors } from "@/constants/Colors";
import { PROFILE_IMG } from "@/constants/Image";
import handleFetch from "@/services/api/handleFetch";
import { resFont, resHeight } from "@/utils/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";

export default function ProfileScreen() {
  const queryClient = useQueryClient();
  const userData = queryClient.getQueryData(["users-me"]) as {
    data?: {
      firstName: string;
      lastName: string;
      email: string;
      profilePictureUrl?: string;
      onboardingStatus?: string;
    };
  };
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [logOut, setLogOutOpen] = useState<"logout" | null>(null);

  const sendOtpMutation = useMutation({
    mutationFn: () =>
      handleFetch({
        endpoint: "accounts/send-onboarding-otp",
        method: "POST",
        body: { email: userData?.data?.email },
      }),
    onSuccess: (res: any) => {
      if (res?.statusCode !== "200" && res?.status !== 200) {
        Toast.show({
          type: "error",
          text1: "OTP Failed",
          text2: res?.message || "Please try again later",
        });
        return;
      }
      Toast.show({
        type: "success",
        text1: "OTP Sent",
        text2: "Follow the instructions sent to your email",
      });
      router.push("/profile/update-password-setting");
    },
    onError: (error: any) => {
      Toast.show({
        type: "error",
        text1: "Something went wrong",
        text2: error?.message || "Please try again later",
      });
    },
  });

  const handleLogout = () => {
    setLogOutOpen(null);
    router.push("/sign-in/login");
  };

  const renderLogOutModal = () => {
    switch (logOut) {
      case "logout":
        return (
          <Modal transparent visible>
            <View style={styles.modalOverlay}>
              <View style={styles.modalCard}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setLogOutOpen(null)}
                >
                  <AntDesign name="closecircleo" size={12} color="black" />
                </TouchableOpacity>
                <AntDesign
                  name="questioncircleo"
                  size={100}
                  color={"#004C42"}
                />
                <Text style={styles.modalTitle}>
                  Are you sure you want to log out ?
                </Text>

                <View style={styles.buttonContainer}>
                  <Button title="Cancel" onPress={() => setLogOutOpen(null)} />
                  <Button
                    title="Yes, Log Out"
                    style={{ backgroundColor: "#C60808" }}
                    onPress={() => handleLogout()}
                  />
                </View>
              </View>
            </View>
          </Modal>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { paddingTop: insets.top || 40 }]}>
      <View style={styles.container}>
        <Text style={styles.title}>Profile</Text>
        <ScrollView
          contentContainerStyle={styles.scroolContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.avatarContainer}>
            <Image
              source={{
                uri: userData?.data?.profilePictureUrl || PROFILE_IMG,
              }}
              style={styles.avatar}
            />
            <Text style={styles.name}>
              {userData?.data
                ? `${userData.data.firstName} ${userData.data.lastName}`
                : "Guest User"}
            </Text>
          </View>

          <ProfileOptionCard
            title="Profile Settings"
            subTitle={
              userData?.data?.onboardingStatus === "Completed"
                ? ""
                : "INCOMPLETE"
            }
            onPress={() => router.push("/profile/profile-setting")}
            icon={<Ionicons name="person-outline" size={20} color="#00C281" />}
          />
          <ProfileOptionCard
            title="Update Password"
            onPress={() => {
              sendOtpMutation.mutate();
            }}
            icon={
              <Ionicons name="lock-closed-outline" size={20} color="#00C281" />
            }
          />
          <ProfileOptionCard
            title="Card Settings"
            onPress={() => router.push("/profile/card-setting")}
            icon={
              <MaterialIcons name="credit-card" size={20} color="#00C281" />
            }
          />
          <ProfileOptionCard
            title="Payment Settings"
            onPress={() => router.push("/profile/payment-setting")}
            icon={<FontAwesome5 name="wallet" size={18} color="#00C281" />}
          />
          <ProfileOptionCard
            title="Notifications"
            onPress={() => router.push("/profile/notification")}
            icon={
              <Ionicons
                name="notifications-outline"
                size={20}
                color="#00C281"
              />
            }
          />
          <ProfileOptionCard
            title="Log Out"
            onPress={() => setLogOutOpen("logout")}
            icon={<Ionicons name="log-out-outline" size={20} color="#D01D1D" />}
            isLogout
          />
          {renderLogOutModal()}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  container: {
    padding: 20,
  },
  scroolContainer: {
    paddingBottom: resHeight(5),
  },
  title: {
    fontSize: resFont(22),
    fontFamily: "OutfitBold",
    marginBottom: resHeight(2),
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 28,
  },
  avatar: {
    width: resHeight(9),
    height: resHeight(9),
    borderRadius: resHeight(4.5),
    marginBottom: resHeight(3),
  },
  name: {
    fontSize: resFont(16),
    fontFamily: "OutfitMedium",
    color: "#1A1A1A",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard: {
    width: "90%",
    height: "50%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: resHeight(3),
    alignItems: "center",
    justifyContent: "center",
  },
  closeButton: {
    position: "absolute",
    top: 15,
    right: 15,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  modalTitle: {
    fontSize: resFont(22),
    fontFamily: "OutfitMedium",
    textAlign: "center",
    marginVertical: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    width: "100%",
    marginTop: 20,
    padding: 20,
    paddingTop: 10,
    backgroundColor: "#fff",
  },
  modalSubTitle: {
    color: Colors.dark.textLight,
    fontSize: resFont(12),
    textAlign: "center",
    marginBottom: 20,
  },
});
