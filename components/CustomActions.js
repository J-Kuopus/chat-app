import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import PropTypes from "prop-types";

// Imports firestore/firebase modules
import { initializeApp } from "firebase/compat/app";
import 'firebase/firestore';
import firebase from 'firebase/compat';
import firestore from 'firebase/compat/app';

// Imports expo communication modules
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";

export default class CustomActions extends React.Component {

    // Lets user pick an image from device's media library
    pickImage = async () => {
      // expo permission
      const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
      try {
        if (status === "granted") {
          // pick image
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images, // only images are allowed
          }).catch((error) => console.log(error));
          // canceled process
          if (!result.cancelled) {
            const imageUrl = await this.uploadImageFetch(result.uri);
            this.props.onSend({ image: imageUrl });
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    // Lets user take a photo with device's camera
    takePhoto = async () => {
      const { status } = await Permissions.askAsync(
        Permissions.CAMERA,
        Permissions.MEDIA_LIBRARY
      );
      try {
        if (status === "granted") {
          const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
          }).catch((error) => console.log(error));
    
          if (!result.cancelled) {
            const imageUrl = await this.uploadImageFetch(result.uri);
            this.props.onSend({ image: imageUrl });
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    // Gets location of user using GPS
    getLocation = async () => {
      try {
        const { status } = await Permissions.askAsync(Permissions.LOCATION_FOREGROUND);
        if (status === "granted") {
          const result = await Location.getCurrentPositionAsync(
            {}
          ).catch((error) => console.log(error));
          const longitude = JSON.stringify(result.coords.longitude);
          const altitude = JSON.stringify(result.coords.latitude);
          if (result) {
            this.props.onSend({
              location: {
                longitude: result.coords.longitude,
                latitude: result.coords.latitude,
              },
            });
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    // Creates action button that renders action sheet for communication feature options
    onActionPress = () => {
      const options = [
        'Choose From Library', 
        'Take Picture', 
        'Send Location', 
        'Cancel'];

      const cancelButtonIndex = options.length - 1;
      this.context.actionSheet().showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex,
        },
        async (buttonIndex) => {
          switch (buttonIndex) {
            case 0:
              console.log('user wants to pick an image');
              return this.pickImage();
            case 1:
              console.log('user wants to take a photo');
              return this.takePhoto();
            case 2:
              console.log('user wants to get their location');
              return this.getLocation();
            default:
          }
        },
      );
    };

    render() {
        return (
          <TouchableOpacity
            accessible={true}
            accessibilityLabel="More options"
            accessibilityHint="Lets you choose to send an image or your geolocation."
            style={styles.container} 
            onPress={this.onActionPress}
          >
            <View style={[styles.wrapper, this.props.wrapperStyle]}>
              <Text style={[styles.iconText, this.props.iconTextStyle]}>+</Text>
            </View>
          </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: {
      width: 26,
      height: 26,
      marginLeft: 10,
      marginBottom: 10,
    },
    wrapper: {
      borderRadius: 13,
      borderColor: '#b2b2b2',
      borderWidth: 2,
      flex: 1,
    },
    iconText: {
      color: '#b2b2b2',
      fontWeight: 'bold',
      fontSize: 16,
      backgroundColor: 'transparent',
      textAlign: 'center',
    },
   });

   
CustomActions.contextTypes = {
  actionSheet: PropTypes.func,
};