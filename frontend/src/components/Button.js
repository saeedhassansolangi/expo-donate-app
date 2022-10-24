import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";

export default function Button({ text, buttonStyles, textStyles, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.container, { ...buttonStyles }]}
    >
      <Text style={[styles.btn, { ...textStyles }]}> {text} </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {},
  buttonText: {},
});
