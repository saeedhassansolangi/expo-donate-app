import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useContext } from "react";
import { Ionicons } from "@expo/vector-icons";
import UserContext from "../contexts/user";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function UserProfile() {
  const { user, setUser } = useContext(UserContext);
  const navigation = useNavigation();

  return user ? (
    <View style={styles.container}>
      <View style={styles.userProfile}>
        <View style={styles.userIconStyle}>
          <Ionicons name="person" size={25} color="black" />
        </View>
        <View>
          <Text style={{ fontSize: 10 }}>Welcome</Text>
          <Text style={styles.username}>{user.username}</Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={async () => {
          setUser(null);
          await AsyncStorage.clear();
          navigation.navigate("Home");
        }}
      >
        <View>
          <Text>Logout</Text>
        </View>
      </TouchableOpacity>
    </View>
  ) : null;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    alignItems: "center",
    paddingVertical: 20,
    borderRadius: 10,
  },
  userProfile: {
    flexDirection: "row",
    alignItems: "center",
  },

  userIconStyle: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 5,
    borderRadius: 20,
    marginRight: 5,
    justifyContent: "center",
  },
  username: {
    letterSpacing: 1.5,
    fontSize: 18,
  },
});
