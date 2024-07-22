// File: ThirstyHouse.js

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { NGROK_URL } from '@env'; // Import NGROK_URL

const ThirstyHouse = () => {
  const [restaurant, setRestaurant] = useState(null);
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRestaurantAndDishes = async () => {
      try {
        // Fetch restaurant details
        const restaurantResponse = await fetch(`${NGROK_URL}/api/restaurants`);
        if (restaurantResponse.ok) {
          const restaurantData = await restaurantResponse.json();
          const restaurant = restaurantData.find(rest => rest.id === 1);
          setRestaurant(restaurant);
        } else {
          console.error('Failed to load restaurant', restaurantResponse.statusText);
          setError('Failed to load restaurant');
        }

        // Fetch dishes
        const dishesResponse = await fetch(`${NGROK_URL}/api/products?restaurant=1`);
        if (dishesResponse.ok) {
          const dishesData = await dishesResponse.json();
          const sortedData = dishesData.sort((a, b) => a.cost - b.cost);
          setDishes(sortedData);
        } else {
          console.error('Failed to load dishes', dishesResponse.statusText);
          setError('Failed to load dishes');
        }
      } catch (error) {
        console.error('Error:', error); // Log the error
        setError('Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantAndDishes();
  }, []);

  const renderDish = ({ item }) => (
    <View style={styles.dishContainer}>
      <Image source={require('../../assets/images/images2/BetterDonutBurger.jpg')} style={styles.dishImage} />
      <View style={styles.dishTextContainer}>
        <Text style={styles.dishName}>{item.name}</Text>
        <Text style={styles.dishPrice}>${(item.cost / 100).toFixed(2)}</Text>
      </View>
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
      {restaurant && (
        <View style={styles.restaurantDetails}>
          <Image source={require('../../assets/images/images2/VeryThirstyHouse.jpg')} style={styles.restaurantImage} />
          <View>
            <Text style={styles.restaurantName}>{restaurant.name}</Text>
            <Text style={styles.restaurantInfo}>Price Range: {restaurant.price_range}</Text>
            <Text style={styles.restaurantInfo}>Rating: {restaurant.rating}</Text>
          </View>
        </View>
      )}
      <FlatList
        data={dishes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderDish}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  loadingText: {
    fontSize: 20,
    color: '#000',
  },
  errorText: {
    fontSize: 20,
    color: 'red',
  },
  restaurantDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  restaurantImage: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  restaurantName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  restaurantInfo: {
    fontSize: 18,
    color: '#555',
  },
  dishContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  dishImage: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  dishTextContainer: {
    flex: 1,
  },
  dishName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  dishPrice: {
    fontSize: 18,
    color: '#555',
  },
});

export default ThirstyHouse;

