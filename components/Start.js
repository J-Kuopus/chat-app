import React, { useState } from "react";
import {
  ImageBackground,
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
} from "react-native";

import image from "../img/BackgroundImage.png";

// Renders Start page
export default function Start(props) {
  const [name, setName] = useState(" ");
  const [bgColor, setColor] = useState(" ");

  // Background colors
  const colors = {
    black: "#090C08",
    darkgray: "#474056",
    gray: "#8A95A5",
    green: "#B9C6AE",
  };

  return (
    // Main container
    <View style={{flex: 1,}}
    >
      <ImageBackground source={image} resizeMode="cover" style={styles.image}>
        <Text style={styles.titleText}>Let's Chat!</Text>

        {/* Username input */}
        <View style={styles.view}>
          <View style={styles.inputBox}>
            <TextInput
              style={styles.input}
              onChangeText={(name) => setName(name)}
              value={name}
              placeholder="Your name"
            ></TextInput>
          </View>

          {/* Choose background color for chat screen */}
          <View style={styles.colorBox}>
            <Text
              style={styles.chooseColor}
              accessibilityHint="Lets you choose from four different background colors."
            >
              Choose background color
            </Text>
          </View>

          {/* Background color buttons */}
          <View style={styles.colorPalette}>
            <TouchableOpacity
              style={styles.color1}
              onPress={() => setColor(colors.black)}
              accessibilityLabel="black"
            ></TouchableOpacity>
            <TouchableOpacity
              style={[styles.color1, styles.color2]}
              onPress={() => setColor(colors.darkgray)}
              accessibilityLabel="dark gray"
            ></TouchableOpacity>
            <TouchableOpacity
              style={[styles.color1, styles.color3]}
              onPress={() => setColor(colors.gray)}
              accessibilityLabel="gray"
            ></TouchableOpacity>
            <TouchableOpacity
              style={[styles.color1, styles.color4]}
              onPress={() => setColor(colors.green)}
              accessibilityLabel="green"
            ></TouchableOpacity>
          </View>

          {/* Button that navigates to chat page */}
          <Pressable
            style={styles.button}
            onPress={() =>
              props.navigation.navigate("Chat", {
                name,
                bgColor,
              })
            }
          >
            <Text style={styles.buttonText}>Start Chatting</Text>
          </Pressable>
        </View>
      </ImageBackground>
      {/* Ensures that the input field won’t be hidden beneath the keyboard */}
      {Platform.OS === "android" ? (
        <KeyboardAvoidingView behavior="height" />
      ) : null}
    </View>
  );
}

// Styling elements
const styles = StyleSheet.create({
  titleText: {
    fontSize: 45,
    fontWeight: "600",
    color: "#FFFFFF",
  },

  image: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
  },

  view: {
    backgroundColor: "#FFFFFF",
    minHeight: "44%",
    width: "88%",
    justifyContent: "space-around",
    alignItems: "center",
    paddingTop: 15,
    paddingBottom: 25,
  },

  inputBox: {
    borderWidth: 2,
    borderRadius: 1,
    borderColor: "grey",
    width: "88%",
    height: 60,
    paddingLeft: 20,
    flexDirection: "row",
    alignItems: "center",
  },

  input: {
    fontSize: 16,
    fontWeight: "300",
    color: "#757083",
    opacity: 0.5,
  },

  chooseColor: {
    fontSize: 16,
    fontWeight: "300",
    color: "#757083",
    opacity: 100,
  },

  colorBox: {
    marginRight: "auto",
    paddingLeft: 15,
    width: "88%",
    paddingTop: 10,
  },

  colorPalette: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    paddingTop: 15,
    paddingBottom: 23,
  },

  color1: {
    backgroundColor: "#090C08",
    width: 50,
    height: 50,
    borderRadius: 25,
  },

  color2: {
    backgroundColor: "#474056",
    width: 50,
    height: 50,
    borderRadius: 25,
  },

  color3: {
    backgroundColor: "#8A95A5",
    width: 50,
    height: 50,
    borderRadius: 25,
  },

  color4: {
    backgroundColor: "#B9C6AE",
    width: 50,
    height: 50,
    borderRadius: 25,
  },

  button: {
    width: "88%",
    height: 70,
    borderRadius: 6,
    backgroundColor: "#757083",
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});