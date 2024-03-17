import React from 'react';
import { View, Text, ScrollView, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';

const PrivacyPolicyPage = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Link href="/(tabs)/profile" style={styles.closeButton}>
          <Ionicons name="ios-arrow-back" size={24} color="black" />
        </Link>
        <View>
          <Text style={styles.title}>Privacy Policy</Text>
          <Text style={styles.content}>
            Welcome to SkillFolio! We are committed to
            protecting your privacy and ensuring that your personal information
            is handled responsibly. This Privacy Policy outlines how we collect,
            use, and safeguard your personal information when you use our
            website or any of our products and services.
          </Text>

          <Text style={styles.sectionTitle}>Information We Collect</Text>
          <Text style={styles.sectionContent}>
            <Text style={styles.subSectionTitle}>Personal Information</Text>
            {"\n\n"}
            We may collect personal
            information such as your name, email address, and other identifiable
            information when you interact with our website, sign up for our
            services, or contact us.
            {"\n\n"}
            <Text style={styles.subSectionTitle}>Non-Personal Information</Text>
            {"\n\n"}
            We also gather non-personal information, such as browser type, IP address, and
            operating system, to enhance the functionality of our website and
            improve your user experience.
          </Text>

          <Text style={styles.sectionTitle}>How We Use Your Information</Text>
          <Text style={styles.sectionContent}>
            We use the information we collect for various purposes, including:
            {"\n\n"}
            - Providing and improving our services
            {"\n"}
            - Personalizing your experience
            {"\n"}
            - Responding to your inquiries and requests
            {"\n"}
            - Sending periodic emails and updates
            {"\n"}
            - Conducting research and analysis
          </Text>

          <Text style={styles.sectionTitle}>Cookies and Similar Technologies</Text>
          <Text style={styles.sectionContent}>
            We use cookies and similar technologies to enhance your browsing
            experience, analyze usage patterns, and deliver personalized
            content. You can manage your cookie preferences through your browser
            settings.
          </Text>

          <Text style={styles.sectionTitle}>Data Security</Text>
          <Text style={styles.sectionContent}>
            We implement industry-standard security
            measures to protect your personal information from unauthorized
            access, disclosure, alteration, and destruction.
          </Text>

          <Text style={styles.sectionTitle}>Third-Party Links</Text>
          <Text style={styles.sectionContent}>
            Our website may contain links to third-party websites or services.
            Please be aware that we are not responsible for the privacy
            practices of these third parties. We encourage you to read the
            privacy policies of any third-party websites you visit.
          </Text>

          
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 16,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderColor: "white",
  },
  contentContainer: {
    marginBottom: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "black",
  },
  content: {
    fontSize: 12,
    marginBottom: 16,
    color: "black",
    marginRight: 16,
    marginLeft: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 12,
    color: "red",
    marginRight: 16,
    marginLeft: 10,
    marginBottom: 10,
  },
  subSectionTitle: {
    fontSize: 17,
    fontWeight: "bold",
    marginTop: 12,
    color: "black",
    marginRight: 16,
    marginLeft: 10,
    marginBottom: 10,
  },
  sectionContent: {
    fontSize: 12,
    marginBottom: 8,
    color: "black",
    marginRight: 16,
    marginLeft: 22,
  },
  closeButton: {
    position: "absolute",
    top: 2,
    left: 16,
    color: "red",
    zIndex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});

export default PrivacyPolicyPage;
