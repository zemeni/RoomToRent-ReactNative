import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Image, Modal, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ListView = () => {
  const navigation = useNavigation();

  // Dummy data for rooms
  const rooms = [
    {
      id: '1',
      address: '123 Fake St, Melbourne, VIC',
      price: 1500,
      description: 'A cozy room in a great location.',
      bathrooms: 1,
      parkings: 1,
      images: [
        'https://via.placeholder.com/150',
        'https://via.placeholder.com/150'
      ]
    },
    {
      id: '2',
      address: '456 Another St, Sydney, NSW',
      price: 2000,
      description: 'Spacious room with modern amenities.',
      bathrooms: 2,
      parkings: 2,
      images: [
        'https://via.placeholder.com/150',
        'https://via.placeholder.com/150'
      ]
    },
    // Add more rooms as needed
  ];

  const handlePress = (room) => {
    navigation.navigate('DetailsPage', { room });
  };

  const renderItem = ({ item }) => (
      <TouchableOpacity onPress={() => handlePress(item)} style={styles.itemContainer}>
        <Text style={styles.itemText}>{item.address}</Text>
      </TouchableOpacity>
  );

  return (
      <FlatList
          data={rooms}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
      />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 10,
  },
  itemContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemText: {
    fontSize: 18,
  },
});

export default ListView;
