import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Colors from 'constants/Colors';
import * as ImagePicker from 'expo-image-picker';
import { FIRESTORE_DB } from "../../firebaseConfig";
import { addDoc, collection, deleteDoc, doc, getDocs, onSnapshot } from "firebase/firestore";
import { getUserId } from './profile';
import { useAuth, useUser } from '@clerk/clerk-expo';


const categoryIcons = {
  'Achievements': 'trophy',
  'Athletics': 'tennisball',
  'Arts': 'color-palette',
  'Clubs': 'people',
  'Community Service': 'volunteer-activism',
  'Honors': 'medal',
  ' + ': 'add-circle'
} as const;

type Category = keyof typeof categoryIcons;

const CreatePage = () => {
    const { user } = useUser();
    const { signOut, isSignedIn } = useAuth();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [images, setImages] = useState<string[]>([]);
    const categories = Object.keys(categoryIcons) as Category[];

    const [newAchievement, setNewAchievement] = useState({
        title: "",
        description: "",
        image: [],
    });

    const userCollection = collection(FIRESTORE_DB, "users");
    const userDocRef = doc(userCollection, user?.id);
    
    useEffect(() => {
        const fetchPortfolioData = async () => {
          // Fetch portfolio data from Firestore using userDocRef
          const userAchievementsRef = collection(userDocRef, "achievements");
          const [achievementsSnapshot] =
            await Promise.all([
              getDocs(userAchievementsRef),
            ]);
    
          const achievementsData = achievementsSnapshot.docs.map(
            (doc: { id: any; data: () => any }) => ({ id: doc.id, ...doc.data() })
          );

          // Update state with fetched data
          setAchievements(achievementsData);
        };
    
        if (isSignedIn) {
          fetchPortfolioData();
        }
      }, [isSignedIn]); // Add dependencies as needed

    const renderIcon = (category: Category) => {
        if (category === 'Community Service') {
            return <MaterialIcons name={categoryIcons[category]} size={50} color="#FF385C" />;
        } else {
            return <Ionicons name={categoryIcons[category]} size={50} color="#FF385C" />;
        }
    };

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

    const removeImage = (indexToRemove: number) => {
        setImages(images.filter((_, index) => index !== indexToRemove));
    };
    
    const userId = getUserId();

    const [achievements, setAchievements] = useState<{ id: number; title: string; description: string; image: string[]; firebaseId: string; }[]>([]);
    const addAchievement = async (newAchievement: { title: string; description: string; image: string[] }) => {
        if (newAchievement.title && newAchievement.description) {
            const achievementData = {
              title: newAchievement.title,
              description: newAchievement.description,
              image: images,
            };
            const achievementDocRef = await addDoc(
              collection(userDocRef, "achievements"),
              achievementData
            );
            const firebaseId = achievementDocRef.id;
      
            setAchievements([
              ...achievements,
              { id: achievements.length + 1, firebaseId, ...achievementData },
            ]);
            setNewAchievement({ title: "", description: "", image: []});
            setImages([]);
          }
    };
    const addAthletic = async (newAthletic: { title: string; description: string; image: string[];}) => {
        try {
            await addDoc(collection(FIRESTORE_DB, 'users', userId, 'athletics'), newAthletic);
        } catch (error) {
            console.error("Error adding athletic: ", error);
        }
    };
    
    const addArt = async (newArt: { title: string; description: string; image: string[]}) => {
        try {
            await addDoc(collection(FIRESTORE_DB, 'users', userId, 'arts'), newArt);
        } catch (error) {
            console.error("Error adding art: ", error);
        }
    };
    
    const addClub = async (newClub: { title: string; description: string; image: string[] }) => {
        try {
            await addDoc(collection(FIRESTORE_DB, 'users', userId, 'clubs'), newClub);
        } catch (error) {
            console.error("Error adding club: ", error);
        }
    };
    
    const addService = async (newService: { title: string; description: string; image: string[]}) => {
        try {
            await addDoc(collection(FIRESTORE_DB, 'users', userId, 'services'), newService);
        } catch (error) {
            console.error("Error adding service: ", error);
        }
    };
    
    const addHonor = async (newHonor: { title: string; description: string; image: string[]}) => {
        try {
            await addDoc(collection(FIRESTORE_DB, 'users', userId, 'honors'), newHonor);
        } catch (error) {
            console.error("Error adding honor: ", error);
        }
    };
    
    

   
    const handleCreate = async () => {
        if (!selectedCategory) return;

        const newEntry = { title, description, image: images };

        try {
            switch (selectedCategory) {
                case 'Achievements':
                    await addAchievement(newEntry);
                    break;
                case 'Athletics':
                    await addAthletic(newEntry);
                    break;
                case 'Arts':
                    await addArt(newEntry);
                    break;
                case 'Clubs':
                    await addClub(newEntry);
                    break;
                case 'Community Service':
                    await addService(newEntry);
                    break;
                case 'Honors':
                    await addHonor(newEntry);
                    break;
                default:
                    break;
            }
            
            // Navigate back to portfolio
            router.push('/(tabs)/portfolio2');
        } catch (error) {
            console.error("Error creating entry: ", error);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.push('/(tabs)/portfolio')}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Create</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.iconContainer}>
                    {selectedCategory ? renderIcon(selectedCategory) : <Ionicons name="trophy-outline" size={50} color="#FF385C" />}
                </View>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.inputTitle}
                        value={title}
                        onChangeText={setTitle}
                        placeholder="Title"
                        placeholderTextColor={'gray'}
                    />
                </View>

                <View style={styles.categoryContainer}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {categories.map((category, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.categoryBox,
                                    selectedCategory === category && styles.selectedCategory
                                ]}
                                onPress={() => setSelectedCategory(category)}
                            >
                                <Text style={[
                                    styles.categoryText,
                                    selectedCategory === category && styles.selectedCategoryText
                                ]}>
                                    {category}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Description</Text>
                    <TextInput
                        style={[styles.inputDescription, styles.textArea]}
                        value={description}
                        onChangeText={setDescription}
                        placeholder="Add more details"
                        placeholderTextColor={'gray'}
                        multiline
                        numberOfLines={4}
                    />
                </View>

                {images.map((image, index) => (
                    <View key={index} style={styles.imageContainer}>
                        <Image source={{ uri: image }} style={styles.image} />
                        <TouchableOpacity
                            onPress={() => removeImage(index)}
                            style={styles.removeButton}
                        >
                            <Ionicons name="close-circle" size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>

            <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
                <Text style={styles.uploadButtonText}>Upload Image</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.saveButton} onPress={handleCreate}>
                <Text style={styles.saveButtonText}>Create</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: 'transparent',
        paddingTop: 65,
    },
    headerTitle: {
        fontSize: 25,
        fontWeight: 'bold',
        marginLeft: 125,
        justifyContent: 'center',
        alignContent: 'center',
        textAlign: 'center',
        alignItems: 'center',
    },
    content: {
        padding: 16,
    },
    iconContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    uploadButton: {
        backgroundColor: "white", // Custom color
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        marginVertical: 10,
        borderColor: Colors.primary, // Add black border color
        borderWidth: 2, // Add border width
        marginHorizontal: 10,
      },
      uploadButtonText: {
        color: Colors.primary,
        fontSize: 16,
        fontWeight: "bold",
      },
      image: {
        width: "100%",
        height: 200,
        resizeMode: "cover",
        marginBottom: 10,
        borderRadius: 10,
        marginTop: 20,
      },
      imageContainer: {
        position: "relative",
        marginLeft: 19,
        marginRight: 19,
      },
      removeButton: {
        position: "absolute",
        top: 29,
        right: 5,
      },
    inputTitle: {
        backgroundColor: 'transparent',
        borderRadius: 8,
        padding: 12,
        textAlign: "center",
        fontSize: 32,
        fontWeight: 'bold',
    },
    inputDescription: {
        backgroundColor: 'transparent',
        borderRadius: 8,
        marginTop: 0,
        fontSize: 20,
    },
    textArea: {
        height: 120,
        textAlignVertical: 'top',
    },
    categoryContainer: {
        marginBottom: 20,
    },
    categoryBox: {
        backgroundColor: 'white',
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginRight: 8,
        height: 50,
        textAlignVertical: 'center',
        justifyContent: 'center',
    },
    selectedCategory: {
        backgroundColor: Colors.primary,
    },
    categoryText: {
        fontSize: 14,
        color: 'black',
        fontWeight: 'bold',
    },
    saveButton: {
        backgroundColor: Colors.primary,
        padding: 16,
        borderRadius: 8,
        margin: 16,
        alignItems: 'center',
    },
    saveButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    selectedCategoryText: {
        color: 'white',
    },
});

export default CreatePage;