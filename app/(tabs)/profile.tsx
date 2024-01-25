import { View, Text, Button, Image, StyleSheet, SafeAreaView, TouchableOpacity, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useAuth, useUser } from '@clerk/clerk-expo'
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { defaultStyles } from 'constants/styles';
import Colors from 'constants/Colors';
import * as ImagePicker from 'expo-image-picker';


const Page = () => {
  const{ signOut, isSignedIn } = useAuth();
  const{ user }= useUser();
  const[firstName, setFirstName] =useState(user?.firstName);
  const[lastName, setLastName] = useState(user?.lastName);
  const[email, setEmail] = useState(user?.emailAddresses[0].emailAddress);
  const[edit, setEdit] = useState(false);

  const [isBellPressed, setIsBellPressed] = useState(false);

  useEffect(() => {
    if(!user) return;

    setFirstName(user.firstName);
    setLastName(user.lastName);
    setEmail(user.emailAddresses[0].emailAddress);
  }, [user]);

  const onSaveUser =async() => {
    try{
      if(!firstName || !lastName) return;
      await user?.update({
        firstName,
        lastName,
      })
    } catch(err) {
      console.error(err);
    } finally {
      setEdit(false); 
    }
  }

  const onCaptureImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.75,
      base64: true,
    });

    if (!result.canceled) {
      const base64 = `data:image/png;base64,${result.assets[0].base64}`;
      user?.setProfileImage({
        file: base64,
      });
    }
  };



  return (
    <SafeAreaView style={defaultStyles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Profile</Text>
        <TouchableOpacity onPress={() => setIsBellPressed(!isBellPressed)}>
          <Ionicons
            name={isBellPressed ? "notifications" : "notifications-outline"}
            size={26}
            color={Colors.primary}
          />
        </TouchableOpacity>
      </View>

      {user && (
        <View style={styles.card}>
          <TouchableOpacity onPress={onCaptureImage}>
            <Image source={{ uri: user?.imageUrl }} style={styles.avatar} />
          </TouchableOpacity>
          <View style={{ flexDirection: "row", gap: 6 }}>
            {!edit && (
              <View style={styles.editRow}>
                <Text style={{ fontFamily: "mon-b", fontSize: 22 }}>
                  {firstName} {lastName}
                </Text>
                <TouchableOpacity onPress={() => setEdit(true)}>
                  <Ionicons
                    name="create-outline"
                    size={24}
                    color={Colors.dark}
                  />
                </TouchableOpacity>
              </View>
            )}
            {edit && (
              <View style={styles.editRow}>
                <TextInput
                  placeholder="First Name"
                  value={firstName || ""}
                  onChangeText={setFirstName}
                  style={[defaultStyles.inputField, { width: 100 }]}
                />
                <TextInput
                  placeholder="Last Name"
                  value={lastName || ""}
                  onChangeText={setLastName}
                  style={[defaultStyles.inputField, { width: 100 }]}
                />
                <TouchableOpacity onPress={onSaveUser}>
                  <Ionicons
                    name="checkmark-outline"
                    size={24}
                    color={Colors.dark}
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>
          <Text>{email}</Text>
          <Text>Since {user?.createdAt!.toLocaleDateString()}</Text>
        </View>
      )}
      <Text style={styles.connectText}>Connect with us!</Text>
      <View style={{ flexDirection: "row", justifyContent: "center", gap: 20, marginTop: 15, marginBottom: 15,}}>
        <Link href="https://www.facebook.com/profile.php?id=61555494354487">
          <Ionicons
            name="logo-facebook"
            size={24}
            style={[styles.icons, { marginRight: 20 }]}
          />
        </Link>
        <Link href="https://twitter.com/SkillFolioFbla">
          <Ionicons
            name="logo-twitter"
            size={24}
            style={[styles.icons, { marginRight: 20 }]}
          />
        </Link>
        <Link href="https://www.instagram.com/skillfoliofbla/">
          <Ionicons name="logo-instagram" size={24} style={styles.icons} />
        </Link>
      </View>

      <Link href={"/(modals)/login"} asChild>
        {isSignedIn && (
          <Button
            title="Log Out"
            onPress={() => signOut()}
            color={Colors.primary}
          />
        )}
      </Link>

      {!isSignedIn && (
        <Link href={"/(modals)/login"} asChild>
          <Button title="Log in" color={Colors.dark} />
        </Link>
      )}
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
  },
  header: {
    fontFamily: 'mon-b',
    fontSize: 24,
  },
  icons: {
    marginTop: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    marginHorizontal: 24,
    marginTop: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: {
      width: 1,
      height: 2,
    },
    alignItems: 'center',
    gap: 14,
    marginBottom: 24,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.grey,
  },
  editRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  connectText: {
    textAlign: 'center',
    fontFamily: "mon-sb",
    color: "#3B3C43",
    fontSize: 20,
  }
});


export const getFirstName = () => {
  const { user } = useUser();
  return user?.firstName || "";
};

export default Page