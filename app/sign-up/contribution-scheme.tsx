/* eslint-disable react-hooks/exhaustive-deps */
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
import { monthDayOptions } from "@/utils/dayMonth";
import { formatAmount, resFont, resHeight, toNumber } from "@/utils/utils";
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
  const [remittanceWeekDay, setRemittanceWeekDay] = useState("");
  const [remittanceMonthDay, setRemittanceMonthDay] = useState("");
  const [remittanceDayValue, setRemittanceDayValue] = useState<string>("");
  const [remittanceType, setRemittanceType] = useState<string>("");

  const [income, setIncome] = useState("");
  const [contribution, setContribution] = useState("");
  const [assetCost, setAssetCost] = useState("");
  const [error, setError] = useState("");
  const [additionalWeeklyContribution, setAdditionalWeeklyContribution] =
    useState("");
  const [isAdditionalContributionInvalid, setIsAdditionalContributionInvalid] =
    useState(false);

  const incomeValue = parseFloat(income?.replace(/,/g, ""));
  const contributionValue = parseFloat(contribution?.replace(/,/g, ""));

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
    eligibleLoan: "",
    preLoanServiceCharge: "",
    baseContributionAmount: 0,
  });
  const [regularBreakdown, setRegularBreakdown] = useState<any>({
    principalLoan: "",
    principalLoanDescription: "",
    loanManagementFee: "",
    loanManagementFeeDescription: "",
    eligibleLoan: "",
    eligibleLoanDescription: "",
    serviceCharge: "",
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
        eligibleLoan: breakdown.eligibleLoan,
        preLoanServiceCharge: breakdown.preLoanServiceCharge,
        baseContributionAmount: breakdown.baseContributionAmount,
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

  const regualarBreakdownMutation = useMutation({
    mutationFn: (body: any) =>
      handleFetch({
        endpoint: "contributionschemes/regular-finance-breakdown",
        method: "POST",
        body,
      }),
    onSuccess: (res: any) => {
      const breakdown = res?.data;
      setRegularBreakdown({
        principalLoan: breakdown.principalLoan,
        principalLoanDescription: breakdown.principalLoanDescription,
        loanManagementFee: breakdown.loanManagementFee,
        loanManagementFeeDescription: breakdown.loanManagementFeeDescription,
        eligibleLoan: breakdown.eligibleLoan,
        eligibleLoanDescription: breakdown.eligibleLoanDescription,
        serviceCharge: breakdown.serviceCharge,
      });
    },
    onError: (error: any) => {
      Toast.show({
        type: "error",
        text1: "Breakdown Error",
        text2: error?.message || "Something went wrong",
      });
      setRegularBreakdown({});
    },
  });

  const debouncedAssetCost = useDebounce(assetCost, 800);
  const debouncedContributionValue = useDebounce(contributionValue, 800);
  const debouncedAdditionalContribution = useDebounce(
    additionalWeeklyContribution,
    800
  );

  const shouldRenderDetails = !!debouncedAssetCost.trim();
  const shouldRenderRegularDetails =
    scheme === "Weekly Contribution Scheme" ||
    scheme === "Monthly Contribution Scheme";

  const { data: schemesData } = useQuery({
    queryKey: ["contribution-schemes"],
    queryFn: () => handleFetch({ endpoint: "contributionschemes/mini" }),
  });

  const selectedSchemeId = schemesData?.data?.find(
    (item: { name: string; id: string }) =>
      item.name.toLowerCase().includes(scheme.toLowerCase())
  )?.id;

  useEffect(() => {
    const cost = parseFloat(debouncedAssetCost?.replace(/,/g, ""));
    if (!shouldRenderDetails || isNaN(cost)) return;
    breakdownMutation.mutate({ costOfVehicle: cost });
  }, [debouncedAssetCost, shouldRenderDetails, selectedSchemeId]);

  useEffect(() => {
    const isValidScheme =
      scheme === "Weekly Contribution Scheme" ||
      scheme === "Monthly Contribution Scheme";
    if (
      error === "" &&
      isValidScheme &&
      debouncedContributionValue > 0 &&
      selectedSchemeId
    ) {
      regualarBreakdownMutation.mutate({
        contributionSchemeId: selectedSchemeId,
        amount: debouncedContributionValue,
      });
    }
  }, [debouncedContributionValue, selectedSchemeId, scheme, error]);

  useEffect(() => {
    const base = toNumber(vehicleBreakdown.baseContributionAmount || 0);
    const userAmount = toNumber(debouncedAdditionalContribution);

    if (!debouncedAdditionalContribution.trim()) {
      setIsAdditionalContributionInvalid(false);
      return;
    }

    if (userAmount < base) {
      setIsAdditionalContributionInvalid(true);
    } else {
      setIsAdditionalContributionInvalid(false);
    }
  }, [
    debouncedAdditionalContribution,
    vehicleBreakdown.minimumWeeklyContribution,
  ]);

  const handleRemittanceDaySelect = (selectedLabel: string) => {
    setRemittanceMonthDay(selectedLabel);
    const selected = monthDayOptions.find((opt) => opt.label === selectedLabel);
    setRemittanceDayValue(selected?.value || "");
  };

  const isAssetFinance = scheme === "Auto Financing";
  const maxPercentage = scheme === "Weekly Contribution Scheme" ? 0.2 : 0.3;
  const isValidContribution = contributionValue <= maxPercentage * incomeValue;

  const extraContribution = toNumber(additionalWeeklyContribution);

  const totalWeeklyContribution =
    extraContribution + toNumber(vehicleBreakdown.preLoanServiceCharge);

  useEffect(() => {
    const hasFixedError =
      scheme ||
      income ||
      contribution ||
      assetCost ||
      debouncedAdditionalContribution ||
      remittanceWeekDay ||
      remittanceMonthDay;

    if (hasFixedError) {
      setError("");
    }
  }, [
    scheme,
    income,
    contribution,
    assetCost,
    debouncedAdditionalContribution,
    remittanceWeekDay,
    remittanceMonthDay,
  ]);

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
    if (!scheme) {
      setError("Please select a contribution scheme.");
      return;
    }

    if (isAssetFinance) {
      if (!assetCost) {
        setError("Please enter the cost of the vehicle.");
        return;
      }

      if (!debouncedAdditionalContribution.trim()) {
        setError("Please enter your contribution toward the 10% equity.");
        return;
      }

      if (remittanceType === "Weekly" && !remittanceWeekDay) {
        setError("Please select your weekly remittance day.");
        return;
      }

      if (remittanceType === "Monthly" && !remittanceMonthDay) {
        setError("Please select your monthly remittance day.");
        return;
      }
    } else {
      if (!income || !contribution) {
        setError("Please fill in your income and preferred contribution.");
        return;
      }

      if (
        (scheme === "Weekly Contribution Scheme" && !remittanceWeekDay) ||
        (scheme === "Monthly Contribution Scheme" && !remittanceMonthDay)
      ) {
        setError("Please select your remittance day.");
        return;
      }
    }

    if (!isValidContribution && contribution) {
      const maxPercent =
        scheme === "Weekly Contribution Scheme" ? "20%" : "30%";
      setError(`You cannot contribute more than ${maxPercent} of your income.`);
      return;
    }

    const intlPhone = phone?.replace(/^0/, "+234");
    const cost = Number(assetCost?.replace(/,/g, ""));
    const fileName = selfieUri?.split("/").pop();
    const fileExtension = fileName?.split(".").pop()?.toLowerCase();
    const mimeType =
      fileExtension === "jpg" || fileExtension === "jpeg"
        ? "image/jpeg"
        : fileExtension === "png"
        ? "image/png"
        : "";
    const [day, month, year] = dob.split("/");
    const isoDob = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;

    const formData = new FormData();
    formData.append("FullName", String(fullName));
    formData.append("PhoneNumber", String(intlPhone));
    formData.append("Selfie", {
      uri: String(selfieUri),
      name: String(fileName),
      type: String(mimeType),
    } as any);
    formData.append("Selfie", String(selfieUri));
    formData.append("DateOfBirth", String(isoDob));
    formData.append("Gender", String(gender));
    formData.append("Address", String(userAddress));
    formData.append("BVN", String(bvn));
    formData.append("ContributionSchemeId", String(selectedSchemeId));
    formData.append("Income", String(income));
    formData.append("CostOfVehicle", String(cost));
    if (debouncedAdditionalContribution) {
      formData.append(
        "ContributionAmount",
        String(debouncedAdditionalContribution)
      );
    } else {
      formData.append("ContributionAmount", String(contribution));
    }
    formData.append("ContributionAmount", String(contribution));
    formData.append("WeekDay", String(remittanceWeekDay));
    formData.append("MonthDay", String(remittanceDayValue));
    formData.append("WeekDay", String(remittanceWeekDay));
    formData.append("MonthDay", String(remittanceDayValue));
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
        {submitUserDetailsMutation.isPending && (
          <Loader message="Submitting Details" />
        )}
        {regualarBreakdownMutation.isPending && (
          <Loader message="Fetching Regular Breakdown..." />
        )}
        {breakdownMutation.isPending && (
          <Loader message="Fetching Auto Breakdown..." />
        )}
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
                  valueType="money"
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
                    <Input
                      label="User Contribution (Down Payment)"
                      value={`₦${vehicleBreakdown.downPayment}`}
                      keyboardType="phone-pad"
                      editable={false}
                      showInfoIcon={true}
                      infoTitle="User Contribution (Down Payment)"
                      infoContent="10% of total asset value. Paid from user’s savings contribution."
                    />
                    <Input
                      label="Eligible Loan (Principal)"
                      value={`₦${vehicleBreakdown.eligibleLoan}`}
                      keyboardType="phone-pad"
                      editable={false}
                      showInfoIcon={true}
                      infoTitle="Eligible Loan (Principal)"
                      infoContent="90% of total asset value."
                    />
                    <Input
                      label="Loan Management Fee over 4 years"
                      value={`₦${vehicleBreakdown.loanManagementFee}`}
                      keyboardType="phone-pad"
                      editable={false}
                      showInfoIcon={true}
                      infoTitle="Loan Management Fee over 4 years"
                      infoContent="Annually: 6% of Asset Value. 
                      Total for 4 Years: Annual Loan Management Fee × 4"
                    />
                    <Input
                      label="Pre-Loan Service Charge"
                      placeholder="Enter Amount"
                      value={`₦${vehicleBreakdown.preLoanServiceCharge}`}
                      keyboardType="phone-pad"
                      editable={false}
                      showInfoIcon={true}
                      infoTitle="Loan Management Fee over 4 years"
                      infoContent="A monthly server charge as you save up your 10% equity."
                    />
                    <SelectInput
                      label="Remittance Type"
                      value={remittanceType}
                      onSelect={setRemittanceType}
                      placeholder="Choose remittance type for your 10% equity"
                      options={["Weekly", "Monthly"]}
                    />
                    {remittanceType === "Weekly" ? (
                      <SelectInput
                        label="Remittance Day"
                        value={remittanceWeekDay}
                        style={{ marginBottom: resHeight(1) }}
                        onSelect={setRemittanceWeekDay}
                        placeholder="Choose contribution day"
                        options={[
                          "Sunday",
                          "Monday",
                          "Tuesday",
                          "Wednesday",
                          "Thursday",
                          "Friday",
                          "Saturday",
                        ]}
                      />
                    ) : remittanceType === "Monthly" ? (
                      <SelectInput
                        label="Remittance Day"
                        value={remittanceMonthDay}
                        style={{ marginBottom: resHeight(1) }}
                        onSelect={handleRemittanceDaySelect}
                        placeholder="Choose contribution day"
                        options={monthDayOptions.map((opt) => opt.label)}
                      />
                    ) : null}
                    <Input
                      label={`Minimum ${
                        remittanceType === "Weekly" ? "Weekly" : "Monthly"
                      } Contribution`}
                      placeholder="Enter Amount"
                      valueType="money"
                      value={additionalWeeklyContribution}
                      onChangeText={setAdditionalWeeklyContribution}
                      keyboardType="phone-pad"
                      showInfoIcon={true}
                      infoTitle={`Minimum ${
                        remittanceType === "Weekly" ? "Weekly" : "Monthly"
                      } Contribution`}
                      infoContent={`Enter any amount from ₦${vehicleBreakdown.baseContributionAmount} and above to save toward your 10% equity down payment.`}
                      isInvalid={isAdditionalContributionInvalid}
                      errorMessage={
                        isAdditionalContributionInvalid
                          ? `Amount must be ${formatAmount(
                              vehicleBreakdown.baseContributionAmount
                            )} or more.`
                          : undefined
                      }
                    />
                    <Input
                      label={`Total ${
                        remittanceType === "Weekly" ? "Weekly" : "Monthly"
                      } Contribution`}
                      value={`₦${totalWeeklyContribution.toLocaleString()}`}
                      keyboardType="phone-pad"
                      editable={false}
                      showInfoIcon={true}
                      infoTitle="Total Weekly Contribution"
                      infoContent={`Your ${
                        remittanceType === "Weekly" ? "weekly" : "monthly"
                      } contribution plus the pre-loan service charge.`}
                    />
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
                      ? "Weekly Sales Revenue"
                      : "monthly income"
                  }  (NGN)?`}
                  valueType="money"
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
                  valueType="money"
                  value={contribution}
                  onChangeText={setContribution}
                  keyboardType="phone-pad"
                />
                {isValidContribution &&
                  !!contribution &&
                  shouldRenderRegularDetails && (
                    <View style={styles.summaryBox}>
                      <View style={styles.groupText}>
                        <View>
                          <Text style={styles.summaryText}>Principal Loan</Text>
                          <Text style={styles.summarySubText}>
                            {scheme === "Weekly Contribution Scheme"
                              ? "52x of your weekly contribution"
                              : "12x of your monthly contribution"}
                          </Text>
                        </View>
                        <Text style={styles.boldText}>
                          {regularBreakdown.principalLoan}
                        </Text>
                      </View>
                      <View style={styles.groupText}>
                        <View>
                          <Text style={styles.summaryText}>
                            Loan Mgt. Fee (6%)
                          </Text>
                          <Text style={styles.summarySubText}>
                            Loan Mgt. Fee over 4 years
                          </Text>
                        </View>
                        <Text style={styles.boldText}>
                          {regularBreakdown.loanManagementFee}
                        </Text>
                      </View>
                      <View style={styles.groupText}>
                        <View>
                          <Text style={styles.summaryText}>
                            Repayment Duration
                          </Text>
                        </View>
                        <Text style={styles.boldText}>
                          {`${
                            scheme.includes("Weekly")
                              ? "52 weeks/1 yr"
                              : "12 months/1yr"
                          }`}
                        </Text>
                      </View>
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
                          {regularBreakdown.eligibleLoan}
                        </Text>
                      </View>

                      <View style={styles.groupText}>
                        <Text style={styles.summaryText}>Service Charge</Text>
                        <Text style={styles.boldText}>
                          {regularBreakdown.serviceCharge}
                        </Text>
                      </View>
                      <View style={styles.groupText}>
                        <Text style={styles.summaryText}>Total Repayment</Text>
                        <Text style={styles.boldText}>
                          {regularBreakdown.principalLoan}
                        </Text>
                      </View>
                      <View style={{ marginBottom: resHeight(1) }} />
                      {scheme === "Weekly Contribution Scheme" ? (
                        <SelectInput
                          label="Remittance Day"
                          value={remittanceWeekDay}
                          style={{ marginBottom: resHeight(1) }}
                          onSelect={setRemittanceWeekDay}
                          placeholder="Choose contribution day"
                          options={[
                            "Sunday",
                            "Monday",
                            "Tuesday",
                            "Wednesday",
                            "Thursday",
                            "Friday",
                            "Saturday",
                          ]}
                        />
                      ) : (
                        <SelectInput
                          label="Remittance Day"
                          value={remittanceMonthDay}
                          style={{ marginBottom: resHeight(1) }}
                          onSelect={handleRemittanceDaySelect}
                          placeholder="Choose contribution day"
                          options={monthDayOptions.map((opt) => opt.label)}
                        />
                      )}
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
            <View style={{ marginBottom: resHeight(10) }} />
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
    fontFamily: "OutfitRegular",
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
