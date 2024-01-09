// HomeScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, FlatList, Text } from 'react-native';
import { Concert } from '../types';
import axios from 'axios';

import ConcertCard from '../../components/ConcertCard'; // Import the ConcertCard component
import baseURL from './../../assets/common/baseUrl';

const HomeScreen: React.FC = () => {
  const [concerts, setConcerts] = useState<Concert[]>([]);

  useEffect(() => {
    const fetchConcerts = async () => {
      try {
        const response = await axios.get<Concert[]>(`${baseURL}concerts`);
        setConcerts(response.data);
      } catch (error) {
        console.error('Error fetching concerts:', error);
      }
    };

    fetchConcerts();
  }, []);

  return (
    <View>
      {concerts.length === 0 ? (
        <Text>No concerts available</Text>
      ) : (
        <FlatList
          data={concerts}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <ConcertCard concert={item} />}
        />
      )}
    </View>
  );
};

export default HomeScreen;
