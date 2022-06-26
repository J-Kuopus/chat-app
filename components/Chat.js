import React from 'react';
import { GiftedChat } from 'react-native-gifted-chat'
import { View, Text, StyleSheet } from 'react-native';

// Renders the Chat page
export default class Chat extends React.Component {

  render() {
     // Loads username and background color from Start screen
     let { name, bgColor } = this.props.route.params;
  
     this.props.navigation.setOptions({ title: name });
   

    return (
      /* Renders background color */
      <View style={[{ backgroundColor: bgColor }, styles.container]}>
        {/* Rest of the UI */}
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