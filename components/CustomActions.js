import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import PropTypes from 'prop-types';
import { useActionSheet } from '@expo/react-native-action-sheet';
// Imports firestore/firebase modules
import { initializeApp } from 'firebase/compat/app';
import 'firebase/firestore';
import firebase from 'firebase/compat';
import firestore from 'firebase/compat/app';
import {getDownloadURL, ref, uploadBytes} from 'firebase/storage';

// Imports expo communication modules
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

export default function CustomActions(props) {
  const {showActionSheetWithOptions} = useActionSheet();

    // Upload images to firestore
    async function imageUpload(uri) {
      const img = await fetch(uri);
      const imgBlob = await img.blob();
  
      const imageNameBefore = uri.split("/");
      const imageName = imageNameBefore[imageNameBefore.length - 1];
  
      const ref = firebase.storage().ref().child(`images/${imageName}`);
      
      return uploadBytes(ref, imgBlob)
      .then(async snapshot => {
        imgBlob.close();
        return getDownloadURL(snapshot.ref).then(url => {
          return url;
        });
      });
    }

    // Lets user pick an image from device's media library
    async function pickImage() {
      const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
      try {
        if (status === 'granted') {
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images
          }).catch((error) => console.error(error));

          if (!result.cancelled) {
            const imageUrl = await imageUpload(result.uri);
            props.onSend({image: imageUrl});
          }
        }
      } catch (error){
        console.error(error);
      }
    }
/*     pickImage = async () => {
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
            const imageUrl = await this.imageUpload(result.uri);
            this.props.onSend({ image: imageUrl });
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    }; */

    // Lets user take a photo with device's camera
    async function takePhoto() {
      const {status} = await ImagePicker.requestCameraPermissionsAsync();
      try {
        if (status === 'granted') {
          let result = await ImagePicker.launchCameraAsync({
           mediaTypes: ImagePicker.MediaTypeOptions.Images, 
          }).catch(error => console.error (error));
          if (!result.cancelled) {
            const imageUrl = await imageUpload(result.uri);
            props.onSend({image: imageUrl});
            console.log('props.onSend triggered', imageUrl)
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
   /*  takePhoto = async () => {
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
            const imageUrl = await this.imageUpload(result.uri);
            this.props.onSend({ image: imageUrl });
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    }; */

    // Gets location of user using GPS
    async function getLocation() {
      const {status} = await Location.requestForegroundPermissionsAsync();
      try {
        if (status === 'granted') {
          const result = await Location.getCurrentPositionAsync({})
          .catch((error) => {
            console.error(error);
          });
          if (result) {
            props.onSend({
              location: {
                longitude: result.coords.longitude,
                latitude: result.coords.latitude,
              },
            });
          }
        }
      } catch (error) {
        consonle.error(error);
      }
    }
/*     getLocation = async () => {
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
    }; */

    // Creates action button that renders action sheet for communication feature options
    function onActionPress() {
      const options = [
        'Choose From Library', 
        'Take Picture', 
        'Send Location', 
        'Cancel'];

      const cancelButtonIndex = options.length - 1;

      showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex,
        },
        async (buttonIndex) => {
          switch (buttonIndex) {
            case 0:
              console.log('user wants to pick an image');
              return pickImage();
            case 1:
              console.log('user wants to take a photo');
              return takePhoto();
            case 2:
              console.log('user wants to get their location');
              return getLocation();
            default:
          }
        },
      );
    };
        return (
          <TouchableOpacity
            accessible={true}
            accessibilityLabel="More options"
            accessibilityHint="Lets you choose to send an image or your geolocation."
            style={styles.container} 
            onPress={onActionPress}
          >
            <View style={[styles.wrapper]}>
              <Text style={[styles.iconText]}>+</Text>
            </View>
          </TouchableOpacity>
        );
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

/* const CustomActions = connectActionSheet(CustomActions); */