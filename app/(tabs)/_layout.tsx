import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import Colors from '../../constants/Colors'
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'

const Layout = () => {
  return (
    <Tabs 
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarLabelStyle: {
          fontFamily: 'mon-sb'
        },
      }}>
      <Tabs.Screen
        name = "index"
        options={{
          tabBarLabel: "Explore",
          headerShown: false,
          tabBarIcon: ({color, size}) => <Ionicons name="search" color={color} size={size}/>
        }}
      />
      <Tabs.Screen
        name = "portfolio"
        options={{
          tabBarLabel: "Portfolio",
          headerShown: false,
          tabBarIcon: ({color, size}) => <Ionicons name="folder-open" color={color} size={size}/>
        }}
      />
      <Tabs.Screen
        name = "profile"
        options={{
          tabBarLabel: "Profile",
          headerShown: false,
          tabBarIcon: ({color, size}) => <Ionicons name="person-circle-outline" color={color} size={size}/>
        }}
      />
    </Tabs>
  )
}

export default Layout