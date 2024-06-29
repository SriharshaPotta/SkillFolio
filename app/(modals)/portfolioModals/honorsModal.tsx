import React, { useEffect, useRef, useState } from "react";
import { View, Text, Button, ScrollView, StyleSheet, Modal, TextInput, TouchableOpacity, SafeAreaView, Animated, Image } from "react-native";
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import { GestureHandlerRootView, Swipeable } from "react-native-gesture-handler";
import { printToFileAsync } from "expo-print";
import { shareAsync } from "expo-sharing";
import { addDoc, collection, deleteDoc, doc, getDocs, onSnapshot } from "firebase/firestore";
import { FIRESTORE_DB } from "firebaseConfig.js";
import { useAuth, useUser } from "@clerk/clerk-expo";
import Colors from "constants/Colors";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Video } from "expo-av";
import { jsPDF } from "jspdf";
import { Link } from "expo-router";

const Portfolio = () => {
  let honorsachievementIDs = new Array();

  const { signOut, isSignedIn } = useAuth();
  const { user } = useUser();
  const [firstName, setFirstName] = useState(user?.firstName);
  const [lastName, setLastName] = useState(user?.lastName);
  const [email, setEmail] = useState(user?.emailAddresses[0].emailAddress);

  const swipeableRef = useRef(null);

  const [honors, setHonors] = useState<{ id: number; title: string; description: string; image: string[]; firebaseId: string; }[]>([]);

  const [isAddHonorModalVisible, setAddHonorModalVisible] =
    useState(false);

  const [newHonor, setNewHonor] = useState({
    title: "",
    description: "",
    image: [],
  });

  const toggleAddHonorModal = () => {
    setAddHonorModalVisible(!isAddHonorModalVisible);
  };

  const [initialDataLoaded, setInitialDataLoaded] = useState(false);

  useEffect(() => {
    const fetchPortfolioData = async () => {
      const userHonorsRef = collection(userDocRef, "honors");

      const [honorsSnapshot] =
        await Promise.all([
          getDocs(userHonorsRef),
        ]);

      const honorsData = honorsSnapshot.docs.map(
        (doc: { id: any; data: () => any }) => ({ id: doc.id, ...doc.data() })
      );

      setHonors(honorsData);
    };

    if (isSignedIn) {
      fetchPortfolioData();
    }
  }, [isSignedIn]); 

  // ADD
  const userCollection = collection(FIRESTORE_DB, "users");
  const userDocRef = doc(userCollection, user?.id);

  const [images, setImages] = useState<string[]>([]);

  const removeImage = (indexToRemove: number) => {
    setImages(images.filter((_, index) => index !== indexToRemove));
  };

  // Function to handle image selection
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const selectedImage = result.assets[0].uri; 
      setImages([...images, selectedImage]);
    }
  };

  const deleteHonor = async (localId: number, firebaseId: string) => {
    const updatedHonors = honors.filter(
      (honor) => honor.id !== localId
    );
    setHonors(updatedHonors);
    const honorDocRef = doc(
      collection(userDocRef, "honors"), firebaseId);
    await deleteDoc(honorDocRef);
  };

  // RENDER
  const renderHonors = () => {
    const renderRightActions = (
      progress: Animated.AnimatedInterpolation<string | number>,
      dragX: Animated.AnimatedInterpolation<string | number>,
      index: number
    ) => {
      const trans = dragX.interpolate({
        inputRange: [0, 50, 100],
        outputRange: [0, 0.5, 1],
      });
      return (
        <TouchableOpacity
          onPress={() =>
            deleteHonor(
              honors[index].id,
              honors[index].firebaseId
            )
          }
        >
          <View style={styles.deleteButton}>
            <Animated.View
              style={{
                transform: [{ translateX: trans }],
              }}
            >
              <FontAwesome5
                name="trash-alt"
                size={20}
                color="red"
                style={styles.deleteIcon}
              />
            </Animated.View>
          </View>
        </TouchableOpacity>
      );
    };
  return honors.map((honor, index) => (
    <GestureHandlerRootView key={honor.id}>
    <Swipeable
      renderRightActions={(progress, dragX) =>
        renderRightActions(progress, dragX, index)
      }
    >
      <View style={styles.card}>
        <View style={styles.honorContent}>
          <Text style={styles.honorTitle}>{honor.title}</Text>
          <Text style={styles.honorDescription}>
            {honor.description}
          </Text>
          {Array.isArray(honor.image) && honor.image.length > 0 ? (
            honor.image.map((imageUri, imageIndex) => (
              <Image
                key={`${index}-${imageIndex}`}
                source={{ uri: imageUri }}
                style={styles.image}
              />
            ))
          ) : (
            <Text></Text>
          )}
        </View>
      </View>
    </Swipeable>
    </GestureHandlerRootView>

  ));
  };

  return (
    <GestureHandlerRootView>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView style={styles.container}>
          <View style={styles.headerContainer}>
            <Link href="/(tabs)/portfolio2" style = {styles.backButton}>
              <Ionicons name="arrow-back-outline" size={24} color="black" />
            </Link>
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Honor</Text>
            <Text style={styles.title}>Classes</Text>
          </View>
          <View style={styles.section}>
            {renderHonors()}
          </View>
          <View style={styles.addButtonContainer}>
          </View>
          <View style={styles.centeredView}>
          </View>
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    left: 10,
    top: -10,
    zIndex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  titleContainer: {
    marginBottom: 10,
    marginTop: -40,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000000', 
  },
  subtitle: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000000', 
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    marginRight: 5,
    marginLeft: 5,
    marginTop: 5,
    shadowOffset: {
      width: 1,
      height: 2,
    },
  },
  honorContent: {
    flex: 1,
  },
  honorTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
    fontFamily: "mon-sb",
  },
  honorDescription: {
    fontFamily: "mon",
  },
  deleteIcon: {
    marginRight: 10, 
  },
  deleteButton: {
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    width: 70,
    height: "90%",
    borderRadius: 20,
    marginTop: 5,
    shadowOffset: {
      width: 1,
      height: 2,
    },
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  image: {
    width: 200,
    height: 150,
    resizeMode: "contain",
    marginVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    marginTop: 10,
  },
  section: {
    marginBottom: 10,
  },
  headerContainer: {
    height: 50,
  },
  addButtonContainer: {
    marginTop: 0,
    shadowColor: "#800080",
    shadowRadius: 10,
  },
});

export default Portfolio;
