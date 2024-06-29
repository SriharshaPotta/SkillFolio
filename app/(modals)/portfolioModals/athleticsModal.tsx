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
  let athleticsachievementIDs = new Array();

  const { signOut, isSignedIn } = useAuth();
  const { user } = useUser();
  const [firstName, setFirstName] = useState(user?.firstName);
  const [lastName, setLastName] = useState(user?.lastName);
  const [email, setEmail] = useState(user?.emailAddresses[0].emailAddress);

  const swipeableRef = useRef(null);

  const [athletics, setAthletics] = useState<{ id: number; title: string; description: string; image: string[]; firebaseId: string; }[]>([]);

  const [isAddAthleticModalVisible, setAddAthleticModalVisible] =
    useState(false);

  const [newAthletic, setNewAthletic] = useState({
    title: "",
    description: "",
    image: [],
  });

  const toggleAddAthleticModal = () => {
    setAddAthleticModalVisible(!isAddAthleticModalVisible);
  };

  const [initialDataLoaded, setInitialDataLoaded] = useState(false);

  useEffect(() => {
    const fetchPortfolioData = async () => {
      const userAthleticsRef = collection(userDocRef, "athletics");

      const [athleticsSnapshot] =
        await Promise.all([
          getDocs(userAthleticsRef),
        ]);

      const athleticsData = athleticsSnapshot.docs.map(
        (doc: { id: any; data: () => any }) => ({ id: doc.id, ...doc.data() })
      );

      setAthletics(athleticsData);
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

  const deleteAthletic = async (localId: number, firebaseId: string) => {
    const updatedAthletics = athletics.filter(
      (athletic) => athletic.id !== localId
    );
    setAthletics(updatedAthletics);
    const athleticDocRef = doc(
      collection(userDocRef, "athletics"), firebaseId);
    await deleteDoc(athleticDocRef);
  };

  // RENDER
  const renderAthletics = () => {
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
            deleteAthletic(
              athletics[index].id,
              athletics[index].firebaseId
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
  return athletics.map((athletic, index) => (
    <GestureHandlerRootView key={athletic.id}>
    <Swipeable
      renderRightActions={(progress, dragX) =>
        renderRightActions(progress, dragX, index)
      }
    >
      <View style={styles.card}>
        <View style={styles.athleticContent}>
          <Text style={styles.athleticTitle}>{athletic.title}</Text>
          <Text style={styles.athleticDescription}>
            {athletic.description}
          </Text>
          {Array.isArray(athletic.image) && athletic.image.length > 0 ? (
            athletic.image.map((imageUri, imageIndex) => (
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
            <Text style={styles.title}>Athletic</Text>
            <Text style={styles.title}>Participation</Text>
          </View>
          <View style={styles.section}>
            {renderAthletics()}
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
  athleticContent: {
    flex: 1,
  },
  athleticTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
    fontFamily: "mon-sb",
  },
  athleticDescription: {
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
