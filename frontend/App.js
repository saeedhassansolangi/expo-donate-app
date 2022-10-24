import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./src/screens/HomeScreen";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import AddItem from "./src/screens/AddItem";
import ItemsScreen from "./src/screens/Items";
import UserContext from "./src/contexts/user";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Text, TouchableOpacity, View, StatusBar } from "react-native";

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState(() => {
    AsyncStorage.getItem("user").then((user) => {
      if (user) {
        return setUser(JSON.parse(user));
      }
      return null;
    });
  });

  const [token, setToken] = useState(() => {
    AsyncStorage.getItem("token").then((token) => {
      if (token) {
        return setToken(token);
      }
      return null;
    });
  });

  return (
    <>
      <StatusBar
        translucent
        backgroundColor="#e4eee9"
        barStyle="dark-content"
      />
      <UserContext.Provider value={{ user, setUser, token }}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Home">
            {user ? (
              user.role === "volunteer" ? (
                <Stack.Screen
                  name="Items"
                  options={{
                    headerShown: false,
                  }}
                  component={ItemsScreen}
                />
              ) : (
                <Stack.Screen
                  options={{
                    headerShown: false,
                  }}
                  name="AddItem"
                  component={AddItem}
                />
              )
            ) : (
              <>
                <Stack.Screen
                  name="Home"
                  component={HomeScreen}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="Login"
                  component={LoginScreen}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="Register"
                  component={RegisterScreen}
                  options={{ headerShown: false }}
                />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </UserContext.Provider>
    </>
  );
}
