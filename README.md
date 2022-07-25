# Chat App

## Description
- This is a chat application for use with mobile devices built using React-Native. The app allows users to send texts, take photos, share photos from their media library, and also to share their location.

## Images

![Chap App Image 1](img/Chat-app1.jpg?raw=true "Title")
<br/>
![Chat App Image 2](img/Chat-app2.jpg?raw=true "Title")

## Features
- A start screen where users can enter a name and choose a background color for the chat screen.
- A chat screen where users can type messages into an input field, and a "send" button to submit them to each other.
- A custom actions button that allows users to upload photos from their media library, access their camera to take a photo and upload it, as well as send their location coordinates. 
- Messages are stored online with Google Firestore and offline in Local Storage so users can access their conversations. 

## Technical Requirements

- **React Native**
- **Expo**
- **React Navigation** third party library
- **React Native Gifted Chat** library
- **Android Studio**
- **Node.js** and **Node Package Manager**

## Setting up Development Environment

- Open a new terminal in your IDE of choice and install Expo by running the command `npm install expo-cli --global`
- Create a new Expo project with the command `expo init [project-name]`
- Install the Expo App on your smart phone for testing. It can be found in your preferred app store. 
- Go to the Expo signup page and follow the instructions for creating an account. Then you will be able to login and use Expo in your browser and/or mobile device using the Expo App.
- To launch the application from the CLI, navigate to the project folder and run the command `expo start`

## Installing Dependencies

- Navigate to the project folder and install the necessary packages:
   - React-Navigation: run `npm install react-navigation`
   - Dependencies: `npm install @react-navigation/native @react-navigation/stack` and `expo install react-native-reanimated react-native-gesture-handler react-native-      screens react-native-safe-area-context @react-native-community/masked-view`
   - Gifted Chat: `npm install react-native-gifted-chat`
     - To import Gifted Chat into your app use: import { GiftedChat } from 'react-native-gifted-chat';
     - To set up the chat, follow these instructions: https://github.com/FaridSafi/react-native-gifted-chat
- You can also set up offline functionality by implementing **Async Storage** :
 - Install Async Storage package: `expo install @react-native-community/async-storage`
   - Import AsyncStorage into the chat screen file: import AsyncStorage from '@react-native-community/async-storage';
   - Create function for storing and retrieving data from AsyncStorage

## Setting up Android Studio for testing

- Download and install **Android Studio** 
   - Make sure 'Android Virtual Device' is installed
   - Add Android SDK Location to ~/.zshrc file
      - export ANDROID_SDK=/Users/myuser/Library/Android/sdk
      - export PATH=/Users/myuser/Library/Android/sdk/platform-tools:$PATH
   - Create virtual device: (with More actions > Virtual Device Manager) and click Play to start
   - Select 'Run app on Android' in Expo to run app on virtual device
   
## Setting up Google Firestore-Firebase for data storage

- Navigate to the project folder and install firebase with `npm install firebase`
- Import firestore in the file where the chat screen component is located: 
    import { initializeApp } from "firebase/app";
    import { getFirestore } from "firebase/firestore";
- Go to the Google Firebase website and log in with a Google account
  - Click **Go to the Console** and follow the instructions for setting up a new database (Create Project)
  - You'll recieve a config code, import this code into your chat screen file
  - Click on **Storage** to set up cloud storage for messages and images
  - You can also set up anonymous authentication in the firebase console
  
