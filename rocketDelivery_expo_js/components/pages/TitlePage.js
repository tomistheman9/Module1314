import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const TitlePage = ({ navigation, children, routeName }) => {
  const handleLogout = () => {
    navigation.navigate('Login');
  };

  const handleNavigate = (page) => {
    navigation.navigate(page);
  };

  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => handleNavigate('Restaurants')}>
          <Image
            source={require('../../assets/images/RestaurantMenu.jpg')}
            style={styles.logo}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>LOG OUT</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        {children}
      </View>
      <View style={styles.bottomNav}>
        <View style={styles.navButtonContainer}>
          <TouchableOpacity style={styles.navButton} onPress={() => handleNavigate('Restaurants')}>
            <FontAwesome5 name="hamburger" size={20} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.navButtonText}>Restaurants</Text>
        </View>
        <View style={styles.navButtonContainer}>
          <TouchableOpacity style={styles.navButton} onPress={() => handleNavigate('OrderHistory')}>
            <FontAwesome5 name="history" size={20} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.navButtonText}>Order History</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'space-between',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingTop: 15,
    paddingRight: 10,
    paddingLeft: 10,
    minHeight: 70,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  logoutButton: {
    backgroundColor: '#f57c00',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  logo: {
    width: 100,
    height: 50,
    resizeMode: 'contain',
  },
  content: {
    flex: 1,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-evenly', // Evenly space the buttons in the bottom navigation bar
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    padding: 10,
  },
  navButtonContainer: {
    alignItems: 'center',
  },
  navButton: {
    backgroundColor: '#f57c00',
    width: 80, // Smaller width for the buttons
    height: 40, // Smaller height for the buttons
    borderRadius: 20, // Adjusted to keep the oval shape
    justifyContent: 'center', // Center the icon inside the button
    alignItems: 'center', // Center the icon inside the button
  },
  navButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
    textAlign: 'center',
  },
});

export default TitlePage;
