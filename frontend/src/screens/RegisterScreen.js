import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React from "react";
import Button from "../components/Button";
import { Ionicons } from "@expo/vector-icons";
import axios from "../config/axios";
import { ScreenPadding } from "../config/ScreenPadding";

const validPhoneNumber = /^((\+92)?(0092)?(92)?(0)?)(3)([0-9]{9})$/;

export default function RegisterScreen({ navigation, route }) {
  const [email, setEmail] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [errorMsg, setErrorMsg] = React.useState("");
  const [isLoading, setIsloading] = React.useState(false);

  const onUserRegister = () => {
    if (
      !email.trim() ||
      !username.trim() ||
      !password.trim() ||
      !phoneNumber.trim()
    ) {
      return setErrorMsg("All fields are required");
    }

    if (
      email.length < 5 ||
      username.length < 5 ||
      password.length < 5 ||
      phoneNumber.length < 5
    ) {
      return setErrorMsg("All fields must be 6 characters");
    }

    if (!validPhoneNumber.test(phoneNumber)) {
      return setErrorMsg("Invalid Phone Number");
    }

    setErrorMsg("");
    setIsloading(true);

    axios
      .post(
        "/users/register",
        {
          email,
          username,
          password,
          phone_number: phoneNumber,
          role: route.params.role,
        },
        {
          Headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        console.log(res.data);
        setIsloading(false);
        navigation.navigate("Login", { username: username });
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
            <Text style={styles.title}>Signup as {route.params.role}</Text>
          </View>
          {errorMsg ? <Text style={styles.errorMsg}>{errorMsg}</Text> : null}

          <TextInput
            value={email}
            onChangeText={(text) => setEmail(text)}
            style={styles.inputStyle}
            placeholder="Email"
          />
          <TextInput
            value={username}
            onChangeText={(text) => setUsername(text)}
            style={styles.inputStyle}
            placeholder="username"
          />
          <TextInput
            value={phoneNumber}
            onChangeText={(text) => setPhoneNumber(text)}
            style={styles.inputStyle}
            placeholder="Phone Number"
          />

          <TextInput
            value={password}
            onChangeText={(text) => setPassword(text)}
            style={styles.inputStyle}
            placeholder="Password"
            secureTextEntry
          />

          <Button
            onPress={onUserRegister}
            text={
              !isLoading ? (
                "Register"
              ) : (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ textAlign: "center", paddingHorizontal: 10 }}>
                    Registering....
                  </Text>

                  <ActivityIndicator size="small" color="#fff" />
                </View>
              )
            }
            buttonStyles={{
              backgroundColor: "#000",
              borderRadius: 10,
              padding: 10,
              marginTop: 10,
            }}
            textStyles={{ color: "white", textAlign: "center" }}
          />

          <Text
            style={styles.signUpText}
            onPress={() => {
              navigation.navigate("Login");
            }}
          >
            Already Have Account Login here
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
    fontSize: Platform.OS === "web" ? 20 : 16,
    fontWeight: Platform.OS === "web" ? "bold" : "600",
    marginVertical: 15,
  },
  inputStyle: {
    marginVertical: 5,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
    paddingLeft: 20,
  },
  signUpContainer: {
    flexDirection: "row",
  },
  signUpText: {
    marginTop: 30,
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
