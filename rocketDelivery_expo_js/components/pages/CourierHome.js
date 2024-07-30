import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const CourierHome = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image source={require('../../assets/images/AppIcon.png')} style={styles.image} />
      <Text style={styles.title}>Select Account Type</Text>
      <View style={styles.boxContainer}>
        <TouchableOpacity style={styles.box} onPress={() => navigation.navigate('Restaurants')}>
          <FontAwesome5 name="user" size={60} color="#000" />
          <Text style={styles.boxText}>Customer</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.box} onPress={() => navigation.navigate('DeliveryDetails')}>
          <FontAwesome5 name="car" size={60} color="#000" />
          <Text style={styles.boxText}>Courier</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  image: {
    width: 300,  // Three times bigger
    height: 300,  // Three times bigger
    resizeMode: 'contain',
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  boxContainer: {
    flexDirection: 'row',
    justifyContent: 'center',  // Center the boxes horizontally
    width: '80%',
  },
  box: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 140,  // Increased width
    height: 140,  // Increased height
    margin: 10,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 10,
  },
  boxText: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CourierHome;
