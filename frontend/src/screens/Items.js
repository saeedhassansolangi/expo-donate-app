import {
  FlatList,
  Linking,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import { useEffect } from "react";
import axios from "../config/axios";
import moment from "moment";
import UserContext from "../contexts/user";
import CardModel from "../components/CardModel";
import { useState } from "react";
import { useContext } from "react";
import UserProfile from "../components/UserProfile";
import ItemCard from "../components/ItemCard";
import { ScreenPadding } from "../config/ScreenPadding";

// const items = [
//   {
//     id: 1,
//     name: "Item1",
//     description: "description1",
//     quantity: 10,
//     quality: "New",
//     location: {
//       latitude: 25.42095,
//       longitude: 68.25681,
//     },
//     date: "12/2/2022",
//     time: 124878787878,
//     donar: "Saeed",
//     Volunteer: "",
//     itemDelivered: "",
//   },

//   {
//     id: 2,
//     name: "Item1",
//     description: "description1",
//     quantity: 10,
//     quality: "New",
//     location: {
//       latitude: 12,
//       longitude: 20,
//     },
//     date: "12/2/2022",
//     time: 124878787878,
//     donar: "Saeed",
//     Volunteer: "",
//     itemDelivered: "",
//   },

//   {
//     id: 3,
//     name: "Item1",
//     description: "description1",
//     quantity: 10,
//     quality: "New",
//     location: {
//       latitude: 12,
//       longitude: 20,
//     },
//     date: "12/2/2022",
//     time: 124878787878,
//     donar: "Saeed",
//     Volunteer: "",
//     itemDelivered: "",
//   },
// ];

export default function ItemsScreen({ navigation }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [donarModal, setDonarModal] = useState(false);

  const { user } = useContext(UserContext);

  const getDonations = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/donations");
      console.log(response.data);
      setItems(response.data);
      setLoading(false);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    getDonations();
  }, []);

  const openExternalLocation = ({ latitude, longitude }) => {
    const scheme = Platform.select({
      ios: "maps:0,0?q=",
      android: "geo:0,0?q=",
      web: "https://maps.google.com/?q=",
    });
    const latLng = `${latitude},${longitude}`;
    const label = "Open Location on Google Map";
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}`,
      web: `${scheme}${latLng}`,
    });

    Linking.openURL(url);
  };

  const onVolunteerAdd = async (id) => {
    axios
      .post(`/donations/${id}/collect`, {
        email: user && user.email,
      })
      .then((response) => {
        console.log("collect response", response.data);
        setItems(
          items.map((item) => {
            if (item._id === id) {
              return {
                ...item,
                volunteer: user && user.email,
                status: "collected",
              };
            }
            return item;
          })
        );

        getDonations();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onVolunteerDistribute = async (id) => {
    axios
      .post(`/donations/${id}/distribute`, {
        email: user && user.email,
      })
      .then((response) => {
        console.log("distribute response", response.data);
        setItems(
          items.map((item) => {
            if (item._id === id) {
              return {
                ...item,
                status: "distributed",
              };
            }
            return item;
          })
        );

        getDonations();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <View style={styles.container}>
      <UserProfile />

      {/* <View
        style={{
          backgroundColor: "white",
          marginTop: 5,
          marginBottom: 10,
          paddingVertical: 10,
          paddingVertical: 20,
          borderRadius: 5,
        }}
      >
        <Text
          style={{
            fontSize: Platform.OS === "android" ? 14 : 16,
            paddingLeft: 10,
          }}
        >
          Items added in the 24 hours
        </Text>
      </View> */}

      {error ? (
        <Text style={[styles.msg, { color: "red" }]}>{error}</Text>
      ) : null}
      {items.length > 0 ? (
        <>
          <FlatList
            data={items}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              return (
                <ItemCard
                  user={user}
                  item={item}
                  onVolunteerDistribute={onVolunteerDistribute}
                  onVolunteerAdd={onVolunteerAdd}
                  openExternalLocation={openExternalLocation}
                  donarModal={donarModal}
                  setDonarModal={setDonarModal}
                />
              );
            }}
            keyExtractor={(item) => item._id.toString()}
          />
        </>
      ) : (
        <Text style={styles.msg}>
          {items.length < 1 && loading
            ? "fetching donated items..."
            : "No items donated yet"}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: StatusBar.currentHeight + 10,
    paddingHorizontal: ScreenPadding,
    backgroundColor: "#e4eee9",
    marginBottom: 20,
    flex: 1,
  },

  msg: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 20,
    fontWeight: "bold",
  },
});
