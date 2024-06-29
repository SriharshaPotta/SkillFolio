import { useAuth, useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import Colors from 'constants/Colors';
import { printToFileAsync } from 'expo-print';
import { router } from 'expo-router';
import { shareAsync } from 'expo-sharing';
import { collection, doc, getDocs } from 'firebase/firestore';
import { FIRESTORE_DB } from 'firebaseConfig';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, ImageSourcePropType, TouchableOpacity } from 'react-native';

// Corrected image import paths (replace with your actual image paths)
const academicAchievementsImage = require('./tabsImages/academic_achievements.jpeg');
const athleticParticipationImage = require('./tabsImages/athletic_participation.jpeg');
const performingArtsExperienceImage = require('./tabsImages/performing_arts_experience.jpeg');
const clubMembershipImage = require('./tabsImages/club_membership.jpeg');
const communityServiceImage = require('./tabsImages/community_service.jpeg');
const honorsClassesImage = require('./tabsImages/honors_classes.jpeg');

const PortfolioPage: React.FC = () => {
  const { signOut, isSignedIn } = useAuth();
  const { user } = useUser();
  const [firstName, setFirstName] = useState(user?.firstName);
  const [lastName, setLastName] = useState(user?.lastName);
  const [email, setEmail] = useState(user?.emailAddresses[0].emailAddress);

  const handleCardPress1 = () => {
    router.push("/(modals)/portfolioModals/achievementsModal");
  };
  const handleCardPress2 = () => {
    router.push("/(modals)/portfolioModals/athleticsModal");
  };
  const handleCardPress3 = () => {
    router.push("/(modals)/portfolioModals/artsModal");
  };
  const handleCardPress4 = () => {
    router.push("/(modals)/portfolioModals/clubsModal");
  };
  const handleCardPress5 = () => {
    router.push("/(modals)/portfolioModals/servicesModal");
  };
  const handleCardPress6 = () => {
    router.push("/(modals)/portfolioModals/honorsModal");
  };

  const [achievements, setAchievements] = useState<{ id: number; title: string; description: string; image: string[]; firebaseId: string; }[]>([]);
  const [athletics, setAthletics] = useState<{ id: number; title: string; description: string; image: string[]; firebaseId: string; }[]>([]);
  const [arts, setArts] = useState<{ id: number; title: string; description: string; image: string[]; firebaseId: string; }[]>([]);
  const [clubs, setClubs] = useState<{ id: number; title: string; description: string; image: string[]; firebaseId: string; }[]>([]);
  const [services, setServices] = useState<{ id: number; title: string; description: string; image: string[]; firebaseId: string; }[]>([]);
  const [honors, setHonors] = useState<{ id: number; title: string; description: string; image: string[]; firebaseId: string; }[]>([]);

  const userCollection = collection(FIRESTORE_DB, "users");
  const userDocRef = doc(userCollection, user?.id);

  useEffect(() => {
    const fetchPortfolioData = async () => {
      // Fetch portfolio data from Firestore using userDocRef
      const userAchievementsRef = collection(userDocRef, "achievements");
      const userAthleticsRef = collection(userDocRef, "athletics");
      const userArtsRef = collection(userDocRef, "arts");
      const userClubsRef = collection(userDocRef, "clubs");
      const userServicesRef = collection(userDocRef, "services");
      const userHonorsRef = collection(userDocRef, "honors");

      const [achievementsSnapshot, athleticsSnapshot, artsSnapshot, clubsSnapshot, servicesSnapshot, honorsSnapshot,] =
        await Promise.all([
          getDocs(userAchievementsRef),
          getDocs(userAthleticsRef),
          getDocs(userArtsRef),
          getDocs(userClubsRef),
          getDocs(userServicesRef),
          getDocs(userHonorsRef),
        ]);

      const achievementsData = achievementsSnapshot.docs.map(
        (doc: { id: any; data: () => any }) => ({ id: doc.id, ...doc.data() })
      );
      const athleticsData = athleticsSnapshot.docs.map(
        (doc: { id: any; data: () => any }) => ({ id: doc.id, ...doc.data() })
      );
      const artsData = artsSnapshot.docs.map(
        (doc: { id: any; data: () => any }) => ({ id: doc.id, ...doc.data() })
      );
      const clubsData = clubsSnapshot.docs.map(
        (doc: { id: any; data: () => any }) => ({ id: doc.id, ...doc.data() })
      );
      const servicesData = servicesSnapshot.docs.map(
        (doc: { id: any; data: () => any }) => ({ id: doc.id, ...doc.data() })
      );
      const honorsData = honorsSnapshot.docs.map(
        (doc: { id: any; data: () => any }) => ({ id: doc.id, ...doc.data() })
      );

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

  let generatePdf = async () => {
    try {
      // Create the HTML content using user data
      const achievementsHtml = achievements.map(
        (achievement) =>
          `<p><strong>${achievement.title}</strong>: ${
            achievement.description
          }`
        );
      const athleticsHtml = athletics.map(
        (athletic) =>
          `<p><strong>${athletic.title}</strong>: ${athletic.description}</p>
        `
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
            <img src="${user?.profileImageUrl}" width="75" height="75">
            <h1 style="text-align:center;"><b>${user?.fullName}</b></h1>
            <p style="text-align:center;">${user?.emailAddresses}</p>
            <p style="text-align:center;">${user?.phoneNumbers}</p>
            
            <h2>Academic Achievements</h2>
            ${achievementsHtml.join("")}
            <hr>
  
            <h2>Athletic Participation</h2>
            ${athleticsHtml.join("")}
            <hr>
  
            <h2>Performing Arts Experience</h2>
            ${artsHtml.join("")}
            <hr>
  
            <h2>Clubs And Organization Memberships</h2>
            ${clubsHtml.join("")}
            <hr>
  
            <h2>Community Service Hours</h2>
            ${servicesHtml.join("")}
            <hr>
  
            <h2>Honors Classes</h2>
            ${honorsHtml.join("")}
          </body>
        </html>
      `;
  
      const file = await printToFileAsync({
        html: html,
        base64: false,
      });
  
      if (file) {
        await shareAsync(file.uri);
      } else {
        console.error('Error generating PDF');
      }
    } catch (error) {
      console.error('Error generating or sharing PDF:', error);
    }
  };
  

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{firstName}'s Portfolio</Text>
        <TouchableOpacity onPress={generatePdf}>
          <Ionicons
            name="share-social-outline"
            color={Colors.primary}
            size={30}
            style={styles.shareIcon}
          />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <SectionCard title="Academic Achievements" image={academicAchievementsImage} onPress={handleCardPress1} />
        <SectionCard title="Athletic Participation" image={athleticParticipationImage} onPress={handleCardPress2} />
        <SectionCard title="Performing Arts    Experience" image={performingArtsExperienceImage} onPress={handleCardPress3} />
        <SectionCard title="Club & Organization Membership" image={clubMembershipImage} onPress={handleCardPress4} />
        <SectionCard title="Community Service      Hours" image={communityServiceImage} onPress={handleCardPress5} />
        <SectionCard title="Honors Classes" image={honorsClassesImage} onPress={handleCardPress6} />
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
    </View>
  );
};

interface SectionCardProps {
  title: string;
  image: ImageSourcePropType;
  onPress: () => void;
}

const SectionCard: React.FC<SectionCardProps> = ({ title, image, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={image} style={styles.cardImage} resizeMode="cover" />
      <View style={styles.cardTitleContainer}>
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  title: {
    flex: 1,
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000000',
  },
  shareIcon: {
    marginLeft: 10,
  },
  scrollViewContent: {
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    height: 200,
    marginBottom: 50,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: {
      width: 1,
      height: 2,
    },
  },
  cardImage: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  cardTitleContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'mon-b',
    color: '#ffffff',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
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
});

export default PortfolioPage;