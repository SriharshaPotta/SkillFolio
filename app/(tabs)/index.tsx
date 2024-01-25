import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { Link } from 'expo-router';

const Page = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.developmentText}>Coming Soon!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  developmentText: {
    fontSize: 35,
    fontWeight: 'bold',
    fontFamily: 'mon-sb',
    marginBottom: 20,
  },
});

export default Page;
