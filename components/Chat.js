import React from 'react';
import { View, Text } from 'react-native';

export default class Chat extends React.Component {

  render() {
     // Loads username and background color from Start screen
     let { name, bgColor } = this.props.route.params;
  

    this.props.navigation.setOptions({ title: name });
    this.props.navigation.setOptions({ backgroundColor: bgColor})

    return (
      <View>
        {/* Rest of the UI */}
      </View>
    );
  };
}