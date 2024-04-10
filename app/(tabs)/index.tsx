import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  Button,
  ScrollView,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Animated,
} from "react-native";
import * as ImagePicker from 'expo-image-picker'; // Import ImagePicker
import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { Swipeable } from "react-native-gesture-handler";
import { printToFileAsync } from "expo-print";
import { shareAsync } from "expo-sharing";
import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { FIRESTORE_DB } from "../../firebaseConfig";
import { useAuth, useUser } from "@clerk/clerk-expo";
import Colors from "constants/Colors";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Video } from "expo-av";
import { jsPDF } from "jspdf";

const Portfolio = () => {
  let feedsfeedIDs = new Array();

  const { signOut, isSignedIn } = useAuth();
  const { user } = useUser();
  const [firstName, setFirstName] = useState(user?.firstName);
  const [lastName, setLastName] = useState(user?.lastName);
  const [email, setEmail] = useState(user?.emailAddresses[0].emailAddress);

  const swipeableRef = useRef(null);

  const [feeds, setFeeds] = useState<
    {
      id: number;
      title: string;
      description: string;
      userName: string | undefined | null;
      userId: string | undefined | null;
      userProfileImageUrl: string | undefined | null;
      likes: number;
      likedBy: string[];
      dateAdded: string;
      image: string[];
      firebaseId: string;
    }[]
  >([
    {
      id: 1,
      title: "FBLA 1st Place at SLC",
      description:
        "I was honored to have the opportunity to compete at Future Business Leaders of America's (FBLA) Texas State Conference. While there, I competed in the Mobile Application Development event, and maganged to place 1st. I am truly thankfull for all those who have helped me on this journey. I can't wait to now compete at the National Leadership Conference in Orlando, Florida this Summer!!",
      userName: user?.fullName,
      userId: user?.id,
      userProfileImageUrl: user?.profileImageUrl,
      firebaseId: "",
      likes: 0,
      image: [],
      likedBy: [],
      dateAdded: "",
    },
    {
      id: 2,
      title: "Technology Student Association State Vice President Election",
      description:
        "I will running for the Texas TSA State Vice President this April! No matter the outcome, I am thankfull for all the people who have given me this opportunity. This really couldn't have happen without your help and continued support. Thanks!",
      userName: user?.fullName,
      userId: user?.id,
      userProfileImageUrl: user?.profileImageUrl,
      firebaseId: "",
      likes: 0,
      image: [],
      likedBy: [],
      dateAdded: "",
    },
    {
      id: 3,
      title: "HOSA ILC",
      description:
        "I am excited to inform everyone that I will attending HOSA, Future Health Professionals, International Leadership Conference (ILC), this Summer, in Dallas, Texas!",
      userName: user?.fullName,
      userId: user?.id,
      userProfileImageUrl: user?.profileImageUrl,
      firebaseId: "",
      likes: 0,
      image: [],
      likedBy: [],
      dateAdded: "",
    },
  ]);

  const [isAddFeedModalVisible, setAddFeedModalVisible] = useState(false);

  const [newFeed, setNewFeed] = useState({
    title: "",
    description: "",
    userName: user?.fullName,
    userId: user?.id,
    userProfileImageUrl: user?.profileImageUrl,
    likes: 0,
    likedBy: [],
    image: [],
    dateAdded: "",
  });
  const [images, setImages] = useState<string[]>([]); // Declare type as an array of strings
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
        const selectedImage = result.assets[0].uri; // Using assets array to access selected image
        setImages([...images, selectedImage]);
      }
    };

  const userId = user?.id ? user.id : "";
  const likePost = async (index: number) => {
    const updatedFeeds = [...feeds];
    const feed = updatedFeeds[index];

    // Ensure userId is initialized
    const userId = user?.id ? user.id : "";

    console.log("Feed:", feed);
    console.log("UserId:", userId);

    // Toggle like state
    if (feed && feed.likedBy && userId) {
      if (feed.likedBy.includes(userId)) {
        // If already liked, unlike the post
        feed.likes -= 1;
        feed.likedBy = feed.likedBy.filter((id) => id !== userId);
      } else {
        // If not liked, like the post
        feed.likes += 1;
        feed.likedBy.push(userId);
      }

      setFeeds(updatedFeeds);

      const feedDocRef = doc(collection(userDocRef, "public"), feed.firebaseId);
      await updateDoc(feedDocRef, { likedBy: feed.likedBy });
      await updateDoc(feedDocRef, { likes: feed.likes });
    }
  };

  const toggleAddFeedModal = () => {
    setAddFeedModalVisible(!isAddFeedModalVisible);
  };

  const [initialDataLoaded, setInitialDataLoaded] = useState(false);

  useEffect(() => {
    const fetchPortfolioData = async () => {
      // Fetch portfolio data from Firestore using userDocRef
      const userFeedsRef = collection(userDocRef, "public");
      const [feedsSnapshot] = await Promise.all([getDocs(userFeedsRef)]);

      const feedsData = feedsSnapshot.docs.map(
        (doc: { id: any; data: () => any }) => ({ id: doc.id, ...doc.data() })
      );
      // Update state with fetched data
      setFeeds(feedsData);
    };

    if (isSignedIn) {
      fetchPortfolioData();
    }
  }, [isSignedIn]); // Add dependencies as needed

  // ADD
  const userCollection = collection(FIRESTORE_DB, "public");
  const userDocRef = doc(userCollection, "public");

  const addFeed = async () => {
    if (newFeed.title && newFeed.description) {
      const feedData = {
        title: newFeed.title,
        description: newFeed.description,
        userName: user?.fullName,
        userId: user?.id,
        userProfileImageUrl: user?.profileImageUrl,
        likes: 0,
        image: images,
        likedBy: [],
        dateAdded: Date().substring(4, 15),
      };
      const feedDocRef = await addDoc(
        collection(userDocRef, "public"),
        feedData
      );
      const firebaseId = feedDocRef.id;
      setFeeds([...feeds, { id: feeds.length + 1, firebaseId, ...feedData }]);
      setNewFeed({
        title: "",
        description: "",
        userName: "",
        userId: "",
        image: [],
        userProfileImageUrl: "",
        likes: 0,
        likedBy: [],
        dateAdded: "",
      });
      toggleAddFeedModal();
    }
  };
  //DELETE
  const deleteFeed = async (localId: number, firebaseId: string) => {
    const updatedFeeds = feeds.filter((feed) => feed.id !== localId);
    setFeeds(updatedFeeds);
    const feedDocRef = doc(collection(userDocRef, "public"), firebaseId);
    await deleteDoc(feedDocRef);
  };
  // RENDER
  const renderFeeds = () => {
    const renderRightActions = (
      progress: Animated.AnimatedInterpolation<string | number>,
      dragX: Animated.AnimatedInterpolation<string | number>,
      index: number
    ) => {
      const trans = dragX.interpolate({
        inputRange: [0, 50, 100],
        outputRange: [0, 0.5, 1],
      });
      if (user?.id === feeds[index].userId) {
        return (
          <TouchableOpacity
            onPress={() => deleteFeed(feeds[index].id, feeds[index].firebaseId)}
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
      } else {
        // If the current user is not the owner, return null to hide the delete button
        return null;
      }
    };
    return feeds.map((feed, index) => (
      <Swipeable
        key={feed.id}
        renderRightActions={(progress, dragX) =>
          renderRightActions(progress, dragX, index)
        }
      >
        <View style={styles.card}>
          <View style={styles.feedContent}>
            <View style={{ flexDirection: "row" }}>
              <Image
                source={
                  user?.profileImageUrl
                    ? { uri: feed.userProfileImageUrl }
                    : require("app/(tabs)/tabsImages/blankProfile.jpg")
                }
                style={styles.previewImage}
              />

              <Text style={styles.userName}> {feed.userName}</Text>
            </View>
            <Text style={styles.date}> {feed.dateAdded}</Text>
            <Text style={styles.feedTitle}>{feed.title}</Text>
            <Text style={styles.feedDescription}>{feed.description}</Text>
            {Array.isArray(feed.image) && feed.image.length > 0 ? (
              feed.image.map((imageUri, imageIndex) => (
                <Image
                  key={`${index}-${imageIndex}`}
                  source={{ uri: imageUri }}
                  style={styles.image}
                />
              ))
            ) : (
              <Text></Text>
            )}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <TouchableOpacity onPress={() => likePost(index)}>
                <Ionicons
                  name={
                    feed.likedBy.includes(userId) ? "heart" : "heart-outline"
                  }
                  size={20}
                  color={
                    feed.likedBy.includes(userId) ? Colors.primary : "black"
                  }
                ></Ionicons>
              </TouchableOpacity>
              <Text style={{ marginLeft: 5 }}>{feed.likes}</Text>
            </View>
          </View>
        </View>
      </Swipeable>
    ));
  };

  return (
    // MY PORTFOLIO
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>My Feed</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={toggleAddFeedModal}
          >
            <FontAwesome5
              name="plus"
              size={20}
              color="fff"
              style={styles.addButtonIcon}
            />
          </TouchableOpacity>
        </View>
        {/* Feeds */}
        <View style={styles.section}>{renderFeeds()}</View>
        {/* Posting Modal*/}
        <Modal visible={isAddFeedModalVisible} animationType="slide">
          <ScrollView>
          <SafeAreaView style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Whats On Your Mind?</Text>
            <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
              <Text style={styles.uploadButtonText}>Upload Images</Text>
            </TouchableOpacity>
            <ScrollView
              horizontal={true}
              style={styles.imageScrollView}
              showsHorizontalScrollIndicator={true}
            >
              {images.map((image, index) => (
                <View key={index} style={styles.imageContainer}>
                  <Image source={{ uri: image }} style={styles.image} />
                  <TouchableOpacity
                    onPress={() => removeImage(index)}
                    style={styles.removeButton}
                  >
                    <Ionicons
                      name="close-circle-outline"
                      size={24}
                      color="#FF385C"
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
            <TextInput
              style={styles.input}
              placeholder="Add a Title ..."
              placeholderTextColor="#A9A9A9"
              onChangeText={(text) => setNewFeed({ ...newFeed, title: text })}
              value={newFeed.title}
            />
            <TextInput
              style={[styles.input, styles.multilineInput]}
              placeholder="Add a Description ..."
              onChangeText={(text) =>
                setNewFeed({ ...newFeed, description: text })
              }
              value={newFeed.description}
              multiline
            />
            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity style={styles.modalButton} onPress={addFeed}>
                <Text style={styles.modalButtonText}>Post</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={toggleAddFeedModal}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
          </ScrollView>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 20,
  },
  headerText: {
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
    fontFamily: "mon-b",
  },
  section: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 17,
    textAlign: "center",
    fontFamily: "mon-b",
  },
  card: {
    borderRadius: 0,
    padding: 0,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 10,
    marginRight: 0,
    marginLeft: 0,
    marginTop: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#d3d3d3",
  },
  feedItem: {
    fontFamily: "mon",
  },
  feedContent: {
    flex: 1,
  },
  feedTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    fontFamily: "mon-sb",
  },
  feedDescription: {
    fontFamily: "mon",
    marginBottom: 15,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 60,
    textAlign: "center",
    fontFamily: "mon-b",
    marginTop: 35,
    
  },
  modalButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 15,
    marginRight: 15,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "mon-b",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 2,
    marginBottom: 20,
    paddingLeft: 10,
    borderRadius: 10,
    fontFamily: "mon",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 15,
    marginRight: 15,
    textAlignVertical: "top",
  },
  multilineInput: {
    height: 100,
    textAlignVertical: "top",
  },
  addButtonContainer: {
    marginTop: 0,
  },
  addButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonIcon: {
    color: "#fff",
  },
  addButtonLabel: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "mon-b",
  },
  deleteIcon: {
    marginRight: 10, // Adjust spacing between feed content and delete icon
  },
  generatePDFButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "mon-b",
  },
  deleteButton: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    width: 100,
  },
  trashIcon: {
    marginLeft: 10,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 24,
  },
  previewImage: {
    width: 30,
    height: 30,
    marginBottom: 20,
    borderRadius: 8,
  },
  imagePickerButton: {
    backgroundColor: "#3498db",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 20,
  },
  date: {
    marginTop: -35,
    marginBottom: 10,
    marginLeft: 41,
  },
  imagePickerButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  imageUploadBox: {
    height: 200,
    borderWidth: 1,
    borderColor: "#ccc",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
    fontFamily: "mon-sb",
    marginBottom: 20,
    marginTop: -5,
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: "cover",
    marginBottom: 10,
    borderRadius: 10,
    marginTop: 20,
  },
  imageContainer: {
    position: "relative",
    marginLeft: 19,
    marginRight: 19,
    flexDirection: "row",
  },
  removeButton: {
    position: "absolute",
    top: 29,
    right: 5,
  },
  uploadButtonText: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
  },
  imageScrollView: {
    flexDirection: "row",  },
  removeButtonText: {
    color: "white",
  },
  uploadButton: {
    backgroundColor: "white", // Custom color
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 10,
    borderColor: "black", // Add black border color
    borderWidth: 1, // Add border width
    marginHorizontal: 10,
  },
});

export default Portfolio;
