import { StyleSheet, Text, View } from "react-native";
import React from "react";

export default function Item({ label, value }) {
  return (
    <View style={styles.itemContainer}>
      <Text>{label}</Text>
      <Text>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
    backgroundColor: "#eee",
    paddingHorizontal: 15,
    borderRadius: 10,
    shadowColor: "#a6aef4",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.17,
    shadowRadius: 3.05,
    elevation: 3,
  },
});
