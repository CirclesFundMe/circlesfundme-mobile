import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Keyboard,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { Colors } from "@/constants/Colors";
import { useDocumentPicker } from "@/hooks/useDocumentPicker";
import { resFont, resHeight } from "@/utils/utils";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Button from "../../components/ui/Buttton";
import Input from "../../components/ui/Input";

export default function ConfirmAddress() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [userAddress, setUserAddress] = useState("");
  const [loanStep, setLoanStep] = useState<"loanProceed" | null>(null);

  const {
    file: utilityBill,
    pickFile,
    error,
  } = useDocumentPicker({
    allowedTypes: ["application/pdf", "image/png", "image/jpeg"],
    maxSizeMB: 10,
  });

  const handleSubmit = () => {
    if (!userAddress && !utilityBill) {
      alert(
        "Please enter the type of loan here and upload a recent bank statment."
      );
      return;
    }
    setLoanStep("loanProceed");
  };

  const handleContinue = () => {
    setLoanStep(null);
    router.push("/loan-setup/loan-application-success");
  };

  const renderLoanModal = () => {
    switch (loanStep) {
      case "loanProceed":
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

                <ScrollView
                  style={styles.scrollContainer}
                  showsVerticalScrollIndicator={false}
                >
                  <View style={styles.amountCard}>
                    <Text style={styles.cardLabel}>Loan Amount</Text>
                    <Text style={styles.cardAmount}>₦ 950,000</Text>
                  </View>

                  <View style={styles.amountCard}>
                    <Text style={styles.cardLabel}>Total Amount Repayable</Text>
                    <Text style={styles.cardAmount}>₦ 1,000,000</Text>
                  </View>

                  <View style={styles.dividerLine} />

                  <View style={styles.detailsSection}>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>
                        Subscription Scheme
                      </Text>
                      <Text style={styles.detailValue}>Weekly</Text>
                    </View>

                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Repayment Term</Text>
                      <Text style={styles.detailValue}>52 Weeks</Text>
                    </View>

                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Repayment Plan</Text>
                      <Text style={styles.detailValue}>13,500/week</Text>
                    </View>
                  </View>
                  <View style={styles.dividerLine} />

                  <View style={styles.bankDetailsSection}>
                    <View style={[styles.detailRow, { paddingVertical: 0 }]}>
                      <Text style={styles.bankDetailsLabel}>
                        Recipient Bank Details
                      </Text>
                      <Text style={styles.accountNumber}>0012345678</Text>
                    </View>

                    <View style={styles.bankInfo}>
                      <Text style={styles.accountName}>Ryan Reynolds</Text>
                      <Text style={styles.bankName}>Wema Bank</Text>
                    </View>
                  </View>
                </ScrollView>

                <View style={styles.buttonContainer}>
                  <Button
                    title="Confirm Loan Application"
                    onPress={() => handleContinue()}
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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[styles.container, { marginTop: insets.top || 40 }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <AntDesign name="arrowleft" size={24} color="black" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Loan Application</Text>
        </View>

        <Input
          label="Title"
          value={userAddress}
          onChangeText={setUserAddress}
          placeholder="Type Here..."
        />

        <Text style={styles.label}>Upload Bank Statement</Text>
        <TouchableOpacity style={styles.uploadBox} onPress={pickFile}>
          <Ionicons name="cloud-upload-outline" size={32} color="#00A86B" />
          <Text style={styles.uploadTitle}>Upload Bank Statement</Text>
        </TouchableOpacity>

        {error && <Text style={styles.errorText}>{error}</Text>}
        {utilityBill && (
          <Text style={styles.selectedFileText}>
            Selected: {utilityBill.name}
          </Text>
        )}

        <View style={styles.fileInfo}>
          <Text style={styles.fileText}>
            Your bank Statement must cover the last 3 months
          </Text>
        </View>

        <View style={{ marginBottom: resHeight(8) }} />

        <Button title="Proceed" onPress={handleSubmit} />
        {renderLoanModal()}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: resFont(30),
    fontWeight: "500",
    marginTop: resHeight(4),
  },
  subtitle: {
    fontSize: resFont(12),
    marginTop: 10,
    marginBottom: resHeight(4),
    color: Colors.dark.textLight,
  },
  label: {
    marginBottom: resHeight(1),
    fontWeight: "500",
    fontSize: resFont(12),
    color: Colors.dark.background,
  },
  uploadBox: {
    borderWidth: 1,
    borderColor: "#00A86B",
    borderStyle: "dashed",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    backgroundColor: "#F7FDF9",
  },
  uploadTitle: {
    color: "#00A86B",
    fontWeight: "600",
    fontSize: resFont(14),
    marginTop: 10,
  },
  fileInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  fileText: {
    fontSize: resFont(11),
    color: "#999",
  },
  errorText: {
    color: "red",
    fontSize: resFont(11),
    marginTop: 5,
  },
  selectedFileText: {
    marginTop: 5,
    fontSize: resFont(12),
    fontStyle: "italic",
    color: "#333",
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
  detailsGrid: {
    marginBottom: resHeight(7),
  },
  dividerLine: {
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    marginVertical: resHeight(2),
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
  closeIcon: {
    fontSize: 20,
    color: "#333",
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    width: "100%",
    maxWidth: 400,
    position: "relative",
    overflow: "hidden",
  },
  closeButton: {
    position: "absolute",
    top: 15,
    right: 15,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  scrollContainer: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
  },
  amountCard: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E6E6E6",
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardLabel: {
    fontSize: 14,
    color: "#666",
    flex: 1,
  },
  cardAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  detailsSection: {
    marginTop: 20,
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: "#666",
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    color: "#000",
    fontWeight: "500",
    textAlign: "right",
  },
  bankDetailsSection: {
    marginTop: 20,
  },
  bankDetailsLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  bankInfo: {
    alignItems: "flex-end",
  },
  accountNumber: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 4,
  },
  accountName: {
    fontSize: 14,
    color: "#000",
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
});
