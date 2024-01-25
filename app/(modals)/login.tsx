import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { useWarmUpBrowser } from 'hooks/useWarmUpBrowser';
import { defaultStyles } from 'constants/styles';
import Colors from 'constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useOAuth } from '@clerk/clerk-expo';
import { Stack, useRouter } from 'expo-router';
import { Link } from 'expo-router';

enum Strategy{
  Google = 'oauth_google',
  Apple = 'oauth_apple',
  Facebook = 'oauth_facebook',
}

const Page = () => {

const router = useRouter();
  
  const { startOAuthFlow: googleAuth } = useOAuth({ strategy: 'oauth_google' });
  const { startOAuthFlow: appleAuth } = useOAuth({ strategy: 'oauth_apple' });
  const { startOAuthFlow: facebookAuth } = useOAuth({ strategy: 'oauth_facebook' });

  const [showPassword, setShowPassword] = useState(false);

  const onSelectAuth = async (strategy: Strategy) => {
    const selectedAuth = {
      [Strategy.Google]: googleAuth,
      [Strategy.Apple]: appleAuth,
      [Strategy.Facebook]: facebookAuth,
    }[strategy];

    try {
      const { createdSessionId, setActive } = await selectedAuth();

      if (createdSessionId) {
        setActive!({ session: createdSessionId });
        router.push("/(tabs)/profile");
      }
    } catch (err) {
      console.error('OAuth error ', err);
    }
  };




  return (
    <View style={styles.container}>
      <View>
        <Image source={require("./appLogo.png")} style={styles.image} />
        <Text style={styles.headtext}>Log In</Text>
      </View>
      <TextInput
        autoCapitalize="none"
        placeholder="Email"
        placeholderTextColor="#A9A9A9"
        style={[defaultStyles.inputField, { marginBottom: 30 }]}
      />
      <View style={styles.passwordInputContainer}>
  <TextInput
    autoCapitalize="none"
    placeholder="Password"
    placeholderTextColor="#A9A9A9"
    secureTextEntry={!showPassword}
    style={styles.passwordInput}
  />
  {/* Eye icon to toggle password visibility */}
  <TouchableOpacity
    style={styles.eyeIconContainer}
    onPress={() => setShowPassword(!showPassword)}
  >
    <Ionicons
      name={showPassword ? "ios-eye-off" : "ios-eye"}
      size={24}
      color={Colors.primary}
    />
  </TouchableOpacity>
</View>
<View style={styles.forgotPasswordContainer}>
  <Link href={'/reset'}>
    <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
  </Link>
</View>

      <TouchableOpacity style={defaultStyles.btn}>
        <Text style={defaultStyles.btnText}>Continue</Text>
      </TouchableOpacity>
      <View style={styles.seperatorView}>
        <View
          style={{
            flex: 1,
            borderBottomColor: "#000",
            borderBottomWidth: StyleSheet.hairlineWidth,
          }}
        />
        <Text style={styles.seperator}>or</Text>
        <View
          style={{
            flex: 1,
            borderBottomColor: "#000",
            borderBottomWidth: StyleSheet.hairlineWidth,
          }}
        />
      </View>
      <TouchableOpacity style={styles.btnOutline}>
              <Link href="./signup">
        <Text style={styles.btnOutlineText}>                               Sign Up                                   </Text>
              </Link>
      </TouchableOpacity>
      <View style={styles.seperatorView}>
        <View
          style={{
            flex: 1,
            borderBottomColor: "#000",
            borderBottomWidth: StyleSheet.hairlineWidth,
          }}
        />
        <Text style={styles.seperator}>or</Text>
        <View
          style={{
            flex: 1,
            borderBottomColor: "#000",
            borderBottomWidth: StyleSheet.hairlineWidth,
          }}
        />
      </View>
      <View style={{ gap: 20 }}>
        <TouchableOpacity
          style={styles.btnOutline}
          onPress={() => onSelectAuth(Strategy.Apple)}
        >
          <Ionicons
            name="md-logo-apple"
            size={24}
            style={defaultStyles.btnIcon}
          />
          <Text style={styles.btnOutlineText}>Continue with Apple</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btnOutline}
          onPress={() => onSelectAuth(Strategy.Google)}
        >
          <Ionicons
            name="md-logo-google"
            size={24}
            style={defaultStyles.btnIcon}
          />
          <Text style={styles.btnOutlineText}>Continue with Google</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btnOutline}
          onPress={() => onSelectAuth(Strategy.Facebook)}
        >
          <Ionicons
            name="md-logo-facebook"
            size={24}
            style={defaultStyles.btnIcon}
          />
          <Text style={styles.btnOutlineText}>Continue with Facebook</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 26,
  },
  seperatorView: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    marginVertical: 30,
  },
  seperator: {
    fontFamily: "mon-sb",
    color: Colors.grey,
  },
  btnOutline: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: Colors.grey,
    height: 50,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    paddingHorizontal: 10,
  },
  btnOutlineText: {
    color: "#000",
    fontSize: 16,
    fontFamily: "mon-sb",
  },
  btn: {
    color: "#39e75f",
  },
  image: {
    alignContent: "center",
    resizeMode: 'contain',
    width: 360,
    height: 200,
    marginTop: -30,
  },
  headtext: {
    fontFamily: "mon-b",
    fontSize: 25,
    textAlign: 'center',
    marginTop: -40,
    marginBottom: 35,
  },
  togglePasswordText: {
    color: Colors.primary,
    fontSize: 16,
    fontFamily: 'mon-sb',
    marginTop: 10,
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    borderWidth: 1,
    borderColor: '#ABABAB',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 10, 
    overflow: 'hidden', 
  },
  passwordInput: {
    flex: 1,
    height: 44,
    fontSize: 14,
    color: 'black',
    padding: 10,
  },
  eyeIconContainer: {
    padding: 10,
    borderLeftWidth: 1,
    borderColor: 'white',
  },
  forgotPasswordContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end', 
    marginTop: 0,
    marginBottom: 20
  },
  forgotPasswordText: {
    color: Colors.primary,
    fontSize: 12,
    fontFamily: 'mon-sb',
  },
});  

export default Page