import { View, StyleSheet, TextInput, Button, TouchableOpacity, Text } from "react-native";
import React, { useState } from "react";
import { Stack, router, useNavigation } from "expo-router";
import { useSignIn } from "@clerk/clerk-expo";
import { Ionicons } from '@expo/vector-icons';
import Colors from 'constants/Colors';

const PwReset = () => {
  const navigation = useNavigation();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [successfulCreation, setSuccessfulCreation] = useState(false);
  const { signIn, setActive } = useSignIn();

  // Request a password reset code by email
  const onRequestReset = async () => {
    try {
      await signIn?.create({
        strategy: "reset_password_email_code",
        identifier: emailAddress,
      });
      setSuccessfulCreation(true);
    } catch (err: any) {
      alert(err.errors[0]?.message);
    }
  };

  // Reset the password with the code and the new password
  const onReset = async () => {
    try {
      const result = await signIn?.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password,
      });
      console.log(result);
      alert("Password reset successfully");
      router.back();

      // Set the user session active, which will log in the user automatically
      setActive && (await setActive({ session: result?.createdSessionId }));
    } catch (err: any) {
      alert(err.errors[0]?.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      {!successfulCreation && (
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="ios-close" size={32} color={Colors.primary} />
        </TouchableOpacity>
      )}

      {!successfulCreation && (
        <>
          <TextInput
            autoCapitalize="none"
            placeholder="example@example.com"
            value={emailAddress}
            onChangeText={setEmailAddress}
            style={[styles.inputField, { borderColor: Colors.primary }]}
          />

          <Button
            onPress={onRequestReset}
            title="Send Reset Email"
            color={Colors.primary}
          />
        </>
      )}

      {successfulCreation && (
        <>
          <View>
            <TextInput
              value={code}
              placeholder="Code..."
              placeholderTextColor="#A9A9A9"
              style={[styles.inputField, { borderColor: Colors.primary }]}
              onChangeText={setCode}
            />
            <TextInput
              placeholder="New password"
              placeholderTextColor="#A9A9A9"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={[styles.inputField, { borderColor: Colors.primary }]}
            />
          </View>
          <Button
            onPress={onReset}
            title="Set new Password"
            color={Colors.primary}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  inputField: {
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    fontFamily: "mon",
    backgroundColor: "#fff",
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    padding: 10,
  },
});

export default PwReset;
