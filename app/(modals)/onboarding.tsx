import React from "react";
import {StyleSheet} from "react-native";
import { View, Text, Image, TouchableOpacity } from "react-native";
import Swiper from "react-native-swiper";
import { Stack, useRouter } from "expo-router";

const onboarding = () => {
    const router = useRouter();
    const closeInstructions = () => {
        router.push("/(tabs)/profile");
  };

  return (
    <View style={styles.container}>
      <Swiper style={styles.wrapper} showsButtons={false} loop={false}>
        <View style={styles.slide}>
          <Image source={require("./appLogo.png")} style={styles.image} />
        </View>
        <View style={styles.slide}>
          <Image source={require("./appLogo.png")} style={styles.image} />
        </View>
        <View style={styles.slide}>
          <Image source={require("./appLogo.png")} style={styles.image} />
        </View>
        <View style={styles.slide}>
          <Image source={require("./appLogo.png")} style={styles.image} />
        </View>
        <View style={styles.slide}>
          <Image source={require("./appLogo.png")} style={styles.image} />
        </View>
        <View style={styles.slide}>
          <Image source={require("./appLogo.png")} style={styles.image} />
        </View>
        <View style={styles.slide}>
            <TouchableOpacity style={styles.closeButton} onPress={closeInstructions}>
                <Text style={styles.closeButtonText}>Close Instructions</Text>
            </TouchableOpacity>
      </View>
    </Swiper>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {},
  slide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  closeButton: {
    position: "absolute",
    verticalAlign: "middle",
    alignSelf: "center",
    padding: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 10,
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
  },
});

export default onboarding;