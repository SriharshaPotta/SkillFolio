// App.js
import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage
import portfolio from "./(tabs)/portfolio)"; // Import your screen components
import profile from "./(tabs)/profile)"; // Import your screen components
import login from "./(modals)/login)"; // Import your screen components
import signup from "./(modals)/signup)"; // Import your screen components
import onboarding from "./(tabs)/onboarding)"; // Import your Onboarding component
import onboarding from "./(tabs)/onboard2)";
import Report from "./(modals)/report)";
import firebase from "firebase/app";
import { config } from "../config/firebase";

const Stack = createStackNavigator();

const App = () => {
  
};

export default App;
