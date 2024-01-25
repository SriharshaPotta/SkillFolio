import React, { useEffect, useRef, useState } from 'react';
import { View,Text,Button,ScrollView,StyleSheet,Modal,TextInput,TouchableOpacity,SafeAreaView, Animated,} from 'react-native';
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { Swipeable } from "react-native-gesture-handler";
import { printToFileAsync} from 'expo-print';
import { shareAsync } from 'expo-sharing';
import { addDoc, collection, deleteDoc, doc, getDocs, onSnapshot } from 'firebase/firestore';
import { FIRESTORE_DB } from '../../firebaseConfig';
import { useAuth, useUser } from "@clerk/clerk-expo";
import Colors from 'constants/Colors';

const Portfolio = () => {

let achievementsachievementIDs = new Array();

  const{ signOut, isSignedIn } = useAuth();
  const{ user }= useUser();
  const[firstName, setFirstName] =useState(user?.firstName);
  const[lastName, setLastName] = useState(user?.lastName);
  const[email, setEmail] = useState(user?.emailAddresses[0].emailAddress);


  let generatePdf = async () => {
    // Create the HTML content dynamically using user data
    const achievementsHtml = achievements.map(
      (achievement) =>
        `<p><strong>${achievement.title}</strong>: ${achievement.description}</p>`
    );
    const athleticsHtml = athletics.map(
      (athletic) =>
        `<p><strong>${athletic.title}</strong>: ${athletic.description}</p>`
    );
    const artsHtml = arts.map(
      (art) =>
        `<p><strong>${art.title}</strong>: ${art.description}</p>`
    );
    const clubsHtml = clubs.map(
      (club) =>
        `<p><strong>${club.title}</strong>: ${club.description}</p>`
    );
    const servicesHtml = services.map(
      (service) =>
        `<p><strong>${service.title}</strong>: ${service.description}</p>`
    );
    const honorsHtml = honors.map(
      (honor) =>
        `<p><strong>${honor.title}</strong>: ${honor.description}</p>`
    );
  
    const html = `
      <html>
        <body>
          <h1>My Portfolio</h1>
          
          <h2>Academic Achievements</h2>
          ${achievementsHtml.join("")}
  
          <h2>Athletic Participation</h2>
          ${athleticsHtml.join("")}
  
          <h2>Performing Arts Experience</h2>
          ${artsHtml.join("")}

          <h2>Clubs And Organization Memberships</h2>
          ${clubsHtml.join("")}

          <h2>Community Service Hours</h2>
          ${servicesHtml.join("")}

          <h2>Honors Classes</h2>
          ${honorsHtml.join("")}
        </body>
      </html>
    `;
  
  const file = await printToFileAsync({
      html: html,
      base64: false,
    });
    await shareAsync(file.uri);
  };
  

  const swipeableRef = useRef(null);
 

  const [achievements, setAchievements] = useState([
    { id: 1, title: 'Academic Excellence', description: 'Achieved academic excellence in the first semester.', firebaseId: '' },
    { id: 2, title: 'Math Olympiad Participant', description: 'Successfully participated in the regional Math Olympiad.', firebaseId: '' },
]);
const [athletics, setAthletics] = useState([
    { id: 1, title: "Basketball Team", description: "Played as a member of the school basketball team.", firebaseId: "" },
    { id: 2, title: "Track and Field", description: "Participated in various track and field events.", firebaseId: "" },
]);
const [arts, setArts] = useState([
    { id: 1, title: "Oil Painting", description: "Created beautiful oil paintings inspired by Lona Misa.", firebaseId: "" },
    { id: 2, title: "Watercolor Art", description: "Explored the art of watercolor painting with themes like Gan Vogh.", firebaseId: '' },
]);
const [clubs, setClubs] = useState([
    {id: 1, title: "Future Business Leaders of America (FBLA)", description: "Active member of FBLA, gaining valuable business insights.", firebaseId: '' },
    {id: 2, title: "Science Olympiad", description: "Engaged in challenging science competitions and projects.", firebaseId: '' },
]);
const [services, setServices] = useState([
    { id: 1, title: "Community Volunteer", description: "Provided assistance to community members in need.", firebaseId: "" },
    { id: 2, title: "Tutoring", description: "Offered tutoring services to help fellow students succeed.", firebaseId: "" },
]);
const [honors, setHonors] = useState([
    { id: 1, title: "AP Biology Honors", description: "Successfully completed the challenging AP Biology course.", firebaseId: "" },
    { id: 2, title: "Calculus Achievement", description: "Achieved excellence in the study of Calculus.", firebaseId: "" },
]);


  const [isAddAchievementModalVisible, setAddAchievementModalVisible] = useState(false);
  const [isAddAthleticModalVisible, setAddAthleticModalVisible] = useState(false);
  const [isAddArtModalVisible, setAddArtModalVisible] = useState(false);
  const [isAddClubModalVisible, setAddClubModalVisible] = useState(false);
  const [isAddServiceModalVisible, setAddServiceModalVisible] = useState(false);
  const [isAddHonorModalVisible, setAddHonorModalVisible] = useState(false);


  const [newAchievement, setNewAchievement] = useState({ title: '', description: '' });
  const [newAthletic, setNewAthletic] = useState({title: '', description: ''});
  const [newArt, setNewArt] = useState({title: '', description: '' });
  const [newClub, setNewClub] = useState({title: '', description: '' });
  const [newService, setNewService] = useState({title: '', description: '' });
  const [newHonor, setNewHonor] = useState({title: '', description: '' });



  const toggleAddAchievementModal = () => {
    setAddAchievementModalVisible(!isAddAchievementModalVisible);
  };
  const toggleAddAthleticModal = () => {
    setAddAthleticModalVisible(!isAddAthleticModalVisible);
  };
  const toggleAddArtModal = () => {
    setAddArtModalVisible(!isAddArtModalVisible);
  };
  const toggleAddClubModal = () => {
    setAddClubModalVisible(!isAddClubModalVisible);
  };
  const toggleAddServiceModal = () => {
    setAddServiceModalVisible(!isAddServiceModalVisible);
  };
  const toggleAddHonorModal = () => {
    setAddHonorModalVisible(!isAddHonorModalVisible);
  };

  const [initialDataLoaded, setInitialDataLoaded] = useState(false);

  useEffect(() => {
    const fetchPortfolioData = async () => {
      // Fetch portfolio data from Firestore using userDocRef
      const userAchievementsRef = collection(userDocRef, 'achievements');
      const userAthleticsRef = collection(userDocRef, 'athletics');
      const userArtsRef = collection(userDocRef, 'arts');
      const userClubsRef = collection(userDocRef, 'clubs');
      const userServicesRef = collection(userDocRef, 'services');
      const userHonorsRef = collection(userDocRef, 'honors');

      const [achievementsSnapshot, athleticsSnapshot /*, ...otherSnapshots */] = await Promise.all([
        getDocs(userAchievementsRef),
        getDocs(userAthleticsRef),
        getDocs(userArtsRef),
        getDocs(userClubsRef),
        getDocs(userServicesRef),
        getDocs(userHonorsRef),
      ]);

      const achievementsData = achievementsSnapshot.docs.map((doc: { id: any; data: () => any; }) => ({ id: doc.id, ...doc.data() }));
      const athleticsData = athleticsSnapshot.docs.map((doc: { id: any; data: () => any; }) => ({ id: doc.id, ...doc.data() }));     
      const artsData = athleticsSnapshot.docs.map((doc: { id: any; data: () => any; }) => ({ id: doc.id, ...doc.data() }));
      const clubsData = athleticsSnapshot.docs.map((doc: { id: any; data: () => any; }) => ({ id: doc.id, ...doc.data() }));
      const servicesData = athleticsSnapshot.docs.map((doc: { id: any; data: () => any; }) => ({ id: doc.id, ...doc.data() }));
      const honorsData = athleticsSnapshot.docs.map((doc: { id: any; data: () => any; }) => ({ id: doc.id, ...doc.data() }));


      // Update state with fetched data
      setAchievements(achievementsData);
      setAthletics(athleticsData);
      setArts(artsData);
      setClubs(clubsData);
      setServices(servicesData);
      setHonors(honorsData);

    };

    if (isSignedIn) {
      fetchPortfolioData();
    }
  }, [isSignedIn]); // Add dependencies as needed


// ADD
  const userCollection = collection(FIRESTORE_DB, "users");
  const userDocRef = doc(userCollection, user?.id);

  const addAchievement = async () => {
    if (newAchievement.title && newAchievement.description) {
      const achievementData = {
        title: newAchievement.title,
        description: newAchievement.description,
      };
      const achievementDocRef = await addDoc(collection(userDocRef, "achievements"), achievementData);
      const firebaseId = achievementDocRef.id;

      setAchievements([...achievements, { id: achievements.length + 1, firebaseId, ...achievementData }]);
      setNewAchievement({ title: '', description: '' });
      toggleAddAchievementModal();
    }
  };
  
  const addAthletic = async () => {
    if (newAthletic.title && newAthletic.description) {
      const athleticData = {
        title: newAthletic.title,
        description: newAthletic.description,
      };
      const athleticDocRef = await addDoc(collection(userDocRef, "athletics"), athleticData);
      const firebaseId = athleticDocRef.id;

      setAthletics([...athletics, { id: athletics.length + 1, firebaseId, ...athleticData }]);
      setNewAthletic({ title: '', description: '' });
      toggleAddAthleticModal();
    }
  };
  const addArt = async () => {
    if (newArt.title && newArt.description) {
      const artData = {
        title: newArt.title,
        description: newArt.description,
      };
      const artDocRef = await addDoc(collection(userDocRef, "arts"), artData);
      const firebaseId = artDocRef.id;

      setArts([...arts, { id: arts.length + 1, firebaseId, ...artData }]);
      setNewArt({ title: '', description: '' });
      toggleAddArtModal();
    }
  };
  const addClub = async () => {
    if (newClub.title && newClub.description) {
      const clubData = {
        title: newClub.title,
        description: newClub.description,
      };
      const clubDocRef = await addDoc(collection(userDocRef, "clubs"), clubData);
      const firebaseId = clubDocRef.id;

      setClubs([...clubs, { id: clubs.length + 1, firebaseId, ...clubData }]);
      setNewClub({ title: '', description: '' });
      toggleAddClubModal();
    }
  };
  const addService = async() => {
    if (newService.title && newService.description) {
      const serviceData = {
        title: newService.title,
        description: newService.description,
      };
      const serviceDocRef = await addDoc(collection(userDocRef, "services"), serviceData);
      const firebaseId = serviceDocRef.id;

      setServices([...services,{ id: services.length + 1, firebaseId, ...serviceData },]);
      setNewService({ title: "", description: "" });
      toggleAddServiceModal();
    }
  };
  const addHonor = async () => {
    if (newHonor.title && newHonor.description) {
      const honorData = {title: newHonor.title, description: newHonor.description,};
      const honorDocRef = await addDoc( collection(userDocRef, "honors"), honorData);
      const firebaseId = honorDocRef.id;

      setHonors([...honors,{ id: honors.length + 1, firebaseId, ...honorData },]);
      setNewHonor({ title: "", description: "" });
      toggleAddHonorModal();
    }
  };


  //DELETE
  const deleteAchievement = async (localId: number, firebaseId: string) => {
    const updatedAchievements = achievements.filter((achievement) => achievement.id !== localId);
    setAchievements(updatedAchievements);
    const achievementDocRef = doc(collection(userDocRef, "achievements"), firebaseId);
    await deleteDoc(achievementDocRef);
  };
  const deleteAthletic = async (localId: number, firebaseId: string) => {
    const updatedAthletics = athletics.filter((athletic) => athletic.id !== localId);
    setAthletics(updatedAthletics);
    const athleticDocRef = doc(collection(userDocRef, "athletics"), firebaseId);
    await deleteDoc(athleticDocRef);
  };
  const deleteArt = async (localId: number, firebaseId: string) => {
    const updatedArts = arts.filter((art) => art.id !== localId);
    setArts(updatedArts);
    const artDocRef = doc(collection(userDocRef, "arts"), firebaseId);
    await deleteDoc(artDocRef);
  };
  const deleteClub = async (localId: number, firebaseId: string) => {
    const updatedClubs = clubs.filter((club) => club.id !== localId);
    setClubs(updatedClubs);
    const clubDocRef = doc(collection(userDocRef, "clubs"), firebaseId);
    await deleteDoc(clubDocRef);
  };
  const deleteService = async (localId: number, firebaseId: string) => {
    const updatedServices = services.filter((service) => service.id !== localId);
    setServices(updatedServices);
    const serviceDocRef = doc(collection(userDocRef, "services"), firebaseId);
    await deleteDoc(serviceDocRef);
  };
  const deleteHonor = async (localId: number, firebaseId: string) => {
    const updatedHonors = honors.filter((honor) => honor.id !== localId);
    setHonors(updatedHonors);
    const honorDocRef = doc(collection(userDocRef, "honors"), firebaseId);
    await deleteDoc(honorDocRef);
  };




// RENDER
const renderAchievements = () => {
  const renderRightActions = (progress: Animated.AnimatedInterpolation<string | number>, dragX: Animated.AnimatedInterpolation<string | number>, index: number) => {
    const trans = dragX.interpolate({
      inputRange: [0, 50, 100],
      outputRange: [0, 0.5, 1],
    });
    return (
      <TouchableOpacity
        onPress={() => deleteAchievement(achievements[index].id, achievements[index].firebaseId)}
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
    return achievements.map((achievement, index) => (
      <Swipeable
        key={achievement.id}
        renderRightActions={(progress, dragX) =>
          renderRightActions(progress, dragX, index)
        }
      >
        <View style={styles.card}>
          <View style={styles.achievementContent}>
            <Text style={styles.achievementTitle}>{achievement.title}</Text>
            <Text style={styles.achievementDescription}>
              {achievement.description}
            </Text>
          </View>
        </View>
      </Swipeable>
    ));
  };


 
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
        onPress={() => deleteAthletic(athletics[index].id, athletics[index].firebaseId)}
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
      <Swipeable
        key={athletic.id}
        renderRightActions={(progress, dragX) =>
          renderRightActions(progress, dragX, index)
        }
      >
        <View style={styles.card}>
          <View style={styles.achievementContent}>
            <Text style={styles.achievementTitle}>{athletic.title}</Text>
            <Text style={styles.achievementDescription}>
              {athletic.description}
            </Text>
          </View>
        </View>
      </Swipeable>
    ));
  };




  const renderArts = () => {
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
        onPress={() => deleteArt(arts[index].id, arts[index].firebaseId)}
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
    return arts.map((art, index) => (
      <Swipeable
        key={art.id}
        renderRightActions={(progress, dragX) =>
          renderRightActions(progress, dragX, index)
        }
      >
        <View style={styles.card}>
          <View style={styles.achievementContent}>
            <Text style={styles.achievementTitle}>{art.title}</Text>
            <Text style={styles.achievementDescription}>
              {art.description}
            </Text>
          </View>
        </View>
      </Swipeable>
    ));
  };

  const renderClubs = () => {
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
            deleteClub(clubs[index].id, clubs[index].firebaseId)
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
    return clubs.map((club, index) => (
      <Swipeable
        key={club.id}
        renderRightActions={(progress, dragX) =>
          renderRightActions(progress, dragX, index)
        }
      >
        <View style={styles.card}>
          <View style={styles.achievementContent}>
            <Text style={styles.achievementTitle}>{club.title}</Text>
            <Text style={styles.achievementDescription}>
              {club.description}
            </Text>
          </View>
        </View>
      </Swipeable>
    ));
  };  
  const renderServices = () => {
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
        onPress={() => deleteService(services[index].id, services[index].firebaseId)}
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
    return services.map((service, index) => (
      <Swipeable
        key={service.id}
        renderRightActions={(progress, dragX) =>
          renderRightActions(progress, dragX, index)
        }
      >
        <View style={styles.card}>
          <View style={styles.achievementContent}>
            <Text style={styles.achievementTitle}>{service.title}</Text>
            <Text style={styles.achievementDescription}>
              {service.description}
            </Text>
          </View>
        </View>
      </Swipeable>
    ));
  };  
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
            deleteHonor(honors[index].id, honors[index].firebaseId)
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
      <Swipeable
        key={honor.id}
        renderRightActions={(progress, dragX) =>
          renderRightActions(progress, dragX, index)
        }
      >
        <View style={styles.card}>
          <View style={styles.achievementContent}>
            <Text style={styles.achievementTitle}>{honor.title}</Text>
            <Text style={styles.achievementDescription}>
              {honor.description}
            </Text>
          </View>
        </View>
      </Swipeable>
    ));
  };  



  return (
    // MY PORTFOLIO
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText} numberOfLines={1} adjustsFontSizeToFit> 
          {firstName}'s Portfolioㅤ
          <Ionicons name="ios-share" color={"black"} size={35} onPress={generatePdf}/></Text>
        </View>
        {/*ACADEMIC ACHIEVEMENTS*/}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Academic Achievements</Text>
          {renderAchievements()}
        </View>
        {/*ACADEMIC ACHIEVEMENTS - Button*/}
        <View style={styles.addButtonContainer}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={toggleAddAchievementModal}
          >
            <FontAwesome5
              name="plus"
              size={20}
              color="#fff"
              style={styles.addButtonIcon}
            />
            <Text style={styles.addButtonLabel}>Add Achievement</Text>
          </TouchableOpacity>
        </View>
        {/*ACADEMIC ACHIEVEMENTS - Adding Page*/}
        <Modal visible={isAddAchievementModalVisible} animationType="slide">
          <SafeAreaView style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Add Academic Achievement</Text>
            <TextInput
              style={styles.input}
              placeholder="Achievement Title"
              placeholderTextColor="#A9A9A9"
              onChangeText={(text) =>
                setNewAchievement({ ...newAchievement, title: text })
              }
              value={newAchievement.title}
            />
            <TextInput
              style={[styles.input, styles.multilineInput]}
              placeholder="Achievement Description"
              onChangeText={(text) =>
                setNewAchievement({ ...newAchievement, description: text })
              }
              value={newAchievement.description}
              multiline
            />
            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={addAchievement}
              >
                <Text style={styles.modalButtonText}>
                  Add Academic Achievement
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={toggleAddAchievementModal}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </Modal>

        {/*ATHLETIC PARTICIPATION*/}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Athletic Participation</Text>
          {renderAthletics()}
        </View>
        {/*ATHLETIC PARTICIPATION - Button*/}
        <View style={styles.addButtonContainer}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={toggleAddAthleticModal}
          >
            <FontAwesome5
              name="plus"
              size={20}
              color="#fff"
              style={styles.addButtonIcon}
            />
            <Text style={styles.addButtonLabel}>Add Athletic Particpation</Text>
          </TouchableOpacity>
        </View>
        {/*ATHLETIC PARTICIPATION - Adding A Page*/}
        <Modal visible={isAddAthleticModalVisible} animationType="slide">
          <SafeAreaView style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Add Athletic</Text>
            <TextInput
              style={styles.input}
              placeholder="Athletics Title"
              placeholderTextColor="#A9A9A9"
              onChangeText={(text) =>
                setNewAthletic({ ...newAthletic, title: text })
              }
              value={newAthletic.title}
            />
            <TextInput
              style={[styles.input, styles.multilineInput]}
              placeholder="Athletics Description"
              onChangeText={(text) =>
                setNewAthletic({ ...newAthletic, description: text })
              }
              value={newAthletic.description}
              multiline
            />
            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={addAthletic}
              >
                <Text style={styles.modalButtonText}>Add Athletics</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={toggleAddAthleticModal}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </Modal>

        {/*PERFORMING ARTS EXPERIENCE*/}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performing Arts Experience</Text>
          {renderArts()}
        </View>
        {/*PERFORMING ARTS EXPERIENCE - Button*/}
        <View style={styles.addButtonContainer}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={toggleAddArtModal}
          >
            <FontAwesome5
              name="plus"
              size={20}
              color="#fff"
              style={styles.addButtonIcon}
            />
            <Text style={styles.addButtonLabel}>Add Performing Arts</Text>
          </TouchableOpacity>
        </View>
        {/*PERFORMING ARTS EXPERIENCE - Adding A Page*/}
        <Modal visible={isAddArtModalVisible} animationType="slide">
          <SafeAreaView style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Add Performing Art</Text>
            <TextInput
              style={styles.input}
              placeholder="Performing Arts Title"
              placeholderTextColor="#A9A9A9"
              onChangeText={(text) => setNewArt({ ...newArt, title: text })}
              value={newArt.title}
            />
            <TextInput
              style={[styles.input, styles.multilineInput]}
              placeholder="Performing Arts Description"
              onChangeText={(text) =>
                setNewArt({ ...newArt, description: text })
              }
              value={newArt.description}
              multiline
            />
            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity style={styles.modalButton} onPress={addArt}>
                <Text style={styles.modalButtonText}>Add Performing Art</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={toggleAddArtModal}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </Modal>

        {/*CLUB AND ORGANIZATION MEMBERSHIP*/}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Clubs & Organization Membership
          </Text>
          {renderClubs()}
        </View>
        {/*CLUB AND ORGANIZATION MEMBERSHIP - Button*/}
        <View style={styles.addButtonContainer}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={toggleAddClubModal}
          >
            <FontAwesome5
              name="plus"
              size={20}
              color="#fff"
              style={styles.addButtonIcon}
            />
            <Text style={styles.addButtonLabel}>Add Club/Organization</Text>
          </TouchableOpacity>
        </View>
        {/*CLUB AND ORGANIZATION MEMBERSHIP - Adding A Page*/}
        <Modal visible={isAddClubModalVisible} animationType="slide">
          <SafeAreaView style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Add Club/Organization</Text>
            <TextInput
              style={styles.input}
              placeholder="Club/Organization Title"
              placeholderTextColor="#A9A9A9"
              onChangeText={(text) => setNewClub({ ...newClub, title: text })}
              value={newClub.title}
            />
            <TextInput
              style={[styles.input, styles.multilineInput]}
              placeholder="Club/Organization Description"
              onChangeText={(text) =>
                setNewClub({ ...newClub, description: text })
              }
              value={newClub.description}
              multiline
            />
            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity style={styles.modalButton} onPress={addClub}>
                <Text style={styles.modalButtonText}>
                  Add Club or Organization
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={toggleAddClubModal}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </Modal>

        {/*COMMUNITY SERVICE HOURS*/}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Community Service Hours</Text>
          {renderServices()}
        </View>
        {/*COMMUNITY SERVICE HOURS - Button*/}
        <View style={styles.addButtonContainer}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={toggleAddServiceModal}
          >
            <FontAwesome5
              name="plus"
              size={20}
              color="#fff"
              style={styles.addButtonIcon}
            />
            <Text style={styles.addButtonLabel}>Add Community Service</Text>
          </TouchableOpacity>
        </View>
        {/*COMMUNITY SERVICE HOURS - Adding A Page*/}
        <Modal visible={isAddServiceModalVisible} animationType="slide">
          <SafeAreaView style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Add Community Service</Text>
            <TextInput
              style={styles.input}
              placeholder="Community Service Title"
              placeholderTextColor="#A9A9A9"
              onChangeText={(text) =>
                setNewService({ ...newService, title: text })
              }
              value={newService.title}
            />
            <TextInput
              style={[styles.input, styles.multilineInput]}
              placeholder="Community Service Description"
              onChangeText={(text) =>
                setNewService({ ...newService, description: text })
              }
              value={newService.description}
              multiline
            />
            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity style={styles.modalButton} onPress={addService}>
                <Text style={styles.modalButtonText}>
                  Add Community Service
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={toggleAddServiceModal}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </Modal>

        {/*HONORS CLASSES*/}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Honors Classes</Text>
          {renderHonors()}
        </View>
        {/*HONORS CLASSES - Button*/}
        <View style={styles.addButtonContainer}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={toggleAddHonorModal}
          >
            <FontAwesome5
              name="plus"
              size={20}
              color="#fff"
              style={styles.addButtonIcon}
            />
            <Text style={styles.addButtonLabel}>Add Honors Class</Text>
          </TouchableOpacity>
        </View>
        {/*HONORS CLASSES - Adding A Page*/}
        <Modal visible={isAddHonorModalVisible} animationType="slide">
          <SafeAreaView style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Add Honors Class</Text>
            <TextInput
              style={styles.input}
              placeholder="Honors Class Title"
              placeholderTextColor="#A9A9A9"
              onChangeText={(text) => setNewHonor({ ...newHonor, title: text })}
              value={newHonor.title}
            />
            <TextInput
              style={[styles.input, styles.multilineInput]}
              placeholder="Honors Class Description"
              onChangeText={(text) =>
                setNewHonor({ ...newHonor, description: text })
              }
              value={newHonor.description}
              multiline
            />
            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity style={styles.modalButton} onPress={addHonor}>
                <Text style={styles.modalButtonText}>Add Honors Class</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={toggleAddHonorModal}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </Modal>

        {/*GENERATE PDF - Button*/}
        <View style={styles.generatePDFButtonContainer}>
          <TouchableOpacity
            onPress={generatePdf}
            style={styles.generatePDFButton}
          >
            <Text style={styles.generatePDFButtonText}>Export PDF</Text>
          </TouchableOpacity>
        </View>
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
  achievementItem: {
    fontFamily: "mon",
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
    fontFamily: "mon-sb",
  },
  achievementDescription: {
    fontFamily: "mon",
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
    backgroundColor: "#27ae60",
    height: 50,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 25,
  },
  addButtonIcon: {
    marginRight: 10,
  },
  addButtonLabel: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "mon-b",
  },
  deleteIcon: {
    marginRight: 10, // Adjust spacing between achievement content and delete icon
  },
  generatePDFButtonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  generatePDFButton: {
    backgroundColor: Colors.primary, // Change the color to a different one
    borderRadius: 8, // Make the button more rounded
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 25,
    height: 50,
    width: 200,
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
});




export default Portfolio;