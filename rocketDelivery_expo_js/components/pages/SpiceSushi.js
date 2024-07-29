import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { NGROK_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SpiceSushi = ({ navigation, userDetails }) => {
  const [restaurant, setRestaurant] = useState(null);
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantities, setQuantities] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);

  useEffect(() => {
    const fetchRestaurantAndDishes = async () => {
      try {
        // Fetch restaurant details
        const restaurantResponse = await fetch(`${NGROK_URL}/api/restaurants`);
        if (restaurantResponse.ok) {
          const restaurantData = await restaurantResponse.json();
          const restaurant = restaurantData.find(rest => rest.id === 3);
          setRestaurant(restaurant);
        } else {
          console.error('Failed to load restaurant', restaurantResponse.statusText);
          setError('Failed to load restaurant');
        }

        // Fetch dishes
        const dishesResponse = await fetch(`${NGROK_URL}/api/products?restaurant=3`);
        if (dishesResponse.ok) {
          const dishesData = await dishesResponse.json();
          const sortedData = dishesData.sort((a, b) => a.cost - b.cost);
          setDishes(sortedData);
        } else {
          console.error('Failed to load dishes', dishesResponse.statusText);
          setError('Failed to load dishes');
        }
      } catch (error) {
        console.error('Error:', error);
        setError('Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantAndDishes();
  }, []);

  const handleIncrement = (id) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [id]: (prevQuantities[id] || 0) + 1,
    }));
  };

  const handleDecrement = (id) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [id]: (prevQuantities[id] || 0) - 1 >= 0 ? (prevQuantities[id] || 0) - 1 : 0,
    }));
  };

  const handleCreateOrder = () => {
    setIsModalVisible(true);
  };

  const handleConfirmOrder = async () => {
    const products = Object.entries(quantities)
      .filter(([id, quantity]) => quantity > 0)
      .map(([id, quantity]) => ({
        id: parseInt(id),
        quantity,
      }));

    const order = {
      restaurant_id: 3,
      customer_id: userDetails.customer_id,
      products,
    };

    try {
      console.log('Creating order with data:', order);

      const response = await fetch(`${NGROK_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(order),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Order created successfully:', data);
        // Display success modal
        setIsModalVisible(false);
        setIsSuccessModalVisible(true);
      } else {
        console.error('Failed to create order', response.statusText);
        const errorData = await response.json();
        console.error('Error data:', errorData);
        setIsModalVisible(false);
        setIsErrorModalVisible(true);
      }
    } catch (error) {
      console.error('Error:', error);
      setIsModalVisible(false);
      setIsErrorModalVisible(true);
    }
  };

  const renderDish = ({ item }) => (
    <View style={styles.dishContainer}>
      <Image source={require('../../assets/images/images2/BetterDonutBurger.jpg')} style={styles.dishImage} />
      <View style={styles.dishTextContainer}>
        <Text style={styles.dishName}>{item.name}</Text>
        <Text style={styles.dishPrice}>${(item.cost / 100).toFixed(2)}</Text>
      </View>
      <View style={styles.quantityContainer}>
        <TouchableOpacity onPress={() => handleDecrement(item.id)}>
          <Text style={styles.quantityButton}>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantityText}>{quantities[item.id] || 0}</Text>
        <TouchableOpacity onPress={() => handleIncrement(item.id)}>
          <Text style={styles.quantityButton}>+</Text>
        </TouchableOpacity>
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

  const getTotalCost = () => {
    return Object.entries(quantities).reduce((total, [id, quantity]) => {
      const dish = dishes.find(d => d.id === parseInt(id));
      return total + (dish ? dish.cost * quantity : 0);
    }, 0);
  };

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
          <TouchableOpacity style={styles.createOrderButton} onPress={handleCreateOrder}>
            <Text style={styles.createOrderButtonText}>Create Order</Text>
          </TouchableOpacity>
        </View>
      )}
      <FlatList
        data={dishes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderDish}
      />
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderText}>Order Confirmation</Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>X</Text>
              </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.modalContent}>
              <Text style={styles.orderSummaryTitle}>Order Summary</Text>
              {Object.entries(quantities).map(([id, quantity]) => {
                if (quantity > 0) {
                  const dish = dishes.find(d => d.id === parseInt(id));
                  return (
                    <View key={id} style={styles.orderItem}>
                      <Text style={styles.orderItemName}>{dish.name}</Text>
                      <Text style={styles.orderItemQuantity}>{quantity}</Text>
                      <Text style={styles.orderItemCost}>${(dish.cost / 100 * quantity).toFixed(2)}</Text>
                    </View>
                  );
                }
                return null;
              })}
              <View style={styles.orderTotal}>
                <Text style={styles.orderTotalText}>TOTAL</Text>
                <Text style={styles.orderTotalAmount}>${(getTotalCost() / 100).toFixed(2)}</Text>
              </View>
            </ScrollView>
            <TouchableOpacity style={styles.confirmOrderButton} onPress={handleConfirmOrder}>
              <Text style={styles.confirmOrderButtonText}>CONFIRM ORDER</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        visible={isSuccessModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setIsSuccessModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.successModalContainer}>
            <Text style={styles.successModalText}>
              Order Successful! <Text style={styles.successCheckMark}>✔️</Text>
            </Text>
            <Image
              source={require('../../assets/images/boratgreatsuccess.jpg')}
              style={styles.successImage}
            />
            <TouchableOpacity style={styles.closeButton} onPress={() => setIsSuccessModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        visible={isErrorModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setIsErrorModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.errorModalContainer}>
            <Text style={styles.errorModalText}>
              Failure to Order, please try again... <Text style={styles.errorCheckMark}>❌</Text>
            </Text>
            <Image
              source={require('../../assets/images/leoFailure.jpg')}
              style={styles.errorImage}
            />
            <TouchableOpacity style={styles.closeButton} onPress={() => setIsErrorModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    justifyContent: 'space-between',
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
  createOrderButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
  },
  createOrderButtonText: {
    color: '#fff',
    fontWeight: 'bold',
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
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    fontSize: 24,
    color: '#007bff',
    paddingHorizontal: 10,
  },
  quantityText: {
    fontSize: 18,
    paddingHorizontal: 10,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    maxHeight: '50%',
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: '#f0f0f0',
  },
  modalHeaderText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    paddingHorizontal: 10,
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007bff',
  },
  modalContent: {
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  orderSummaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  orderItemName: {
    fontSize: 16,
  },
  orderItemQuantity: {
    fontSize: 16,
  },
  orderItemCost: {
    fontSize: 16,
  },
  orderTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  orderTotalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  orderTotalAmount: {
    fontSize: 18,
  },
  confirmOrderButton: {
    backgroundColor: '#007bff',
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
    borderRadius: 5,
  },
  confirmOrderButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  successModalContainer: {
    width: '80%',
    maxHeight: '50%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  successModalText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  successCheckMark: {
    color: 'green',
    fontSize: 20,
  },
  successImage: {
    width: '100%',
    height: 200,
    marginBottom: 20,
  },
  errorModalContainer: {
    width: '80%',
    maxHeight: '50%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  errorModalText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  errorCheckMark: {
    color: 'red',
    fontSize: 20,
  },
  errorImage: {
    width: '100%',
    height: 200,
    marginBottom: 20,
  },
});

export default SpiceSushi;
