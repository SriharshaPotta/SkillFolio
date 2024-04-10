import React from "react";
import { 
  View, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  Text, 
  Dimensions 
} from "react-native";
import { Video, ResizeMode } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import Colors from "constants/Colors";

const { width } = Dimensions.get('window');
const videoWidth = width - 40; // Adjusted video width to fit the screen with some margin

// Define a custom type including 'cover' as a valid value for resizeMode
type CustomResizeMode = ResizeMode | "cover";

const VideoPlayer = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Link href="/(tabs)/profile" style={styles.closeButton}>
          <Ionicons name="ios-arrow-back" size={24} color="black" />
        </Link>
        <Text style={styles.pageTitle}>Help</Text>
        <View style={styles.videoContainer}>
          <Text style={styles.title}>Adding Achievements</Text>
          <Text style={styles.description}>
            To add an achievement on the portfolio page, navigate to the portfolio page, select add on the type of achievement you would like to add, enter the title, description, and image (if applicable). Then press the add button and your achievement is added! 
          </Text>
          <Text style={styles.bold}>Video Tutorial:</Text>
          <Video
            source={require("./modalVideos/addingVid.mp4")}
            style={styles.video}
            useNativeControls
            resizeMode={ResizeMode.COVER}  // Use "cover" as resizeMode
          />
        </View>
        <View style={styles.videoContainer}>
          <Text style={styles.title}>Removing Achievements</Text>
          <Text style={styles.description}>
            To remove an achievement, navigate to the portfolio page, locate the achievement you wish to delete, and swipe left on the achievement to remove it.
          </Text>
          <Text style={styles.bold}>Video Tutorial:</Text>
          <Video
            source={require("./modalVideos/removingVid.mp4")}
            style={styles.video}
            useNativeControls
            resizeMode={ResizeMode.COVER}  // Use "cover" as resizeMode
          />
        </View>
        <View style={styles.videoContainer}>
          <Text style={styles.title}>Exporting Your Portoflio</Text>
          <Text style={styles.description}>
            To export your portfolio, navigate to the portfolio page and either tap the share button on the top right of the screen or the export button at the bottom of the screen. Then select where you would like to share and then share.
          </Text>
          <Text style={styles.bold}>Video Tutorial:</Text>
          <Video
            source={require("./modalVideos/exportVideo.mp4")}
            style={styles.video}
            useNativeControls
            resizeMode={ResizeMode.COVER}  // Use "cover" as resizeMode
          />
        </View>
        <View style={styles.videoContainer}>
          <Text style={styles.title}>Editing Your Profile</Text>
          <Text style={styles.description}>
            To edit your profile picture, navitage to the profile tab, select your current profile picture, and select the new photo that you would like to add. To edit your name, press the edit button to the right of your name and enter in your new name.
          </Text>
          <Text style={styles.bold}>Video Tutorial:</Text>
          <Video
            source={require("./modalVideos/profileVideo.mp4")}
            style={styles.video}
            useNativeControls
            resizeMode={ResizeMode.COVER}  // Use "cover" as resizeMode
          />
        </View>
        <View style={styles.videoContainer}>
          <Text style={styles.title}>Creating A Post</Text>
          <Text style={styles.description}>
            To Create a new post, navigate to the explore tab and select the plus button at the top right of the screen. Enter in your title, description, and media (if applicable) and press the post button to post.
          </Text>
          <Text style={styles.bold}>Video Tutorial:</Text>
          <Video
            source={require("./modalVideos/postVideo.mp4")}
            style={styles.video}
            useNativeControls
            resizeMode={ResizeMode.COVER}  // Use "cover" as resizeMode
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 20,
  },
  videoContainer: {
    marginBottom: 55,
    width: videoWidth,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: 'white',
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: 'black',
    textAlign: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 27,
    fontWeight: "bold",
    color: Colors.primary,
    padding: 10,
  },
  description: {
    fontSize: 16,
    color: 'black',
    padding: 10,
  },
  bold: {
    fontSize: 16,
    fontWeight: "bold",
    color: 'black',
    padding: 10,
  },
  video: {
    width: '100%',
    aspectRatio: 16/9,
  },
  closeButton: {
    position: "absolute",
    top: 2,
    left: 16,
    color: "red",
    zIndex: 1,
  },
});

export default VideoPlayer;
