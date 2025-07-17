/* eslint-disable react/jsx-key */
/* eslint-disable import/no-duplicates */
"use client";

import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import ContributionsCard from "@/components/dashboard/ContributionBreakDownCard";
import ContributionCard from "@/components/dashboard/ContributionCard";
import LoanCard from "@/components/dashboard/LoanCard";
import RecentActivityList from "@/components/dashboard/RecentActivityList";
import UserGreeting from "@/components/dashboard/UserGreeting";
import Button from "@/components/ui/Buttton";
import SetupNotice from "@/components/ui/SetupNotice";
import { Colors } from "@/constants/Colors";
import handleFetch from "@/services/api/handleFetch";
import { resFont, resHeight } from "@/utils/utils";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useQuery } from "@tanstack/react-query";
import { Dimensions } from "react-native";
import Carousel from "react-native-reanimated-carousel";

const { width } = Dimensions.get("window");

interface WalletItem {
  title: string;
  balance: string;
  scheme: string;
}

export default function DashboardScreen() {
  const { data: userData } = useQuery({
    queryKey: ["users-me"],
    queryFn: () => handleFetch({ endpoint: "users/me", auth: true }),
  });

  const { data: walletData } = useQuery({
    queryKey: ["financials-my-wallets"],
    queryFn: () =>
      handleFetch({ endpoint: "financials/my-wallets", auth: true }),
  });

  const maxLoan = walletData?.data?.find(
    (item: WalletItem) => item.title === "Maximum Loan Eligible"
  );

  const contribution = walletData?.data?.find(
    (item: WalletItem) => item.title === "Your contribution"
  );

  const insets = useSafeAreaInsets();
  const router = useRouter();

  const data = [
    <LoanCard
      onPressApply={() => setLoanStep("loanApplication")}
      onWaitListPress={() => setWaitlist(maxLoan?.action)}
      loanStatus={maxLoan?.action ?? ""}
      amount={maxLoan?.balance ?? "₦ 0"}
      scheme={maxLoan?.scheme ?? ""}
      nextTranDate={maxLoan?.nextTranDate ?? ""}
    />,
    <ContributionCard
      onPressApply={() => setWithdrawal("withdrawal")}
      action={contribution?.action ?? ""}
      amount={contribution?.balance ?? "₦ 0"}
      scheme={contribution?.scheme ?? ""}
      nextTranDate={maxLoan?.nextTranDate ?? ""}
    />,
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [loanStep, setLoanStep] = useState<
    "notEligible" | "paymentIncomplete" | "loanApplication" | null
  >(null);
  const [waitlist, setWaitlist] = useState<
    "active" | "pending" | "waitlist" | "Apply for Loan" | null
  >(maxLoan?.action);
  const [withdrawal, setWithdrawal] = useState<
    "withdrawal" | "withdrawalFailed" | null
  >(null);

  const handleContinue = () => {
    setLoanStep(null);
    router.push("/loan-setup/loan-application");
  };

  let withdrawalFailed = true;

  const handleWithdrawal = () => {
    setWithdrawal(null);
    if (withdrawalFailed) {
      setWithdrawal("withdrawalFailed");
    } else {
      router.push("/withdrawal-setup/withdrawal-application-success");
    }
  };

  const renderWaitListedModal = () => {
    if (!waitlist) return null;

    let title = "";
    let subtitle = "";
    let iconColor = "#666666";

    switch (waitlist) {
      case "waitlist":
        title = "Your loan application has been waitlisted";
        subtitle =
          "This means your application has been approved but is waiting to be funded.";
        break;

      case "active":
        title = "Your loan is now active";
        subtitle =
          "Congratulations! Your loan has been funded and is now active.";
        iconColor = Colors.dark.primary;
        break;

      case "pending":
        title = "Your loan application is under review";
        subtitle =
          "We’re currently reviewing your loan application. You’ll be notified once a decision has been made.";
        iconColor = "#FFA500";
        break;

      default:
        return null;
    }

    return (
      <Modal transparent visible>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { height: "30%" }]}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setWaitlist(null)}
            >
              <AntDesign name="closecircleo" size={12} color="black" />
            </TouchableOpacity>
            <AntDesign name="exclamationcircleo" size={80} color={iconColor} />
            <Text style={styles.modalTitle}>{title}</Text>
            <Text style={styles.modalSubTitle}>{subtitle}</Text>
          </View>
        </View>
      </Modal>
    );
  };

  const renderLoanModal = () => {
    switch (loanStep) {
      case "notEligible":
        return (
          <Modal transparent visible>
            <View style={styles.modalOverlay}>
              <View style={styles.modalCard}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setLoanStep(null)}
                >
                  <AntDesign name="closecircleo" size={12} color="black" />
                </TouchableOpacity>
                <AntDesign
                  name="exclamationcircleo"
                  size={100}
                  color={"#D01D1D"}
                />
                <Text style={styles.modalTitle}>
                  You&apos;re Not Yet Eligible for a Loan
                </Text>
                <Text style={styles.modalSubTitle}>
                  To qualify for a loan, you need to complete weekly
                  contribution for 12 weeks.
                </Text>
              </View>
            </View>
          </Modal>
        );
      case "paymentIncomplete":
        return (
          <Modal transparent visible>
            <View style={styles.modalOverlay}>
              <View style={styles.modalCard}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setLoanStep(null)}
                >
                  <AntDesign name="closecircleo" size={12} color="black" />
                </TouchableOpacity>
                <AntDesign
                  name="exclamationcircleo"
                  size={100}
                  color={"#D01D1D"}
                />
                <Text style={styles.modalTitle}>
                  You’re yet to complete payment setup
                </Text>
                <Text style={styles.modalSubTitle}>
                  To access loan, you need to complete your payment setup.{" "}
                </Text>
              </View>
            </View>
          </Modal>
        );
      case "loanApplication":
        return (
          <Modal transparent visible>
            <View style={styles.modalOverlay}>
              <View style={[styles.modalCard, { height: "75%" }]}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setLoanStep(null)}
                >
                  <AntDesign name="closecircleo" size={12} color="black" />
                </TouchableOpacity>

                <View style={styles.loanDetailsContainer}>
                  <Text style={styles.loanLabel}>Maximum Loan Eligible</Text>
                  <Text style={styles.loanAmount}>1,200,000.00</Text>

                  <View style={styles.dividerLine} />

                  <View style={styles.detailsGrid}>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>
                        Subscription Scheme
                      </Text>
                      <Text style={styles.detailValue}>Weekly</Text>
                    </View>

                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>
                        Loan Management Fee
                      </Text>
                      <Text style={styles.detailValue}>6%</Text>
                    </View>

                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Repayment Term</Text>
                      <Text style={styles.detailValue}>52 Weeks</Text>
                    </View>

                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Repayment Plan</Text>
                      <Text style={styles.detailValue}>13,500/wk</Text>
                    </View>

                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Default Penalty</Text>
                      <Text style={styles.detailValue}>+25% of repayment</Text>
                    </View>
                  </View>

                  <View style={styles.termsContainer}>
                    <Text style={styles.termsText}>
                      By clicking &apos;Proceed&apos;, you agree to the{" "}
                      <Text style={styles.linkText}>loan terms</Text> and{" "}
                      <Text style={styles.linkText}>repayment schedule</Text>
                    </Text>
                  </View>

                  <Button title="Proceed" onPress={() => handleContinue()} />
                </View>
              </View>
            </View>
          </Modal>
        );
      default:
        return null;
    }
  };

  const renderContributionModal = () => {
    switch (withdrawal) {
      case "withdrawalFailed":
        return (
          <Modal transparent visible>
            <View style={styles.modalOverlay}>
              <View style={styles.modalCard}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setWithdrawal(null)}
                >
                  <AntDesign name="closecircleo" size={12} color="black" />
                </TouchableOpacity>
                <AntDesign
                  name="exclamationcircleo"
                  size={100}
                  color={"#D01D1D"}
                />
                <Text style={styles.modalTitle}>Withdrawal Declined</Text>
                <Text style={styles.modalSubTitle}>
                  You can’t withdraw contribution during loan repayment
                </Text>
              </View>
            </View>
          </Modal>
        );
      case "withdrawal":
        return (
          <Modal transparent visible>
            <View style={styles.modalOverlayCont}>
              <View style={styles.modalCardCont}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setWithdrawal(null)}
                >
                  <AntDesign name="closecircleo" size={12} color="black" />
                </TouchableOpacity>

                <View style={styles.modalContent}>
                  <View style={styles.iconContainer}>
                    <AntDesign
                      name="questioncircleo"
                      size={80}
                      color={Colors.dark.primary}
                    />
                  </View>

                  <View style={styles.textContainer}>
                    <Text style={styles.modalTitleCont}>
                      Do you wish to withdraw your contribution?
                    </Text>
                    <Text style={styles.modalSubTitleCont}>
                      Note that you will be charged ₦500 for the transaction
                    </Text>
                  </View>

                  <View style={styles.dividerLine} />

                  <View style={styles.bankDetailsSection}>
                    <View style={styles.bankHeader}>
                      <Text style={styles.bankDetailsLabel}>
                        Recipient Bank Details
                      </Text>
                      <Text style={styles.accountNumber}>
                        {userData?.data?.withdrawalSetting?.accountNumber ||
                          "N/A"}
                      </Text>
                    </View>

                    <View style={styles.bankInfo}>
                      <Text style={styles.accountName}>
                        {userData?.data?.withdrawalSetting?.accountName ||
                          "N/A"}
                      </Text>
                      <Text style={styles.bankName}>
                        {userData?.data?.withdrawalSetting?.bankName || "N/A"}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.buttonContainer}>
                  <Button title="Proceed" onPress={() => handleWithdrawal()} />
                </View>
              </View>
            </View>
          </Modal>
        );

      default:
        return null;
    }
  };

  const onPressedPaymentSetup = () => {
    router.push("/payment-setup/payment-method");
  };

  return (
    <View style={[styles.container, { marginTop: insets.top || 40 }]}>
      {userData?.data && (
        <UserGreeting
          name={`${userData.data.firstName} ${userData.data.lastName}`}
          avatarUrl={userData.data.profilePictureUrl}
        />
      )}
      <Carousel
        loop
        width={width * 0.9}
        height={resHeight(25)}
        autoPlay={false}
        mode="horizontal-stack"
        modeConfig={{ snapDirection: "left", stackInterval: 20 }}
        pagingEnabled
        data={data}
        onSnapToItem={(index) => setActiveIndex(index)}
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>{item}</View>
        )}
      />
      <View style={styles.indicatorContainer}>
        {data.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, index === activeIndex && styles.activeDot]}
          />
        ))}
      </View>
      {activeIndex === 0 && !userData?.isPaymentSetupComplete ? (
        <SetupNotice
          title="You haven’t setup payments yet"
          buttonText="Complete Setup"
          onPress={onPressedPaymentSetup}
        />
      ) : activeIndex !== 0 ? (
        <ContributionsCard />
      ) : null}
      <RecentActivityList />
      {renderLoanModal()}
      {renderContributionModal()}
      {renderWaitListedModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  cardWrapper: { width: "100%" },
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: Colors.dark.primary,
    width: 20,
    height: 8,
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
  alert: {
    fontSize: 48,
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: resFont(18),
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },
  modalSubTitle: {
    color: Colors.dark.textLight,
    fontSize: resFont(12),
    textAlign: "center",
    marginBottom: 20,
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
  closeIcon: {
    fontSize: 20,
    color: "#333",
    fontWeight: "bold",
  },
  loanDetailsContainer: {
    padding: resHeight(0.5),
  },
  loanLabel: {
    fontSize: resFont(12),
    color: "#666",
    textAlign: "center",
    marginBottom: 8,
  },
  loanAmount: {
    fontSize: resFont(36),
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    marginBottom: 20,
  },
  detailsGrid: {
    marginBottom: resHeight(7),
  },
  dividerLine: {
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    marginBottom: resHeight(2),
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: resHeight(2),
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  detailLabel: {
    fontSize: resFont(12),
    color: "#666",
    flex: 1,
  },
  detailValue: {
    fontSize: resFont(12),
    color: "#000",
    fontWeight: "500",
    textAlign: "right",
  },
  termsContainer: {
    marginBottom: 20,
  },
  termsText: {
    fontSize: resFont(12),
    color: "#666",
    lineHeight: 18,
    textAlign: "left",
    marginBottom: resHeight(5),
  },
  linkText: {
    color: Colors.dark.primary,
  },
  modalOverlayCont: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalCardCont: {
    backgroundColor: "#fff",
    borderRadius: 20,
    width: "100%",
    maxWidth: 400,
    height: "60%",
    position: "relative",
  },
  modalContent: {
    padding: 24,
    paddingTop: 40,
    alignItems: "center",
  },
  iconContainer: {
    marginBottom: 20,
  },
  textContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  modalTitleCont: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    textAlign: "center",
    marginBottom: 8,
    lineHeight: 24,
  },
  modalSubTitleCont: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
  },
  bankDetailsSection: {
    width: "100%",
    marginBottom: 24,
  },
  bankHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  bankDetailsLabel: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  accountNumber: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  bankInfo: {
    alignItems: "flex-end",
  },
  accountName: {
    fontSize: 14,
    color: "#000",
    fontWeight: "500",
    marginBottom: 4,
  },
  bankName: {
    fontSize: 14,
    color: "#666",
  },
  buttonContainer: {
    padding: 20,
    paddingTop: 10,
    backgroundColor: "#fff",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 25,
    paddingVertical: 14,
  },
  cancelButtonText: {
    color: "#666",
    fontWeight: "500",
  },
  proceedButton: {
    flex: 1,
    backgroundColor: "#000",
    borderRadius: 25,
    paddingVertical: 14,
  },
});
