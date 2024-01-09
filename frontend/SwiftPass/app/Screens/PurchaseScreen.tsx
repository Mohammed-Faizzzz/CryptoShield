import { View, Text } from 'react-native'
import React from 'react'
import { Concert } from './../types';

const PurchaseScreen = ({ navigation, route }) => {
  const concert: Concert = route.params;
  return (
    <View>
      <Text>Purchase Screen for {concert.name}</Text>
    </View>
  )
}

export default PurchaseScreen