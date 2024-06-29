// App.js
import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage
//import portfolio from "./(tabs)/portfolio)"; // Import your screen components
import portfoliohelpers from "./(tabs)/portfoliohelpers)"; // Import your screen components
import portfolio2 from "./(tabs)/portfolio2)"; // Import your screen components
import profile from "./(tabs)/profile)"; // Import your screen components
import create from "./(tabs)/create)"
import login from "./(modals)/login)"; // Import your screen components
import signup from "./(modals)/signup)"; // Import your screen components
import onboarding from "./(tabs)/onboarding)"; // Import your Onboarding component
import onboarding from "./(tabs)/onboard2)";
import Report from "./(modals)/report)";
import firebase from "firebase/app";
import { config } from "../config/firebase";
import { LogBox } from 'react-native';

const Stack = createStackNavigator();
LogBox.ignoreAllLogs();
LogBox.ignoreLogs(['Warning: Each child in a list should have a unique \"key\" prop']);

const App = () => {

};

export default  App();
