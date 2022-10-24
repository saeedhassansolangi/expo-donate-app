import { Modal, StyleSheet, Text, View } from "react-native";
import React from "react";

export default function CardModel({ donar, onDonarModal, donarModal }) {
  return (
    <Modal visible={donarModal}>
      <View>
        <Text onPress={onDonarModal}>HI there</Text>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({});
