// App.js
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import portfolio from "./(tabs)/portfolio)"; // Import your screen components
import profile from "./(tabs)/profile)"; // Import your screen components
import login from "./(modals)/login)"; // Import your screen components
import signup from "./(modals)/signup)"; // Import your screen components

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="portfolio">
        <Stack.Screen name="portfolio" component={portfolio} />
        <Stack.Screen name="profile" component={profile} />
        <Stack.Screen name="login" component={login} />
        <Stack.Screen name="signup" component={signup} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
