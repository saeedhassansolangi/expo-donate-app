import { Image, Platform, StyleSheet, View, Text } from "react-native";
import React from "react";
import Button from "../components/Button";

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require("../images/image2.png")} style={styles.image} />
      </View>

      <Button
        text={"Register as a DONAR"}
        buttonStyles={styles.btnStyle}
        textStyles={styles.textStyle}
        onPress={() =>
          navigation.navigate("Register", {
            role: "donar",
          })
        }
      />

      <Button
        text={"Register as a VOLUNTEER"}
        buttonStyles={styles.btnStyle}
        textStyles={styles.textStyle}
        onPress={() =>
          navigation.navigate("Register", {
            role: "volunteer",
          })
        }
      />

      <Button
        text={"Already Registed ? Login Here"}
        buttonStyles={styles.btnStyle}
        textStyles={styles.textStyle}
        onPress={() => navigation.navigate("Login", {})}
      />

      <Text style={styles.author}>Created by Saeed Hassan</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e4eee9",
  },
  phrase: {
    fontSize: 20,
    color: "black",
    textAlign: "center",
    textTransform: "capitalize",
    marginVertical: 10,
    fontWeight: "bold",
    fontFamily: "monospace",
    // backgroundColor: "#c6f68d",
    padding: 10,
    borderRadius: 10,
  },

  btnStyle: {
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    width: "70%",
    borderWidth: 1,
    borderColor: "#000",
  },
  textStyle: {
    fontSize: Platform.OS === "android" ? 10 : 16,
    fontWeight: "bold",
    textAlign: "center",
    textTransform: "capitalize",
  },

  header: {
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    borderWidth: 1,
    width: 200,
    height: 200,
    borderRadius: 100,
    borderColor: "#eeefff",
  },

  author: {
    fontSize: 10,
    color: "gray",
  },
});
