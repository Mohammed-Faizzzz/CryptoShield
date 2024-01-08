import React from 'react';
import { View, Text } from 'react-native';
import { Concert } from '../app/types';

interface ConcertCardProps {
  concert: Concert;
}

const ConcertCard: React.FC<ConcertCardProps> = ({ concert }) => {
  return (
    <View>
      <Text>Venue: {concert.venue}</Text>
      <Text>Date: {concert.date.toISOString()}</Text>
      {/* Render other concert details as needed */}
    </View>
  );
};

export default ConcertCard;
