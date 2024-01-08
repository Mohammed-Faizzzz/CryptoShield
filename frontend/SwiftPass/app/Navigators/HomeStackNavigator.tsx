import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../Screens/HomeScreen';
import TicketScreen from '../Screens/TicketScreen';

const HomeStack = createStackNavigator();

export const HomeStackScreen = () => {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="HomeScreen"
        component={HomeScreen} // Replace with the actual component for the home screen
        options={{ title: 'Concerts' }} // If you don't want a header
      />
      <HomeStack.Screen
        name="Tickets"
        component={TicketScreen} // Replace with the actual component for the tickets screen
        options={{ title: 'Tickets' }}
      />
    </HomeStack.Navigator>
  );
};

export default HomeStackScreen;