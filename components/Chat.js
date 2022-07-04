import React from 'react';
import { GiftedChat, Bubble } from 'react-native-gifted-chat'
import { View, Text, StyleSheet, Platform, KeyboardAvoidingView } from 'react-native';
import { initializeApp } from "firebase/compat/app";
import 'firebase/firestore';
import firebase from 'firebase/compat';
import firestore from 'firebase/compat/app';

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

  onSend(messages = []) {
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }), () => {
      this.addMessage();
    });
  }

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

  render() {
     // Loads username and background color from Start screen
     let { name, bgColor } = this.props.route.params;
   

    return (
      /* Renders background color */
      <View style={[{ backgroundColor: bgColor }, styles.container]}>
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          onSend={(messages) => this.onSend(messages)}
          user={{
            _id: 1,
          }}
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