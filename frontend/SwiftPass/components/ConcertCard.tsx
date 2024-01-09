import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Concert } from './../app/types';
import { useNavigation } from '@react-navigation/native';

interface ConcertCardProps {
  concert: Concert;
}

const ConcertCard: React.FC<ConcertCardProps> = ({ concert }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate("Purchase", {...concert});
  };

  const formatReadableDate = (isoDate: string) => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    };

    const formattedDate = new Date(isoDate).toLocaleDateString(undefined, options);
    return formattedDate;
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <View>
        <Text>Name: {concert.name}</Text>
        <Text>Organiser: {concert.organiser}</Text>
        <Text>Venue: {concert.venue}</Text>
        <Text>Date: {formatReadableDate(concert.date.toString())}</Text>
        {/* Render other concert details as needed */}
      </View>
    </TouchableOpacity>
  );
};

export default ConcertCard;
