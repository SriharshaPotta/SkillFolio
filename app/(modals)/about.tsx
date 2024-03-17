import React from 'react';
import { View, Text, ScrollView, SafeAreaView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';

const AboutPage = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Link href="/(tabs)/profile" style={styles.closeButton}>
          <Ionicons name="ios-arrow-back" size={24} color="black" />
        </Link>
        <View>
          <Text style={styles.title}>About SkillFolio</Text>
          <Text style={styles.content}>
            SkillFolio, a groundbreaking multi-platform application, revolutionizes the way high school students document and showcase their educational journey. With a focus on providing a centralized platform, SkillFolio enables users to effortlessly display their academic accomplishments, performing arts talents, club involvements, and more in a comprehensive portfolio. Users can log in using email, Google, Apple, or Facebook authentication, with an added layer of security through email verification. The profile page allows for easy editing of usernames, viewing account information, managing push notifications, and connecting with social media accounts. On the Portfolio Page, users can meticulously add and remove various aspects of their high school experience, including academic achievements, athletic participation, performing arts experience, club memberships, community service hours, and honors classes, culminating in a shareable or downloadable PDF portfolio. SkillFolio, a game-changer in the fast-paced high school landscape, empowers students to stand out in the competitive arena with a visually compelling representation of their unique journey.
          </Text>

          <Text style={styles.sectionTitle}>Features</Text>
          <Text style={styles.sectionContent}>
            - Designed for Android and iOS devices
            {"\n"}- Options to login and signup with email and password or through Google, Apple, or Facebook
            {"\n"}- Secure entry system & authentication, email verification
            {"\n"}- Links to SkillFolio social media pages
            {"\n"}- Profile customization (Name, Profile Picture, etc.)
            {"\n"}- Portfolio development interface in which users can remove/add a variety of activities
            {"\n"}- Portfolio download/export as PDF
            {"\n"}- Built-in sharing options for easy distribution of the portfolio
            {"\n"}- Push notifications
          </Text>

          <Text style={styles.sectionTitle}>Tools and Technologies</Text>
          <Text style={styles.sectionContent}>
            - Github: An online source hosting service based around the Git version control system. We utilized Github to store source code revisions during this project.
            {"\n"}- SmartSheet: Used to enhance organizational efficiency during the development of the app, ensuring a streamlined and structured approach to project management.
            {"\n"}- Firebase: Used for seamless and effective database management allowing for robust and scalable data infrastructure.
            {"\n"}- Clerk: Used for the implementation of secure authentication and user account functionality.
            {"\n"}- Microsoft Visual Studio 2023: IDE for developing the React Native application in TypeScript.
            {"\n"}- Balsamiq: Used to create wireframes and UI mockups as a reference in developing the application.
            {"\n"}- React Native: A JavaScript framework employed for cross-platform mobile app development. Leveraging its efficiency and flexibility, we crafted a seamless user experience while maintaining code reusability across iOS and Android platforms.
          </Text>

          <Text style={styles.sectionTitle}>References</Text>
          <Text style={styles.sectionContent}>
            - FBLA-PBL: www.fbla-pbl.org/
            {"\n"}- FBLA Competitive Event Guidelines: Mobile Application Development: connect.fbla.org/headquarters/files/High%20School%20Competitive%20Events%20Resources/Individual%20Guidelines/Presentation%20Events/Mobile-Application-Development.pdf
          </Text>

          <Text style={styles.sectionTitle}>License</Text>
          <Text style={styles.sectionContent}>
            The MIT License (MIT) Copyright (c) 2024 Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
            </Text>

        <Text style={styles.sectionTitle}>Contact Information</Text>
        <Text style={styles.sectionContent}>
          If you have any questions or concerns, please contact us at skillfolio@gmail.com.
        </Text>

        <Text style={styles.thankYou}>Thank you for choosing SkillFolio!</Text>
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
  thankYou: {
    fontSize: 18,
    fontFamily: 'mon-sb',
    textAlign: 'center',
    marginTop: 16,
    },
});

export default AboutPage;