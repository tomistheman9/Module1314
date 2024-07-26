// File: components/pages/OrderHistoryPage.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NGROK_URL } from '@env';

const OrderHistoryPage = ({ userDetails }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortOrder, setSortOrder] = useState('latest');

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        const customer_id = userDetails.customer_id;
        if (!customer_id) {
          throw new Error('Customer ID not found');
        }

        const response = await fetch(`${NGROK_URL}/api/orders?type=customer&id=${customer_id}`);
        if (response.ok) {
          const data = await response.json();
          const sortedData = sortOrders(data, 'latest');
          setOrders(sortedData);
        } else {
          console.error('Failed to fetch order history', response.statusText);
          setError('Failed to fetch order history');
        }
      } catch (error) {
        console.error('Error:', error);
        setError('Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderHistory();
  }, [userDetails.customer_id]);

  const sortOrders = (orders, order) => {
    return orders.sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return order === 'latest' ? dateB - dateA : dateA - dateB;
    });
  };

  const handleSortToggle = () => {
    const newSortOrder = sortOrder === 'latest' ? 'oldest' : 'latest';
    const sortedOrders = sortOrders([...orders], newSortOrder);
    setOrders(sortedOrders);
    setSortOrder(newSortOrder);
  };

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderItem}>
      <Text style={styles.orderItemText}>Order ID: {item.id}</Text>
      <Text style={styles.orderItemText}>Restaurant: {item.restaurant_name}</Text>
      <Text style={styles.orderItemText}>Status: {item.status}</Text>
      <Text style={styles.orderItemText}>Products:</Text>
      {item.products.map((product, index) => (
        <Text key={index} style={styles.productItemText}>
          {product.product_name} (x{product.quantity})
        </Text>
      ))}
      <Text style={styles.orderItemText}>Total Cost: ${(item.total_cost / 100).toFixed(2)}</Text>
      <Text style={styles.orderItemText}>Order Date: {new Date(item.created_at).toLocaleDateString()}</Text>
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
      <View style={styles.header}>
        <Text style={styles.headerText}>Order History</Text>
        <TouchableOpacity onPress={handleSortToggle} style={styles.sortButton}>
          <Text style={styles.sortButtonText}>
            Sort by: {sortOrder === 'latest' ? 'Latest' : 'Oldest'}
          </Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderOrderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  loadingText: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 20,
  },
  errorText: {
    fontSize: 20,
    textAlign: 'center',
    color: 'red',
    marginTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  sortButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
  },
  sortButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  orderItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 10,
  },
  orderItemText: {
    fontSize: 18,
  },
  productItemText: {
    fontSize: 16,
    marginLeft: 10,
  },
});

export default OrderHistoryPage;
