import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { Image } from "react-native";
import Onboarding from 'react-native-onboarding-swiper';

const OnboardingScreen = () => {
  const router = useRouter();
  const [showUserInfoForm, setShowUserInfoForm] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  return (
    
    <Onboarding
      pages={[

        {
          backgroundColor: '#FFFFFF',
          image: <Image source={require('./modalImages/onboarding1.png')} style={styles.image} />,
          title: '',
          subtitle: '',
        },
        {
          backgroundColor: '#FFFFFF',
          image: <Image source={require('./modalImages/onboarding2.png')} style={styles.image} />,
          title: '',
          subtitle: '',
        },
        {
          backgroundColor: '#FFFFFF',
          image: <Image source={require('./modalImages/onboarding3.png')} style={styles.image} />,
          title: '',
          subtitle: '',
        },
        {
          backgroundColor: '#FFFFFF',
          image: <Image source={require('./modalImages/onboarding4.png')} style={styles.image} />,
          title: '',
          subtitle: '',
        },
        {
          backgroundColor: '#FFFFFF',
          image: <Image source={require('./modalImages/onboarding5.png')} style={styles.image} />,
          title: '',
          subtitle: '',
        },
      ]}
      onDone={() => router.push("/(modals)/onboard2")}
      onSkip={() => router.push("/(modals)/onboard2")}
    />
  );
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain', // Use 'contain' to fit the image inside the container
  },
});

export default OnboardingScreen;
