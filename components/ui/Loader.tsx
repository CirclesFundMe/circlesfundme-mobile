import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

type LoaderProps = {
  size?: number | "small" | "large";
  color?: string;
};

const Loader = ({ size = "large", color = "#069E6B" }: LoaderProps) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
});

export default Loader;
