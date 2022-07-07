import React from 'react';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import { View, Text, StyleSheet, Platform, KeyboardAvoidingView } from 'react-native';
import { initializeApp } from "firebase/compat/app";
import 'firebase/firestore';
import firebase from 'firebase/compat';
import firestore from 'firebase/compat/app';
import CustomActions from './CustomActions';

// Imports MapView from "react-native-maps";
import { Constants, MapView, Location, Permissions } from 'expo';

// Imports asyncstorage
import AsyncStorage from '@react-native-async-storage/async-storage'
import NetInfo from '@react-native-community/netinfo';

// Imports firebase
/* const firebase = require('firebase/app');
require('firebase/firestore'); */

const firebaseConfig = {
  apiKey: "AIzaSyC4Mks67a5pf5KN23qsYi7cGLJvsgWBD0g",
  authDomain: "meet-app-352610.firebaseapp.com",
  projectId: "meet-app-352610",
  storageBucket: "meet-app-352610.appspot.com",
  messagingSenderId: "590789825703",
  appId: "1:590789825703:web:a31eb550ca5bc62f743782"
};

// Renders the Chat page
export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
       messages: [],
       user: {
        _id: "",
        name: "",
        avatar: "",
        image: null,
        location: null,
       },
       isConnected: false,
    };

  // Initializes firestore app
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  
  // Stores and retrieves chat messages
  this.referenceChatMessages = firebase.firestore().collection("messages");

  this.referenceMessagesUser = null;
}

  componentDidMount() {
    let { name } = this.props.route.params;
    this.props.navigation.setOptions({ title: name });

    // Reference to messages collection
    this.referenceChatMessages = firebase.firestore().collection("messages");

    // Finds user's connection status
    NetInfo.fetch().then(connection => {
      if (connection.isConnected) {
        this.setState({ isConnected: true });
        console.log('online');
      } else {
        console.log('offline');
      }

    // Authenticates user via Firebase
    this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        firebase.auth().signInAnonymously();
      }
        this.setState({
          uid: user.uid,
          messages: [],
            user: {
            _id: user.uid,
            name: name,
            avatar: "https://placeimg.com/140/140/any",
            },
        });

        this.referenceMessagesUser = firebase
          .firestore()
          .collection("messages")
          .where("uid", '==', this.state.uid);
                      
        // Saves user messages
        this.unsubscribe = this.referenceChatMessages
          .orderBy("createdAt", "desc")
          .onSnapshot(this.onCollectionUpdate);
    });
  });
  }

  // Retrieves messages
  async getMessages() {
    let messages = '';
    try {
      messages = await AsyncStorage.getItem('messages') || [];
      this.setState({
        messages: JSON.parse(messages)
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  // Stores messages
  async saveMessages() {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
    } catch (error) {
      console.log(error.message);
    }
  }

  // Deletes messages
  async deleteMessages() {
    try {
      await AsyncStorage.removeItem('messages');
      this.setState({
        messages: []
      })
    } catch (error) {
      console.log(error.message);
    }
  }

  // Stops recieving collection updates
  componentWillUnmount() {
    this.authUnsubscribe();
  }

   // Adds messages to cloud storage
  addMessage() {
    const message = this.state.messages[0];
    this.referenceChatMessages.add({
      uid: this.state.uid,
      _id: message._id,
      text: message.text || "",
      createdAt: message.createdAt,
      user: message.user,
      image: message.image || null,
      location: message.location || null,
    });
  }

  // Sends user messages
  onSend(messages = []) {
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }), () => {
      this.addMessage();
      this.saveMessages();
    });
  }

  // Updates messages collection
  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // Go through each document
    querySnapshot.forEach((doc) => {
      // Get the QueryDocumentSnapshot's data
      var data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: {
          _id: data.user._id,
          name: data.user.name,
          avatar: data.user.avatar
        },
        image: data.image || null,
        location: data.location || null,
      });
    });
    this.setState({
      messages: messages,
    });
  };
  
  // Disables input text bar when user is offline
  renderInputToolbar(props) {
    if (this.state.isConnected == false) {
    } else {
      return(
        <InputToolbar
        {...props}
        />
      );
    }
  }
  
  // Styles the text bubble on chat screen
  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#094025',
            borderRadius: 8,
            padding: 8
          },
          left: {
            backgroundColor: '#fff',
            borderRadius: 8,
            padding: 8
          }
        }}
      />
    )
  }

  renderCustomActions = (props) => {
    return <CustomActions {...props} />;
  };

  //custom map view
  renderCustomView(props) {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{ width: 150, height: 100, borderRadius: 13, margin: 3 }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
    return null;
  }

  render() {
     // Loads username and background color from Start screen
     let { name, bgColor } = this.props.route.params;
   

    return (
      /* Renders background color */
      <View style={[{ backgroundColor: bgColor }, styles.container]}>
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          renderInputToolbar={this.renderInputToolbar.bind(this)}
          onSend={(messages) => this.onSend(messages)}
          user={{
            _id: this.state.user._id,
            name: name,
            avatar: this.state.user.avatar
          }}
          renderActions={this.renderCustomActions}
          renderCustomView={this.renderCustomView}
        />
        { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null }
      </View>
    );
  };
}

// Styling elements
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})