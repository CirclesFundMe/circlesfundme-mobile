import handleFetch from "@/services/api/handleFetch";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import Input from "@/components/ui/Input";
import Loader from "@/components/ui/Loader";
import ProgressStepsBar from "@/components/ui/ProgressStepsBar";
import SelectInput from "@/components/ui/SelectInput";
import { Colors } from "@/constants/Colors";
import useDebounce from "@/hooks/useDebounce";
import { resFont, resHeight, toNumber } from "@/utils/utils";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import Button from "../../components/ui/Buttton";

export default function ContributionScheme() {
  const {
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
    selfieUri,
  } = useLocalSearchParams<{
    fullName: string;
    phone: string;
    dob: string;
    gender: string;
    bvn: string;
    documentUri: string;
    documentName: string;
    documentType: string;
    utilityBillUri: string;
    utilityBillName: string;
    utilityBillType: string;
    userAddress: string;
    selfieUri: string;
  }>();

  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [scheme, setScheme] = useState("");
  const [income, setIncome] = useState("");
  const [contribution, setContribution] = useState("");
  const [assetCost, setAssetCost] = useState("");
  const [error, setError] = useState("");
  const [additionalWeeklyContribution, setAdditionalWeeklyContribution] =
    useState("");

  const incomeValue = parseFloat(income.replace(/,/g, ""));
  const contributionValue = parseFloat(contribution.replace(/,/g, ""));

  const [vehicleBreakdown, setVehicleBreakdown] = useState({
    costOfVehicle: "",
    extraEngine: "",
    extraTyre: "",
    insurance: "",
    processingFee: "",
    totalAssetValue: "",
    downPayment: "",
    loanManagementFee: "",
    minimumWeeklyContribution: "",
    postLoanWeeklyContribution: "",
  });

  const breakdownMutation = useMutation({
    mutationFn: (body: any) =>
      handleFetch({
        endpoint: "contributionschemes/auto-finance-breakdown",
        method: "POST",
        body,
      }),
    onSuccess: (res: any) => {
      if (res?.statusCode !== "200" && res?.status !== 200) {
        Toast.show({
          type: "error",
          text1: "Failed to fetch breakdown",
          text2: res?.message || "Try again later",
        });
        return;
      }
      const breakdown = res?.data;
      setVehicleBreakdown({
        costOfVehicle: breakdown.costOfVehicle,
        extraEngine: breakdown.extraEngine,
        extraTyre: breakdown.extraTyre,
        insurance: breakdown.insurance,
        processingFee: breakdown.processingFee,
        totalAssetValue: breakdown.totalAssetValue,
        downPayment: breakdown.downPayment,
        loanManagementFee: breakdown.loanManagementFee,
        minimumWeeklyContribution: breakdown.minimumWeeklyContribution,
        postLoanWeeklyContribution: breakdown.postLoanWeeklyContribution,
      });
    },
    onError: (error: any) => {
      Toast.show({
        type: "error",
        text1: "Breakdown Error",
        text2: error?.message || "Something went wrong",
      });
    },
  });

  const debouncedAssetCost = useDebounce(assetCost, 800);
  const shouldRenderDetails = !!debouncedAssetCost.trim();

  useEffect(() => {
    const cost = parseFloat(debouncedAssetCost.replace(/,/g, ""));
    if (!shouldRenderDetails || isNaN(cost)) return;

    breakdownMutation.mutate({ costOfVehicle: cost });
  }, [debouncedAssetCost, shouldRenderDetails]);

  const isAssetFinance = scheme === "Auto Financing";
  const maxPercentage = scheme === "Weekly Contribution Scheme" ? 0.2 : 0.3;

  const eligibleLoanPrincipal = (
    toNumber(vehicleBreakdown.totalAssetValue) -
    toNumber(vehicleBreakdown.downPayment)
  ).toString();

  const isValidContribution = contributionValue <= maxPercentage * incomeValue;

  const { data: schemesData } = useQuery({
    queryKey: ["contribution-schemes"],
    queryFn: () => handleFetch({ endpoint: "contributionschemes/mini" }),
  });

  const selectedSchemeId = schemesData?.data?.find(
    (item: { name: string; id: string }) =>
      item.name.toLowerCase().includes(scheme.toLowerCase())
  )?.id;

  const eligibleLoan =
    scheme === "Weekly Contribution Scheme"
      ? contributionValue * 52
      : contributionValue * 12;

  const serviceCharge = 2500;
  const baseContribution = toNumber(vehicleBreakdown.minimumWeeklyContribution);
  const extraContribution = toNumber(additionalWeeklyContribution);
  const totalWeeklyContribution = baseContribution + extraContribution;

  const submitUserDetailsMutation = useMutation({
    mutationFn: (body: any) =>
      handleFetch({
        endpoint: "accounts/complete-onboarding",
        method: "POST",
        body,
        multipart: true,
        auth: true,
      }),
    onSuccess: (res) => {
      if (res?.statusCode !== "200" && res?.status !== 200) {
        Toast.show({
          type: "error",
          text1: "Submission Failed",
          text2: res?.message || "Invalid data",
        });
        return;
      }
      Toast.show({
        type: "success",
        text1: "Details Submitted",
      });
      router.replace("/(tabs)");
    },
    onError: (error) => {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error?.message || "Something went wrong",
      });
    },
  });

  const handleContinue = async () => {
    if (
      !scheme ||
      (isAssetFinance && (!assetCost || !!contribution)) ||
      (!isAssetFinance && (!income || !contribution))
    ) {
      setError("All fields are required.");
      return;
    }
    if (!isValidContribution && contribution) {
      const maxPercent =
        scheme === "Weekly Contribution Scheme" ? "20%" : "30%";
      setError(`You cannot contribute more than ${maxPercent} of your income.`);
      return;
    }
    const intlPhone = phone.replace(/^0/, "+234");
    const formData = new FormData();
    formData.append("FullName", String(fullName));
    formData.append("PhoneNumber", String(intlPhone));
    formData.append("Selfie", String(selfieUri));
    formData.append("DateOfBirth", String(dob));
    formData.append("Gender", String(gender));
    formData.append("Address", String(userAddress));
    formData.append("BVN", String(bvn));
    formData.append("ContributionSchemeId", String(selectedSchemeId));
    formData.append("Income", String(income));
    formData.append("CostOfVehicle", String(assetCost));
    formData.append("ContributionAmount", String(contribution));
    formData.append("GovernmentIssuedID", {
      uri: String(documentUri),
      name: String(documentName),
      type: String(documentType),
    } as any);
    formData.append("UtilityBill", {
      uri: String(utilityBillUri),
      name: String(utilityBillName),
      type: String(utilityBillType),
    } as any);
    submitUserDetailsMutation.mutate(formData);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1 }}>
        {submitUserDetailsMutation.isPending && <Loader />}
        {breakdownMutation.isPending && <Loader />}
        <KeyboardAvoidingView
          style={[styles.container, { marginTop: insets.top || 40 }]}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
        >
          <ProgressStepsBar currentStep={5} />
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.title}>Contribution Scheme</Text>
            <Text style={styles.subtitle}>
              Select how you want to contribute and grow your funds.
            </Text>

            <SelectInput
              label="Contribution Scheme"
              value={scheme}
              onSelect={setScheme}
              placeholder="Select Your preferred scheme"
              options={[
                "Weekly Contribution Scheme",
                "Monthly Contribution Scheme",
                "Auto Financing",
              ]}
            />

            {isAssetFinance ? (
              <View>
                <Input
                  label="What is the cost of the vehicle?"
                  placeholder="Enter Amount"
                  value={assetCost}
                  onChangeText={setAssetCost}
                  keyboardType="phone-pad"
                />
                {shouldRenderDetails && (
                  <View>
                    <View style={styles.summaryBox}>
                      <View style={styles.groupText}>
                        <Text style={styles.summaryText}>Cost of Vehicle</Text>
                        <Text style={styles.boldText}>
                          ₦{vehicleBreakdown.costOfVehicle}
                        </Text>
                      </View>
                      <View style={styles.groupText}>
                        <Text style={styles.summaryText}>
                          Extra engine (10%)
                        </Text>
                        <Text style={styles.boldText}>
                          ₦{vehicleBreakdown.extraEngine}
                        </Text>
                      </View>
                      <View style={styles.groupText}>
                        <Text style={styles.summaryText}>
                          Extra Tyres (10%)
                        </Text>
                        <Text style={styles.boldText}>
                          ₦{vehicleBreakdown.extraTyre}
                        </Text>
                      </View>
                      <View style={styles.groupText}>
                        <Text style={styles.summaryText}>
                          Insurance (6%) over 4 years{" "}
                        </Text>
                        <Text style={styles.boldText}>
                          ₦{vehicleBreakdown.insurance}
                        </Text>
                      </View>
                      <View style={styles.groupText}>
                        <Text style={styles.summaryText}>Processing Fee</Text>
                        <Text style={styles.boldText}>
                          ₦{vehicleBreakdown.processingFee}
                        </Text>
                      </View>
                    </View>
                    <View style={{ marginVertical: resHeight(1) }} />
                    {/* Read-only fields */}
                    <Input
                      label="User Contribution (Down Payment)"
                      placeholder="Enter Amount"
                      value={`₦${vehicleBreakdown.downPayment}`}
                      keyboardType="phone-pad"
                      editable={false}
                      showInfoIcon={true}
                      infoTitle="User Contribution (Down Payment)"
                      infoContent="10% of total asset value. Paid from user’s savings contribution."
                    />
                    <Input
                      label="Eligible Loan (Principal)"
                      placeholder="Enter Amount"
                      value={`₦${eligibleLoanPrincipal}`}
                      keyboardType="phone-pad"
                      editable={false}
                      showInfoIcon={true}
                      infoTitle="Eligible Loan (Principal)"
                      infoContent="90% of total asset value."
                    />
                    <Input
                      label="Loan Management Fee over 4 years"
                      placeholder="Enter Amount"
                      value={`₦${vehicleBreakdown.loanManagementFee}`}
                      keyboardType="phone-pad"
                      editable={false}
                      showInfoIcon={true}
                      infoTitle="Loan Management Fee over 4 years"
                      infoContent="Annually: 6% of Asset Value. 
                      Total for 4 Years: Annual Loan Management Fee × 4"
                    />
                    <Input
                      label="Minimum Weekly Contribution over 4 years"
                      placeholder="Enter Amount"
                      value={additionalWeeklyContribution}
                      onChangeText={setAdditionalWeeklyContribution}
                      keyboardType="phone-pad"
                      showInfoIcon={true}
                      infoTitle="Minimum Weekly Contribution over 4 years (208 weeks)"
                      infoContent="Minimum Weekly Saving = Asset Value ÷ 208 weeks.
                      Pre-Loan Charge (0.025%) =  Asset Value × 0.025.
                      Total Min Weekly Contribution = (principal saving) + (pre-loan fee)"
                    />
                    <Text
                      style={{
                        marginBottom: 8,
                        color: "#444",
                        fontFamily: "OutfitRegular",
                      }}
                    >
                      Total Weekly Contribution: ₦
                      {totalWeeklyContribution.toLocaleString()}
                    </Text>
                    <Input
                      label="Post-Loan Weekly Repayment over 4 years"
                      placeholder="Enter Amount"
                      value={`₦${vehicleBreakdown.postLoanWeeklyContribution}`}
                      keyboardType="phone-pad"
                      editable={false}
                      showInfoIcon={true}
                      infoTitle="Post-Loan Weekly Repayment over 4 years"
                      infoContent="Total Fees = Eligible Loan + Loan Management Fee.
                      Post-Loan Charge (0.05%) = 0.05% of Total Fees.
                      Total to Repay Over 4 Years: = Total Fees + Post-Loan Charges.
                      Weekly Repayment = Total Repayment ÷ 208 weeks"
                    />
                  </View>
                )}
              </View>
            ) : (
              <>
                <Input
                  label={`What’s your ${
                    scheme === "Weekly Contribution Scheme"
                      ? "weekly"
                      : "monthly"
                  } income (NGN)?`}
                  placeholder="Enter Amount"
                  value={income}
                  onChangeText={setIncome}
                  keyboardType="phone-pad"
                />
                <Input
                  label={`What’s your preferred ${
                    scheme === "Weekly Contribution Scheme"
                      ? "weekly"
                      : "monthly"
                  } contribution`}
                  placeholder="Enter Amount"
                  value={contribution}
                  onChangeText={setContribution}
                  keyboardType="phone-pad"
                />
                {isValidContribution && !!contribution && (
                  <View style={styles.summaryBox}>
                    <View style={styles.groupText}>
                      <View>
                        <Text style={styles.summaryText}>Eligible Loan</Text>
                        <Text style={styles.summarySubText}>
                          {scheme === "Weekly Contribution Scheme"
                            ? "52x of your weekly contribution"
                            : "12x of your monthly contribution"}
                        </Text>
                      </View>
                      <Text style={styles.boldText}>
                        ₦{eligibleLoan.toLocaleString()}
                      </Text>
                    </View>
                    <View style={styles.groupText}>
                      <Text style={styles.summaryText}>Service Charge</Text>
                      <Text style={styles.boldText}>
                        ₦{serviceCharge.toLocaleString()}/
                        <Text style={{ fontSize: 10 }}>week</Text>
                      </Text>
                    </View>
                  </View>
                )}
              </>
            )}

            {!isValidContribution && contribution && (
              <Text style={styles.error}>
                You cannot contribute more than{" "}
                {scheme === "Weekly Contribution Scheme" ? "20%" : "30%"} of
                your income.
              </Text>
            )}

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <View style={{ marginBottom: resHeight(5) }} />
            <Button
              title={
                submitUserDetailsMutation.isPending
                  ? "Accepting..."
                  : "Accept and Continue"
              }
              onPress={handleContinue}
              disabled={submitUserDetailsMutation.isPending}
            />
            <View style={{ marginBottom: resHeight(5) }} />
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  scrollContainer: {
    paddingBottom: 40,
  },
  title: {
    fontSize: resFont(30),
    marginTop: resHeight(4),
    fontFamily: "OutfitMedium",
  },
  subtitle: {
    fontSize: resFont(12),
    color: Colors.dark.textLight,
    marginVertical: 10,
    fontFamily: "OutfitRegular",
  },
  error: {
    color: "red",
    fontSize: resFont(11),
    marginTop: 8,
  },
  summaryBox: {
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: "#CCCCCC",
    marginTop: 20,
  },
  summaryText: {
    fontSize: resFont(12),
    fontFamily: "OutfitMedium",
  },
  summarySubText: {
    fontSize: resFont(10),
    color: Colors.dark.textLight,
    fontFamily: "OutfitRegular",
  },
  boldText: {
    fontWeight: "500",
    fontSize: resFont(12),
  },
  groupText: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },
});
