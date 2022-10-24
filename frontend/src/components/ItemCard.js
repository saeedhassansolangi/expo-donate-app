import {
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import Item from "./Item";
import moment from "moment";
import CardModel from "../components/CardModel";

export default function ItemCard({
  user,
  item,
  onVolunteerAdd,
  onVolunteerDistribute,
  openExternalLocation,
  donarModal,
  setDonarModal,
}) {
  return (
    <View style={styles.item}>
      <Item label={"Item"} value={item.name} />
      <View style={styles.itemContainer}>
        <Text>Status: </Text>
        {item.status === "not_collected" ? (
          <Text style={{ color: "red", fontWeight: "600" }}>
            {item.status.toLowerCase()}
          </Text>
        ) : item.status === "collected" ? (
          <Text style={{ color: "dodgerblue", fontWeight: "600" }}>
            {item.status.toLowerCase()}
          </Text>
        ) : (
          <Text style={{ color: "green", fontWeight: "600" }}>
            {item.status.toLowerCase()}
          </Text>
        )}
      </View>

      <Item label={"Quantity"} value={item.quantity} />
      <Item label={"Quality"} value={item.quality} />
      <Item label={"Date"} value={item.date} />
      <Item label={"Time"} value={moment(item.time).fromNow()} />
      <Item label={"Donar Name:"} value={item.donar && item.donar.username} />

      {item.description && (
        <Item label={"Description:"} value={item.description.substr(0, 15)} />
      )}
      {item.item_collecing_time && item.status === "not_collected" && (
        <Item
          label={"Item Collecting Expiry time:"}
          value={moment(item.item_collecing_time).fromNow()}
        />
      )}

      {item.status === "collected" && item.item_distributing_time && (
        <Item
          label={"Item Distributing Expiry time:"}
          value={moment(item.item_distributing_time).fromNow()}
        />
      )}

      {item.donar && (
        <CardModel
          donarModal={donarModal}
          onDonarModal={() => setDonarModal(!donarModal)}
          donar={item.donar}
        />
      )}

      {item.donar &&
        (Platform.OS === "android" ? (
          <TouchableOpacity
            style={[styles.btnStyles, { backgroundColor: "dodgerblue" }]}
            onPress={() => {
              Linking.openURL(`tel:${item.donar.phone_number}`);
            }}
          >
            <Text style={[styles.txt, { fontWeight: "600" }]}>
              Contract Donar
            </Text>
          </TouchableOpacity>
        ) : (
          <Item
            label={"Donar Contact Number:"}
            value={item.donar && item.donar.phone_number}
          />
        ))}

      <TouchableOpacity
        onPress={() =>
          openExternalLocation({
            latitude: item.latitude,
            longitude: item.longitude,
          })
        }
        style={[
          styles.btnStyles,
          {
            backgroundColor: "#d4bff9",
          },
        ]}
      >
        <Text
          style={[
            styles.volunteerText,
            {
              color: "#7e3ff2",
              fontWeight: "bold",
            },
          ]}
        >
          Track Location
        </Text>
      </TouchableOpacity>
      {item.volunteer ? (
        item.status === "collected" ? (
          <TouchableOpacity
            onPress={() => {
              if (item.volunteer.username === user.username) {
                return onVolunteerDistribute(item._id);
              }
              alert(`${item.volunteer.username} is the volunteer`);
            }}
            style={[
              styles.btnStyles,
              {
                backgroundColor: "#F8BBD0",
              },
            ]}
          >
            <Text
              style={[
                styles.volunteerText,
                {
                  color: "#D32F2F",
                  fontWeight: "bold",
                },
              ]}
            >
              {` Collected by ${
                item.volunteer.username
                  ? item.volunteer.username === user.username
                    ? " you "
                    : item.volunteer.username
                  : "...loading"
              } at ${moment(item.collected_time).fromNow()}`}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => {
              item.status !== "distributed"
                ? onVolunteerAdd(item && item._id)
                : alert("Item already distributed");
            }}
            style={[
              styles.btnStyles,
              {
                backgroundColor: "#B9F6CA",
              },
            ]}
          >
            <Text
              style={[
                styles.volunteerText,
                {
                  color: "#2E7D32",
                  fontWeight: "bold",
                },
              ]}
            >
              {` Distributed by ${
                item.volunteer.username
                  ? item.volunteer.username === user.username
                    ? " you "
                    : item.volunteer.username
                  : "...loading"
              } ${moment(item.distributed_time).fromNow()}`}
            </Text>
          </TouchableOpacity>
        )
      ) : (
        <TouchableOpacity
          onPress={() => onVolunteerAdd(item && item._id)}
          style={[
            styles.btnStyles,
            {
              backgroundColor: "#BBDEFB",
            },
          ]}
        >
          <Text
            style={[
              styles.volunteerText,
              {
                color: "#1565C0",
                fontWeight: "bold",
              },
            ]}
          >
            Are you Available now ?
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    marginVertical: 10,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
    elevation: 10,
  },
  btnStyles: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },

  volunteerText: {
    textAlign: "center",
    color: "white",
  },

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
  txt: {
    color: "white",
    textAlign: "center",
  },
});
