import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  StatusBar,
} from "react-native";
import React, { useState } from "react";
import Button from "../components/Button";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "../config/axios";
import UserContext from "../contexts/user";
import { ScreenPadding } from "../config/ScreenPadding";

export default function LoginScreen({ navigation, route }) {
  const [emailUsername, setEmailUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsloading] = useState(false);
  const { setUser } = React.useContext(UserContext);

  const onUserLogin = () => {
    if (!emailUsername.trim() || !password.trim()) {
      return setErrorMsg("email and password required");
    }

    if (emailUsername.length < 5 || password.length < 5) {
      return setErrorMsg("email and password must be 6 characters");
    }
    setErrorMsg("");
    setIsloading(true);

    axios
      .post("/users/login", {
        email: emailUsername,
        password: password,
      })
      .then((res) => {
        console.log(res);
        AsyncStorage.setItem("token", res.data.token);
        AsyncStorage.setItem("user", JSON.stringify(res.data.user));
        setIsloading(false);
        setUser(res.data.user);
        if (res.data.user.role === "volunteer") {
          navigation.navigate("Items");
        } else {
          navigation.navigate("AddItem");
        }
      })
      .catch((err) => {
        console.log(err);
        if (!err.message) {
          return setErrorMsg(err.response.data.message);
        }
        setErrorMsg(err.message);
      })
      .finally(() => {
        setIsloading(false);
      });
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "#e4eee9" }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <Ionicons
            name="chevron-back-circle-outline"
            size={35}
            color="black"
            onPress={() => {
              navigation.goBack();
            }}
          />
          <View style={styles.header}>
            <Image
              source={require("../images/image2.png")}
              style={styles.image}
            />
            <Text style={styles.title}>Login to Donate </Text>
          </View>

          {errorMsg ? <Text style={styles.errorMsg}>{errorMsg}</Text> : null}

          <TextInput
            value={emailUsername}
            onChangeText={(text) => setEmailUsername(text)}
            style={styles.inputStyle}
            placeholder="Enter your email or username"
          />
          <TextInput
            style={styles.inputStyle}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={(text) => setPassword(text)}
          />

          <Button
            onPress={onUserLogin}
            text={
              !isLoading ? (
                "Login"
              ) : (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "#fff",
                      textAlign: "center",
                      paddingHorizontal: 10,
                    }}
                  >
                    logging....
                  </Text>

                  <ActivityIndicator size="small" color="#fff" />
                </View>
              )
            }
            buttonStyles={{
              backgroundColor: "#000",
              borderRadius: 10,
              padding: 10,
            }}
            textStyles={{ color: "white", textAlign: "center" }}
          />

          <Text
            style={styles.signInText}
            onPress={() => {
              navigation.navigate("Register", {
                role: "donor",
              });
            }}
          >
            Don't have an Account, lets create One
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#e4eee9",
    flex: 1,
    paddingHorizontal: ScreenPadding,

    justifyContent: "center",
    paddingVertical: StatusBar.currentHeight + 10,
  },
  header: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  image: {
    borderWidth: 1,
    width: 200,
    height: 200,
    borderRadius: 100,
    borderColor: "#eeefff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 15,
  },
  inputStyle: {
    marginVertical: 10,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
    paddingLeft: 20,
  },

  signInText: {
    marginTop: 50,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "900",
  },
  errorMsg: {
    fontSize: 14,
    color: "red",
    textAlign: "center",
  },
});
