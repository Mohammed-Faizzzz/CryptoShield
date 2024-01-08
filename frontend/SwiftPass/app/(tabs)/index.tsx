import { StyleSheet } from 'react-native';

import EditScreenInfo from '../../components/EditScreenInfo';
import { Text, View } from '../../components/Themed';

export default function TabOneScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab One</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="app/(tabs)/index.tsx" />
    </View>
  );
}
// // ConcertsScreen.tsx
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const ConcertsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
//   const [concerts, setConcerts] = useState([]);

//   useEffect(() => {
//     const fetchConcerts = async () => {
//       try {
//         const response = await axios.get('http://your-backend-url/api/concerts');
//         setConcerts(response.data);
//       } catch (error) {
//         console.error('Error fetching concerts:', error);
//       }
//     };

//     fetchConcerts();
//   }, []);

//   return (
//     <View style={styles.container}>
//       {concerts.map((concert) => (
//         <TouchableOpacity
//           key={concert._id}
//           onPress={() => navigation.navigate('Tickets', { concert })}
//         >
//           <Text>{concert.artist} - {concert.venue}</Text>
//         </TouchableOpacity>
//       ))}
//     </View>
//   );
// };

// export default ConcertsScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
