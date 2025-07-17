import PhotoPreviewSection from "@/components/ui/PhotoPreviewSection";
import { Colors } from "@/constants/Colors";
import { AntDesign } from "@expo/vector-icons";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  Button,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Camera() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const router = useRouter();
  const [photo, setPhoto] = useState<any>(null);
  const cameraRef = useRef<CameraView | null>(null);
  const navigation = useNavigation();
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
  } = useLocalSearchParams<{
    fullName: string;
    phone: string;
    dob: string;
    gender: string;
    bvn: string;
    documentUri: string;
    documentName: string;
    documentType: string;
    userAddress: string;
    utilityBillUri: string;
    utilityBillName: string;
    utilityBillType: string;
  }>();

  if (!permission) {
    return <View />;
  }

  if (!permission?.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          Camera permission is required.
        </Text>
        <Button title="Grant Permission" onPress={requestPermission} />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  const handleTakePhoto = async () => {
    if (cameraRef.current) {
      const options = {
        quality: 1,
        base64: true,
        exif: false,
      };
      const takedPhoto = await cameraRef.current.takePictureAsync(options)
      setPhoto(takedPhoto);
    }
  };

  const handleRetakePhoto = () => setPhoto(null);

  const handleProceed = () => {
    router.push({
      pathname: "/sign-up/contribution-scheme",
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
        selfieUri: photo.uri,
        selfieType: photo.mimeType,
      },
    });
  };

  if (photo)
    return (
      <PhotoPreviewSection
        photo={photo}
        handleRetakePhoto={handleRetakePhoto}
        handleProceed={handleProceed}
      />
    );

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        <View style={styles.backButton}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <AntDesign name="arrowleft" size={28} color="white" />
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <AntDesign name="retweet" size={44} color={Colors.dark.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleTakePhoto}>
            <AntDesign name="camera" size={44} color={Colors.dark.primary} />
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  camera: {
    flex: 1,
  },
  permissionContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  permissionText: {
    fontSize: 16,
    marginBottom: 8,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
    marginHorizontal: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 10,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  backButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 30,
    left: 20,
    padding: 8,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    zIndex: 1,
  },
  bottomButton: {
    position: "absolute",
    bottom: 40,
    width: "100%",
    alignItems: "center",
  },
});
