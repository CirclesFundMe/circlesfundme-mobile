import { Colors } from "@/constants/Colors";
import { resFont, resHeight, resWidth } from "@/utils/utils";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Keyboard,
  KeyboardTypeOptions,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from "react-native";

interface InputProps {
  label: string;
  value: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  type?: "text" | "date";
  containerStyle?: ViewStyle;
  onPressDate?: () => void;
  isInvalid?: boolean;
  errorMessage?: string;
  maxLength?: number;
  editable?: boolean;
  showInfoIcon?: boolean;
  infoTitle?: string;
  infoContent?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType,
  type,
  containerStyle,
  onPressDate,
  isInvalid,
  errorMessage,
  maxLength,
  editable,
  showInfoIcon = false,
  infoTitle = "",
  infoContent = "",
}) => {
  const [hidePassword, setHidePassword] = useState(secureTextEntry);
  const [modalVisible, setModalVisible] = useState(false);

  const toggleSecureEntry = () => setHidePassword(!hidePassword);

  return (
    <>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={[styles.container, containerStyle]}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>{label}</Text>
            {showInfoIcon && (
              <TouchableOpacity onPress={() => setModalVisible(true)}>
                <Ionicons
                  name="information-circle-outline"
                  size={18}
                  color="#999"
                />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.inputWrapper}>
            <TextInput
              style={[
                styles.input,
                isInvalid && { borderColor: "#FF4C4C" },
                editable === false && { backgroundColor: "#F5F5F5" },
              ]}
              value={value}
              onChangeText={onChangeText}
              placeholder={placeholder}
              placeholderTextColor="#999"
              secureTextEntry={secureTextEntry ? hidePassword : false}
              keyboardType={keyboardType}
              editable={editable ?? type !== "date"}
              maxLength={keyboardType === "phone-pad" ? 11 : maxLength}
              pointerEvents={type === "date" ? "none" : "auto"}
            />

            {secureTextEntry && (
              <TouchableOpacity onPress={toggleSecureEntry} style={styles.icon}>
                <Ionicons
                  name={hidePassword ? "eye-off" : "eye"}
                  size={20}
                  color="#888"
                />
              </TouchableOpacity>
            )}

            {type === "date" && (
              <TouchableOpacity onPress={onPressDate} style={styles.icon}>
                <Ionicons name="calendar-outline" size={20} color="#888" />
              </TouchableOpacity>
            )}
          </View>

          {isInvalid && errorMessage && (
            <Text style={styles.errorText}>{errorMessage}</Text>
          )}
        </View>
      </TouchableWithoutFeedback>

      <Modal transparent visible={modalVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <AntDesign name="closecircleo" size={18} color="black" />
            </TouchableOpacity>
            <Ionicons name="alert-circle-outline" size={60} color="#555" />
            <Text style={styles.modalTitle}>{infoTitle}</Text>
            <Text style={styles.modalSubtitle}>{infoContent}</Text>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: resHeight(1.5),
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    // justifyContent: "space-between",
    gap: 5,
    marginBottom: resHeight(1),
  },
  label: {
    fontWeight: "500",
    fontSize: resFont(12),
    fontFamily: "OutfitRegular",
    color: Colors.dark.background,
  },
  inputWrapper: {
    position: "relative",
    justifyContent: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: resWidth(10),
    backgroundColor: "#FFFFFF",
    fontFamily: "OutfitLight",
    padding: resHeight(2),
    paddingRight: 50,
    color: Colors.dark.background,
  },
  icon: {
    position: "absolute",
    right: 20,
    top: "50%",
    transform: [{ translateY: -10 }],
  },
  errorText: {
    color: "#FF4C4C",
    marginTop: 5,
    fontSize: resFont(11),
    fontFamily: "OutfitRegular",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalCard: {
    backgroundColor: "#fff",
    width: "90%",
    borderRadius: 20,
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: "center",
    position: "relative",
  },
  modalTitle: {
    marginTop: 15,
    fontSize: resFont(13),
    fontWeight: "600",
    textAlign: "center",
    fontFamily: "OutfitRegular",
    color: Colors.dark.background,
  },
  modalSubtitle: {
    marginTop: 8,
    fontSize: resFont(12),
    textAlign: "center",
    color: Colors.dark.textLight,
    fontFamily: "OutfitLight",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 10,
  },
});

export default Input;
