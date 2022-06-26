import React from 'react';
import { GiftedChat, Bubble } from 'react-native-gifted-chat'
import { View, Text, StyleSheet, Platform, KeyboardAvoidingView } from 'react-native';

// Renders the Chat page
export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
       messages: [],
    };
  }

  componentDidMount() {
    let { name } = this.props.route.params;
    this.setState({
      messages: [
        {
          _id: 1,
          text: "Welcome to the chat!",
          createdAt: new Date(),
          user: {
            _id: 2,
            name: "React Native",
            avatar: "https://placeimg.com/140/140/any",
          },
        },
        {
          _id: 2,
          text: name + ' has entered the chat',
          createdAt: new Date(),
          system: true,
         },
       ],
     });
   }


  onSend(messages = []) {
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
  }

  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#032f57'
          },
          left: {
            backgroundColor: '#fff'
          }
        }}
      />
    )
  }

  render() {
     // Loads username and background color from Start screen
     let { name, bgColor } = this.props.route.params;
  
     this.props.navigation.setOptions({ title: name });
   

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