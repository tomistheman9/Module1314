import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, Image, TouchableOpacity } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { useNavigation } from '@react-navigation/native';
import { NGROK_URL } from '@env';

const RestaurantsPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRating, setSelectedRating] = useState('--Select--');
  const [selectedPrice, setSelectedPrice] = useState('--Select--');
  const navigation = useNavigation();

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await fetch(`${NGROK_URL}/api/restaurants`);
        if (response.ok) {
          const data = await response.json();
          setRestaurants(data);
        } else {
          const errorData = await response.json();
          setError(`Failed to load restaurants: ${errorData.message}`);
        }
      } catch (error) {
        setError(`Something went wrong: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  const handleSort = () => {
    let sortedRestaurants = [...restaurants];

    if (selectedRating !== '--Select--') {
      sortedRestaurants = sortedRestaurants.filter((restaurant) => restaurant.rating == selectedRating);
    }

    if (selectedPrice !== '--Select--') {
      sortedRestaurants = sortedRestaurants.filter((restaurant) => restaurant.price_range == selectedPrice);
    }

    return sortedRestaurants;
  };

  const handleRestaurantPress = (restaurantId) => {
    if (restaurantId === 1) {
      navigation.navigate('ThirstyHouse');
    } else if (restaurantId === 2) {
      navigation.navigate('SpiceGrill');
    } else if (restaurantId === 3) {
      navigation.navigate('SpiceSushi');
    } else if (restaurantId === 4) {
      navigation.navigate('SweetSubs');
    } else if (restaurantId === 5) {
      navigation.navigate('FastJuiceBar');
    } else if (restaurantId === 6) {
      navigation.navigate('FastKing');
    } else if (restaurantId === 7) {
      navigation.navigate('SilverGrillTap');
    } else if (restaurantId === 8) {
      navigation.navigate('YIRHouse');
    }
  };

  const renderRestaurant = ({ item }) => (
    <View style={styles.restaurantContainer}>
      <TouchableOpacity onPress={() => handleRestaurantPress(item.id)}>
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
              { label: '--Select--', value: '--Select--' },
              { label: '1', value: 1 },
              { label: '2', value: 2 },
              { label: '3', value: 3 },
              { label: '4', value: 4 },
              { label: '5', value: 5 },
            ]}
            style={{
              inputIOS: styles.dropdown,
              inputAndroid: styles.dropdown,
            }}
            value={selectedRating}
          />
        </View>
        <View style={styles.dropdownWrapper}>
          <Text style={styles.dropdownLabel}>Price</Text>
          <RNPickerSelect
            onValueChange={(value) => setSelectedPrice(value)}
            items={[
              { label: '--Select--', value: '--Select--' },
              { label: '1', value: 1 },
              { label: '2', value: 2 },
              { label: '3', value: 3 },
            ]}
            style={{
              inputIOS: styles.dropdown,
              inputAndroid: styles.dropdown,
            }}
            value={selectedPrice}
          />
        </View>
      </View>
      <FlatList
        data={handleSort()}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderRestaurant}
        numColumns={2}
        columnWrapperStyle={styles.row}
        key={selectedRating + '_' + selectedPrice + '_' + restaurants.length}
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
    alignItems: 'center',
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

