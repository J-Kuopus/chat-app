import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default class Chat extends React.Component {

  render() {
     // Loads username and background color from Start screen
     let { name, bgColor } = this.props.route.params;
  
     this.props.navigation.setOptions({ title: name });
   

    return (
      <View style={[{ backgroundColor: bgColor }, styles.container]}>
        {/* Rest of the UI */}
      </View>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})