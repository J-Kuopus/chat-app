import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Platform,
  KeyboardAvoidingView,
  Text,
  Button,
} from "react-native";
import { GiftedChat, Bubble, InputToolbar } from "react-native-gifted-chat";
import { db } from "../config/firebase";
import {
  collection,
  onSnapshot,
  addDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import MapView from "react-native-maps";
import CustomActions from "./CustomActions.js";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";

export default function Chat(props) {
  let { name, bgColor } = props.route.params;
  const [messages, setMessages] = useState([]);
  const [uid, setUid] = useState("");
  const [loggedInText, setText] = useState("");
  const [isOnline, setOnline] = useState();

  const auth = getAuth();

  // Variable for storing messages
  const messagesCollection = collection(db, "messages");

  useEffect(() => {
    props.navigation.setOptions({ title: name });

    // User is online - retrieve messages from firebase store, if offline use AsyncStorage
    NetInfo.fetch().then((connection) => {
      setOnline(connection.isConnected);
      if (!connection.isConnected) {
        // Get messages for AsyncStorage
        getMessages();
      } else {
        // Get messages collection and sort by query
        const messagesQuery = query(
          messagesCollection,
          orderBy("createdAt", "desc")
        );

        // Event listener for authentication
        const authUnsubscribe = onAuthStateChanged(auth, (user) => {
          if (!user) {
            signInAnonymously(auth);
          }

          // Updates user state
          setUid(user.uid);
          setText(`User ${user.uid}`);
          console.log(user.uid);
        });

        // Stop listening for collection changes
        let stopListeningToSnapshots = onSnapshot(
          messagesQuery,
          onCollectionUpdate
        );

        return () => {
          stopListeningToSnapshots();
          authUnsubscribe();
        };
      }
    });
  }, [isOnline]);


  // GET messages from firestore collection (snapshot) and update state
  const onCollectionUpdate = (querySnapshot) => {
    let mess = [];
    querySnapshot.forEach((doc) => {
      // get the QueryDocumentSnapshot's data
      mess.push({
        _id: doc.data()._id,
        createdAt: doc.data().createdAt.toDate(),
        text: doc.data().text,
        user: doc.data().user,
        location: doc.data().location,
        image: doc.data().image,
      });
    });
    //Update state
    setMessages(mess);
    //Update asyncStorage
    saveMessages(mess);
  };

  // Add message to firestore collection
  const addMessage = (message) => {
    addDoc(messagesCollection, {
      _id: message._id,
      createdAt: message.createdAt,
      text: message.text || "",
      user: message.user,
      image: message.image || null,
      location: message.location || null,
    });
  };

  // Append new messages and add to firestore collection
  const onSend = (newMessages = []) => {
    setMessages((prevMessages) => GiftedChat.append(prevMessages, newMessages));
    // Last message appended to collection
    addMessage(newMessages[0]);
  };

  // Get messages from AsyncStorage
  const getMessages = async () => {
    let mesg = "";
    try {
      mesg = (await AsyncStorage.getItem("messages")) || [];
      setMessages(JSON.parse(mesg));
      console.log("Messages fetched from Async Storage", mesg);
    } catch (error) {
      console.log(error.message);
    }
  };
  // ADD messages to asyncStorage
  const saveMessages = async (messages) => {
    try {
      await AsyncStorage.setItem("messages", JSON.stringify(messages));
    } catch (error) {
      console.log(error.message);
    }
  };
  // Delete messages from AsyncStorage
  const deleteMessages = async () => {
    try {
      await AsyncStorage.removeItem("messages");
      setMessages([]);
    } catch (error) {
      console.log(error.message);
    }
  };

  // Render message bubble w/styling
  const renderBubble = (props) => (
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
        },
      }}
    />
  );

  const renderInputToolbar = (props) => {
    if (!isOnline) {
      return <></>;
    } else {
      return <InputToolbar {...props} />;
    }
  };

  // Render Action Sheet for custom user actions
  const renderCustomActions = (props) => {
    return <CustomActions {...props} />;
  };
  // Render Map View
  const renderCustomView = (props) => {
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
  };

  return (
    <ActionSheetProvider>
      <View
        style={{
          flex: 1,
          backgroundColor: bgColor,
        }}
      >
        <Text>{loggedInText}</Text>
        {/* Chat UI */}
        <GiftedChat
          messages={messages}
          onSend={onSend}
          user={{
            _id: uid,
            name: name,
            avatar:
              "https://placeimg.com/140/140/any",
          }}
          showUserAvatar={true}
          showAvatarForEveryMessage={true}
          renderBubble={renderBubble}
          renderInputToolbar={renderInputToolbar}
          renderActions={renderCustomActions}
          renderCustomView={renderCustomView}
          renderUsernameOnMessage={true}
        />
        {Platform.OS === "android" ? (
          <KeyboardAvoidingView behavior="height" />
        ) : null}
      </View>
    </ActionSheetProvider>
  );
}