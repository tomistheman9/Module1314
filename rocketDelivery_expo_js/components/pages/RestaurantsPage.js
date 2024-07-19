// File: RestaurantsPage.js

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, Image, TouchableOpacity } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook

const RestaurantsPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRating, setSelectedRating] = useState(null);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const navigation = useNavigation(); // Use navigation hook

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await fetch('https://20ff-24-192-233-98.ngrok-free.app/api/restaurants');
        if (response.ok) {
          const data = await response.json();
          setRestaurants(data);
        } else {
          setError('Failed to load restaurants');
        }
      } catch (error) {
        setError('Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  const handleSort = () => {
    let sortedRestaurants = [...restaurants];

    if (selectedRating) {
      sortedRestaurants = sortedRestaurants.filter((restaurant) => restaurant.rating == selectedRating);
    }

    if (selectedPrice) {
      sortedRestaurants = sortedRestaurants.filter((restaurant) => restaurant.price_range == selectedPrice);
    }

    return sortedRestaurants;
  };

  const renderRestaurant = ({ item }) => (
    <View style={styles.restaurantContainer}>
      <TouchableOpacity onPress={() => navigation.navigate('ThirstyHouse')}>
        <Image source={require('../../assets/images/FoodPic.jpg')} style={styles.restaurantImage} />
      </TouchableOpacity>
      <Text style={styles.restaurantName}>{item.name}</Text>
      <Text style={styles.restaurantDetails}>{item.address}</Text>
      <Text style={styles.restaurantDetails}>Price Range: {item.price_range}</Text>
      <Text style={styles.restaurantDetails}>Rating: {item.rating}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.dropdownContainer}>
        <View style={styles.dropdownWrapper}>
          <Text style={styles.dropdownLabel}>Rating</Text>
          <RNPickerSelect
            onValueChange={(value) => setSelectedRating(value)}
            items={[
              { label: '1', value: 1 },
              { label: '2', value: 2 },
              { label: '3', value: 3 },
              { label: '4', value: 4 },
              { label: '5', value: 5 },
            ]}
            placeholder={{ label: '--Select--', value: null }}
            style={{
              inputIOS: styles.dropdown,
              inputAndroid: styles.dropdown,
              placeholder: styles.placeholder, // Added placeholder style
            }}
          />
        </View>
        <View style={styles.dropdownWrapper}>
          <Text style={styles.dropdownLabel}>Price</Text>
          <RNPickerSelect
            onValueChange={(value) => setSelectedPrice(value)}
            items={[
              { label: '1', value: 1 },
              { label: '2', value: 2 },
              { label: '3', value: 3 },
            ]}
            placeholder={{ label: '--Select--', value: null }}
            style={{
              inputIOS: styles.dropdown,
              inputAndroid: styles.dropdown,
              placeholder: styles.placeholder, // Added placeholder style
            }}
          />
        </View>
      </View>
      <FlatList
        data={handleSort()}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderRestaurant}
        numColumns={2}
        columnWrapperStyle={styles.row}
        key={selectedRating + '_' + selectedPrice} // Add key prop to force re-render
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 20,
    color: '#000',
  },
  errorText: {
    fontSize: 20,
    color: 'red',
  },
  dropdownContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  dropdownWrapper: {
    alignItems: 'center',
  },
  dropdownLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  dropdown: {
    width: 150,
    padding: 10,
    backgroundColor: 'orange',
    borderRadius: 5,
    textAlign: 'center',
  },
  placeholder: {
    color: '#000', // Set placeholder color
    textAlign: 'center', // Center placeholder text
  },
  row: {
    flex: 1,
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  restaurantContainer: {
    width: (Dimensions.get('window').width / 2) - 30,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    alignItems: 'center', // Align items to center to place image above text
  },
  restaurantImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  restaurantDetails: {
    fontSize: 16,
    color: '#555',
  },
});

export default RestaurantsPage;


