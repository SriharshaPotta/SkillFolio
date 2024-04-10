import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  SafeAreaView,
  TextInput,
} from "react-native";
import { useAuth, useUser } from "@clerk/clerk-expo";
import Colors from "constants/Colors";
import { useRouter } from "expo-router";

const UpdateUserInfo = () => {
  const router = useRouter();

  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const [firstName, setFirstName] = useState(user?.firstName);
  const [lastName, setLastName] = useState(user?.lastName);
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    if (!user) return;

    setFirstName(user.firstName);
    setLastName(user.lastName);
  }, [user]);

  const handleUpdateUserInfo = async () => {
    try {
      if (!firstName || !lastName) {
        console.error("Please fill in all fields.");
        return;
      }
      await user?.update({
        firstName,
        lastName,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setEdit(false);
    }
    router.push("/(tabs)/profile");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.heading}>Let's Get Started</Text>

        <TextInput
          style={styles.inputField}
          placeholder="First Name"
          value={firstName || ""}
          onChangeText={setFirstName}
        />

        <TextInput
          style={styles.inputField}
          placeholder="Last Name"
          value={lastName || ""}
          onChangeText={setLastName}
        />

        <Button
          title="Update Information"
          onPress={handleUpdateUserInfo}
          color={Colors.primary}
          disabled={!isSignedIn}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff", // Adding a background color here
  },
  innerContainer: {
    width: "80%", // Adjusted width to make the content look centered
  },
  heading: {
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 54,
    textAlign: "center", // Centered the text
  },
  inputField: {
    height: 44,
    borderWidth: 1,
    borderColor: "#ABABAB",
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
});

export default UpdateUserInfo;
