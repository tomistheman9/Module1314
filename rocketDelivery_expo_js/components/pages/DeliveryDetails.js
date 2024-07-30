import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { NGROK_URL } from '@env';

const statuses = ['in progress', 'delivered', 'pending'];

const DeliveryDetails = ({ navigation, userDetails }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (userDetails?.courier_id) {
          const response = await fetch(`${NGROK_URL}/api/orders?id=${userDetails.courier_id}&type=courier`);
          if (response.ok) {
            const data = await response.json();
            setOrders(data);
          } else {
            console.error('Failed to load orders', response.statusText);
            setError('Failed to load orders');
          }
        } else {
          setError('Courier ID is missing');
        }
      } catch (error) {
        console.error('Error:', error);
        setError('Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userDetails]);

  const handleViewOrderDetails = (order) => {
    setSelectedOrder(order);
    setIsModalVisible(true);
  };

  const handleStatusChange = async (order) => {
    const currentIndex = statuses.indexOf(order.status);
    const newIndex = (currentIndex + 1) % statuses.length;
    const newStatus = statuses[newIndex];

    try {
      const response = await fetch(`${NGROK_URL}/api/order/${order.id}/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setOrders((prevOrders) =>
          prevOrders.map((o) => (o.id === order.id ? { ...o, status: newStatus } : o))
        );
      } else {
        console.error('Failed to update status', response.statusText);
        setError('Failed to update status');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Something went wrong');
    }
  };

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

  const renderOrder = ({ item }) => (
    <View style={styles.orderRow}>
      <Text style={styles.orderCell}>{item.id}</Text>
      <Text style={styles.orderCell}>{item.restaurant_address}</Text>
      <TouchableOpacity style={styles.orderCell} onPress={() => handleStatusChange(item)}>
        <Text style={styles.statusText}>{item.status}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.viewButton} onPress={() => handleViewOrderDetails(item)}>
        <Text style={styles.viewButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>MY DELIVERIES</Text>
      <View style={styles.header}>
        <Text style={styles.headerCell}>ORDER ID</Text>
        <Text style={styles.headerCell}>RESTAURANT ADDRESS</Text>
        <Text style={styles.headerCell}>STATUS</Text>
        <Text style={styles.headerCell}>VIEW</Text>
      </View>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderOrder}
        contentContainerStyle={styles.list}
      />
      {selectedOrder && (
        <Modal
          visible={isModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setIsModalVisible(false)}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalHeaderText}>Order Details</Text>
                <TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>X</Text>
                </TouchableOpacity>
              </View>
              <ScrollView contentContainerStyle={styles.modalContent}>
                <Text style={styles.orderDetailText}>Customer Address: {selectedOrder.customer_address}</Text>
                <Text style={styles.orderDetailText}>Order Date: {new Date(selectedOrder.created_at).toLocaleString()}</Text>
                <Text style={styles.orderDetailText}>Restaurant Name: {selectedOrder.restaurant_name}</Text>
                <Text style={styles.orderSummaryTitle}>Order Summary</Text>
                {selectedOrder.products.map((product) => (
                  <View key={product.product_id} style={styles.orderItem}>
                    <Text style={styles.orderItemName}>{product.product_name}</Text>
                    <Text style={styles.orderItemQuantity}>{product.quantity}</Text>
                    <Text style={styles.orderItemCost}>${(product.total_cost / 100).toFixed(2)}</Text>
                  </View>
                ))}
                <View style={styles.orderTotal}>
                  <Text style={styles.orderTotalText}>TOTAL</Text>
                  <Text style={styles.orderTotalAmount}>${(selectedOrder.total_cost / 100).toFixed(2)}</Text>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
  },
  loadingText: {
    fontSize: 20,
    color: '#000',
  },
  errorText: {
    fontSize: 20,
    color: 'red',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginVertical: 10,
  },
  header: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
  },
  headerCell: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  list: {
    paddingVertical: 10,
  },
  orderRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  orderCell: {
    flex: 1,
    textAlign: 'center',
  },
  statusText: {
    fontSize: 16,
    color: '#007bff',
  },
  viewButton: {
    width: 30,
    height: 30,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
  },
  viewButtonText: {
    color: '#fff',
    fontSize: 20,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    maxHeight: '80%',
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
  orderDetailText: {
    fontSize: 16,
    marginBottom: 10,
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
});

export default DeliveryDetails;
