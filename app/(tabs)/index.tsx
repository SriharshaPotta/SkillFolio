import React, { useEffect, useRef, useState } from "react";
import {View, Text, Image, Button, ScrollView, StyleSheet, Modal, TextInput, TouchableOpacity, SafeAreaView, Animated,} from "react-native";
import {FontAwesome5, Ionicons, MaterialCommunityIcons,} from "@expo/vector-icons";
import { Swipeable } from "react-native-gesture-handler";
import { printToFileAsync } from "expo-print";
import { shareAsync } from "expo-sharing";
import {addDoc, collection, deleteDoc, doc, getDocs, onSnapshot, updateDoc,} from "firebase/firestore";
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

  const [feeds, setFeeds] = useState([
    {
      id: 1,
      title: "FBLA 1st Place at SLC",
      description:
        "I was honored to have the opportunity to compete at Future Business Leaders of America's (FBLA) Texas State Conference. While there, I competed in the Mobile Application Development event, and maganged to place 1st. I am truly thankfull for all those who have helped me on this journey. I can't wait to now compete at the National Leadership Conference in Orlando, Florida this Summer!!",
      userName: user?.fullName,
      userProfileImageUrl: user?.profileImageUrl,
      firebaseId: "",
      likes: 0,
      likedBy: ["hello"],
    },
    {
      id: 2,
      title: "Technology Student Association State Vice President Election",
      description:
        "I will running for the Texas TSA State Vice President this April! No matter the outcome, I am thankfull for all the people who have given me this opportunity. This really couldn't have happen without your help and continued support. Thanks!",
      userName: user?.fullName,
      userProfileImageUrl: user?.profileImageUrl,
      firebaseId: "",
      likes: 0,
      likedBy: ["hello"],
    },
    {
      id: 3,
      title: "HOSA ILC",
      description:
        "I am excited to inform everyone that I will attending HOSA, Future Health Professionals, International Leadership Conference (ILC), this Summer, in Dallas, Texas!",
      userName: user?.fullName,
      userProfileImageUrl: user?.profileImageUrl,
      firebaseId: "",
      likes: 0,
      likedBy: ["hello"],
    },
  ]);

  const [isAddFeedModalVisible, setAddFeedModalVisible] =
    useState(false);

  const [newFeed, setNewFeed] = useState({
    title: "",
    description: "",
    userName: user?.fullName,
    userProfileImageUrl: user?.profileImageUrl,
    likes: 0,
    likedBy: [],
  });

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
      await updateDoc(feedDocRef, { likes: feed.likes});
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
      const [
        feedsSnapshot,

      ] = await Promise.all([
        getDocs(userFeedsRef),
      ]);

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
      userProfileImageUrl: user?.profileImageUrl,
      likes: 0,
      likedBy: [],
    };
    const feedDocRef = await addDoc(collection(userDocRef, "public"), feedData);
    const firebaseId = feedDocRef.id;
    setFeeds([
      ...feeds,
      { id: feeds.length + 1, firebaseId, ...feedData },
    ]);
    setNewFeed({ title: "", description: "", userName: "", userProfileImageUrl: "", likes: 0, likedBy: [],});
    toggleAddFeedModal();
  }
};



  //DELETE
  const deleteFeed = async (localId: number, firebaseId: string) => {
    const updatedFeeds = feeds.filter(
      (feed) => feed.id !== localId
    );
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
      return (
        <TouchableOpacity
          onPress={() =>
            deleteFeed(
              feeds[index].id,
              feeds[index].firebaseId
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
    return feeds.map((feed, index) => (
      <Swipeable
        key={feed.id}
        renderRightActions={(progress, dragX) =>
          renderRightActions(progress, dragX, index)
        }
      >
        <View style={styles.card}>
          <View style={styles.feedContent}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
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
            <Text style={styles.feedTitle}>{feed.title}</Text>
            <Text style={styles.feedDescription}>{feed.description}</Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity onPress={() => likePost(index)}>
            <Ionicons
                name={
                  feed.likedBy.includes(userId)
                    ? "heart"
                    : "heart-outline"
                }
                size={20}
                color={feed.likedBy.includes(userId) ? Colors.primary : "black"}
              ></Ionicons>  
            </TouchableOpacity>
            <Text style={{marginLeft: 5}}>{feed.likes}</Text>
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
          <TouchableOpacity style={styles.addButton} onPress={toggleAddFeedModal}>
            <FontAwesome5 name="plus" size={20} color="fff" style={styles.addButtonIcon} />
          </TouchableOpacity>
        </View>
{/* Feeds */}
        <View style={styles.section}>
          {renderFeeds()}
        </View>
{/* Posting Modal*/}
        <Modal visible={isAddFeedModalVisible} animationType="slide">
          <SafeAreaView style={styles.modalContainer}>
            <Text style={styles.modalTitle}>What's On Your Mind?</Text>
            <TextInput
              style={styles.input}
              placeholder="Feed Title"
              placeholderTextColor="#A9A9A9"
              onChangeText={(text) =>
                setNewFeed({ ...newFeed, title: text })
              }
              value={newFeed.title}
            />
            <TextInput
              style={[styles.input, styles.multilineInput]}
              placeholder="Feed Description"
              onChangeText={(text) =>
                setNewFeed({ ...newFeed, description: text })
              }
              value={newFeed.description}
              multiline
            />
            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={addFeed}
              >
                <Text style={styles.modalButtonText}>
                  Post
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={toggleAddFeedModal}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
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
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    marginRight: 5,
    marginLeft: 5,
    marginTop: 5,
    shadowOffset: {
      width: 1,
      height: 2,
    },
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
    marginBottom: 4,
    fontFamily: "mon-sb",
  },
  feedDescription: {
    fontFamily: "mon",
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    fontFamily: "mon-b",
  },
  modalButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    backgroundColor: "#3498db",
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
    borderWidth: 1,
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
  },
  
});

export default Portfolio;
