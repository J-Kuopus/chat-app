import React from 'react';

// Imports react native gesture handler
import 'react-native-gesture-handler';

// Imports react navigation
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Imports the screens to navigate to
import Start from './components/Start';
import Chat from './components/Chat';

// Creates the navigator
const Stack = createStackNavigator();

export default function App() {

    return (
      <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Screen1">
            <Stack.Screen
              name="Start"
              component={Start}
            />
            <Stack.Screen
              name="Chat"
              component={Chat} 
            />
          </Stack.Navigator>
      </NavigationContainer>
    );
}

