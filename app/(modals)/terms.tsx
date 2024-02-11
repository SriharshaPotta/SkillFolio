import React from 'react';
import { View, Text, SafeAreaView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';

const TermsPage = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.title}>Terms of Service</Text>
        <Text style={styles.content}>
          Last Updated: 1/26/24
          {"\n\n"}
          Welcome to Skill Folio! These Terms of Service ("Terms") govern your use of the Skill Folio application , provided by Skill Folio, Inc. . By using the App, you agree to comply with and be bound by these Terms. If you do not agree with these Terms, please do not use the App.
        </Text>

        <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
        <Text style={styles.sectionContent}>
          By using Skill Folio, you agree to comply with these Terms and any additional terms provided within the App. If you do not agree to these Terms, please refrain from using the App.
        </Text>

        <Text style={styles.sectionTitle}>2. Account Registration</Text>
        <Text style={styles.sectionContent}>
          To use certain features of the App, you may be required to create an account. You agree to provide accurate, current, and complete information during the registration process. You are responsible for maintaining the confidentiality of your account and password, and you agree to accept responsibility for all activities that occur under your account.
        </Text>

        <Text style={styles.sectionTitle}>3. User Content</Text>
        <Text style={styles.sectionContent}>
          Skill Folio allows users to create and share portfolios. You retain ownership of the content you create and share on the App ("User Content"). By using the App, you grant Skill Folio a worldwide, non-exclusive, royalty-free, sublicensable, and transferable license to use, reproduce, distribute, prepare derivative works of, display, and perform your User Content in connection with the App.
        </Text>

        {/* Add more sections as needed */}

        {/* Back Button */}
        <Link href="/(tabs)/profile">
          <Ionicons name="ios-close" size={30} color="black" style={styles.closeButton} />
        </Link>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingHorizontal: 20, 
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  content: {
    fontSize: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 12,
  },
  sectionContent: {
    fontSize: 16,
    marginBottom: 8,
  },
  closeButton: {
    marginTop: 20,
  },
});



export default TermsPage;
