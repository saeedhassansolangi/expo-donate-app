import {
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
  Modal,
  ActivityIndicator,
  ScrollView,
  Platform,
} from "react-native";
import React from "react";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { useState } from "react";
import { TouchableOpacity } from "react-native";
import * as Location from "expo-location";
import { Entypo } from "@expo/vector-icons";
import UserContext from "../contexts/user";
import axios from "../config/axios";
import UserProfile from "../components/UserProfile";
import { ScreenPadding } from "../config/ScreenPadding";

const qualityCondtions = [
  {
    value: "New",
    isSelected: false,
  },
  {
    value: "Gently Used",
    isSelected: false,
  },
  {
    value: "Older but Excellent",
    isSelected: false,
  },
];

export default function AddItem({ navigation }) {
  const [date, setDate] = useState(new Date(Date.now()));
  const [time, setTime] = useState(new Date(Date.now()));
  const [errorMsg, setErrorMsg] = useState("");
  const [coords, setCoords] = useState(null);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [quality, setQuality] = useState(() => {
    return qualityCondtions[0].value || "";
  });
  const [quantity, setQuantity] = useState(0);
  const [thankYouModal, setThankyouModal] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsloading] = useState(false);

  const { user } = React.useContext(UserContext);

  const onDateChange = (_, selectedDate) => {
    const currentDate = selectedDate;
    setDate(currentDate);
  };

  const onTimeChange = (_, selectedDate) => {
    const currentTime = selectedDate;
    setTime(currentTime);
  };

  const showMode = (currentMode) => {
    DateTimePickerAndroid.open({
      value: date,
      onChange: currentMode === "date" ? onDateChange : onTimeChange,
      mode: currentMode,
      is24Hour: true,
    });
  };

  const showDatepicker = () => {
    showMode("date");
  };

  const showTimepicker = () => {
    showMode("time");
  };

  const onLocationTrack = async () => {
    setIsFetchingLocation(true);
    try {
      const { granted } = await Location.requestForegroundPermissionsAsync();
      if (!granted) {
        return setErrorMsg("Permission to access location was denied");
      }
      let { coords } = await Location.getCurrentPositionAsync({
        accuracy: 5,
      });
      const { latitude, longitude } = coords;
      setCoords({
        latitude,
        longitude,
      });
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setIsFetchingLocation(false);
    }
  };

  const onAddItem = () => {
    if (!name) return setErrorMsg("Please enter a name for your item");
    if (!description)
      return setErrorMsg("Please enter a description for your item");
    if (quantity < 1) return setErrorMsg("Please Provide the Quantity");
    if (!coords) return setErrorMsg("Please fetch your location");
    setIsloading(true);
    axios
      .post("/donations", {
        email: user.email,
        name,
        description,
        quantity,
        quality: quality.toLowerCase(),
        status: "not_collected",
        date: `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`,
        longitude: coords.longitude,
        latitude: coords.latitude,
        time: time.getTime(),
      })
      .then((res) => {
        console.log(res.data);
        setTimeout(() => {
          setIsloading(false);
          setThankyouModal(!thankYouModal);
          setName("");
          setDescription("");
          setQuantity(0);
          setQuality(qualityCondtions[0].value);
          setErrorMsg("");
        }, 1000);
      })
      .catch((err) => {
        if (!err.message) {
          return setErrorMsg(err.response.data.message);
        }
        setErrorMsg(err.message);
        setIsloading(false);
      });
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        {user && <UserProfile user={user} />}

        <Text style={styles.text}>What would you like to donate ?</Text>
        {errorMsg ? <Text style={styles.errorMsg}>{errorMsg}</Text> : null}
        <View style={styles.itemContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Item Name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              style={styles.inputStyle}
              placeholder="Blanket"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Any Extra Information </Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              style={styles.inputStyle}
              placeholder="please provide a description"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Quantity Offered {quantity}</Text>
            <View style={styles.quantities}>
              <Text
                style={[
                  styles.inputStyle,
                  {
                    width: "60%",
                    color: "black",
                    fontSize: 20,
                    textAlign: "center",
                  },
                ]}
              >
                {quantity}
              </Text>

              <View style={styles.quantityButtons}>
                <TouchableOpacity
                  style={{ borderBottomWidth: 1, borderBottomColor: "#e4eee9" }}
                  onPress={() => {
                    setQuantity(quantity + 1);
                  }}
                >
                  <Text
                    style={{ fontSize: 25, textAlign: "center", color: "blue" }}
                  >
                    +
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    setQuantity(quantity == 0 ? quantity : quantity - 1);
                  }}
                >
                  <Text
                    style={{ fontSize: 25, textAlign: "center", color: "blue" }}
                  >
                    -
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.dateTimeContainer}>
            <TouchableOpacity
              style={{
                width: "48%",
              }}
              onPress={showDatepicker}
            >
              <Text style={[styles.label]}>Select Date</Text>
              <Text style={[styles.dateTime]}>
                {date.toISOString().slice(0, 10)}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                width: "48%",
              }}
              onPress={showTimepicker}
            >
              <Text style={styles.label}>Select Time</Text>
              <Text style={[styles.dateTime]}>
                {time.toString().slice(16, 24)}
              </Text>
            </TouchableOpacity>
          </View>

          <View>
            <Text style={styles.label}>Enable Location</Text>
            <TouchableOpacity onPress={onLocationTrack}>
              <Text style={styles.inputStyle}>
                {isFetchingLocation ? (
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <ActivityIndicator size={"small"} color="red" />
                    <Text style={{ paddingLeft: 10, fontSize: 12 }}>
                      fetching location...
                    </Text>
                  </View>
                ) : coords ? (
                  `latitude(${coords["latitude"]}), longitude(${coords["longitude"]})`
                ) : (
                  `Select Location`
                )}
              </Text>
            </TouchableOpacity>
          </View>

          <View>
            <View>
              <Text style={styles.label}>Quality</Text>
              <View style={styles.quailityPicker}>
                {qualityCondtions.map(({ value, _ }) => {
                  return (
                    <TouchableOpacity
                      key={value}
                      style={[
                        styles.btnQuality,
                        value === quality && {
                          backgroundColor: "#B9F6CA",
                          borderColor: "#00E676",
                        },
                      ]}
                      onPress={() => {
                        setQuality(value);
                      }}
                    >
                      <Text
                        style={[
                          styles.btnQtyTxt,
                          value === quality && {
                            color: "#00C853",
                            fontWeight: "500",
                          },
                        ]}
                      >
                        {value}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <Text style={[styles.inputStyle]}>{quality}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.submit} onPress={onAddItem}>
          {!isLoading ? (
            <Text style={styles.btnTxt}>Donate Now</Text>
          ) : (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
              }}
            >
              <Text style={styles.btnTxt}>please wait....</Text>

              <ActivityIndicator size="small" color="#fff" />
            </View>
          )}
        </TouchableOpacity>

        <Modal transparent visible={thankYouModal}>
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <View
              style={[
                styles.modal,
                Platform.OS === "web"
                  ? { width: "40%", height: "80%" }
                  : { width: "80%", height: "40%" },
              ]}
            >
              <View style={{ marginTop: 5, marginLeft: 5 }}>
                <Entypo
                  name="circle-with-cross"
                  size={Platform.OS === "web" ? 35 : 24}
                  color="black"
                  onPress={() => {
                    setThankyouModal(!thankYouModal);
                  }}
                />
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 25,
                    textAlign: "center",
                  }}
                >{`Thankyou \n ${user && user.username} for Donating`}</Text>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight + 10,
    paddingHorizontal: ScreenPadding,
    backgroundColor: "#e4eee9",
  },

  dateTimeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },

  dateTime: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 10,
    marginHorizontal: 1,
    borderRadius: 10,
    marginVertical: 2,
  },
  modal: {
    borderWidth: 1,
    borderColor: "#bbb",
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 16,
    fontWeight: "500",
    marginTop: 20,
    paddingLeft: 5,
    fontSize: Platform.OS === "android" ? 14 : 20,
  },

  quailityPicker: {
    flexDirection: "row",
    alignItems: "center",
  },

  btnQtyTxt: {
    color: "#7B1FA2",
    fontWeight: "500",
    fontSize: Platform.OS === "android" ? 10 : 14,
  },

  btnQuality: {
    marginVertical: 5,
    paddingHorizontal: Platform.OS === "android" ? 15 : 10,
    borderWidth: 1,
    borderRadius: 10,
    marginHorizontal: 2,
    paddingVertical: 1,
    backgroundColor: "#F3E5F5",
    borderColor: "#E040FB",
  },

  quantityButtons: {
    width: "40%",
    justifyContent: "space-between",
    borderLeftWidth: 1,
    backgroundColor: "white",
    borderLeftColor: "#e4eee9",
  },

  itemContainer: {
    borderRadius: 10,
    padding: 5,
    marginTop: 10,
  },

  quantities: {
    flex: 1,
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
  },

  inputContainer: {
    flexDirection: "column",
    marginTop: 4,
  },

  header: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
  },

  project: {
    paddingLeft: 20,
    fontSize: 20,
    fontFamily: "monospace",
  },

  inputStyle: {
    padding: 10,
    borderRadius: 5,
    paddingLeft: 20,
    marginBottom: 5,
    marginTop: 5,
    backgroundColor: "white",
  },

  label: {
    paddingLeft: 5,
    fontSize: Platform.OS === "android" ? 14 : 16,
  },

  submit: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "white",
    backgroundColor: "#000",
    padding: 10,
    marginHorizontal: 5,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  submitTxt: {
    color: "white",
    textAlign: "center",
  },

  errorMsg: {
    fontSize: 14,
    color: "red",
    textAlign: "center",
  },

  btnTxt: {
    color: "#fff",
    textAlign: "center",
    paddingHorizontal: 10,
  },
});
