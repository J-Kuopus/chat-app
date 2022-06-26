import React from 'react';
import { GiftedChat } from 'react-native-gifted-chat'
import { View, Text, StyleSheet } from 'react-native';

// Renders the Chat page
export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
       messages: [
        {
          _id: 1,
          text: "Hello developer",
          createdAt: new Date(),
          user: {
            _id: 2,
            name: "React Native",
            avatar: "https://placeimg.com/140/140/any",
          },
        },
      ],
    };
  }

  onSend(messages = []) {
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
  }

  render() {
     // Loads username and background color from Start screen
     let { name, bgColor } = this.props.route.params;
  
     this.props.navigation.setOptions({ title: name });
   

    return (
      /* Renders background color */
      <View style={[{ backgroundColor: bgColor }, styles.container]}>
        <GiftedChat
          messages={this.state.messages}
          onSend={(messages) => this.onSend(messages)}
          user={{
            _id: 1,
          }}
        />
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