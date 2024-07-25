// File: App.js
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginPage from './components/pages/LoginPage';
import RestaurantsPage from './components/pages/RestaurantsPage';
import OrderHistoryPage from './components/pages/OrderHistoryPage';
import ThirstyHouse from './components/pages/ThirstyHouse';
import TitlePage from './components/pages/TitlePage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();

const App = () => {
  const [userDetails, setUserDetails] = useState({
    user_id: null,
    customer_id: null,
    courier_id: null,
  });

  useEffect(() => {
    const getUserDetails = async () => {
      const user_id = await AsyncStorage.getItem('user_id');
      const customer_id = await AsyncStorage.getItem('customer_id');
      const courier_id = await AsyncStorage.getItem('courier_id');
      setUserDetails({
        user_id: user_id ? parseInt(user_id) : null,
        customer_id: customer_id ? parseInt(customer_id) : null,
        courier_id: courier_id ? parseInt(courier_id) : null,
      });

      // Log the retrieved values
      console.log('Retrieved user_id:', user_id);
      console.log('Retrieved customer_id:', customer_id);
      console.log('Retrieved courier_id:', courier_id);
    };
    getUserDetails();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginPage} />
        <Stack.Screen name="Restaurants" options={{ headerShown: false }}>
          {props => (
            <TitlePage {...props} routeName="Restaurants">
              <RestaurantsPage {...props} userDetails={userDetails} />
            </TitlePage>
          )}
        </Stack.Screen>
        <Stack.Screen name="OrderHistory" options={{ headerShown: false }}>
          {props => (
            <TitlePage {...props} routeName="OrderHistory">
              <OrderHistoryPage {...props} userDetails={userDetails} />
            </TitlePage>
          )}
        </Stack.Screen>
        <Stack.Screen name="ThirstyHouse" options={{ headerShown: false }}>
          {props => (
            <TitlePage {...props} routeName="ThirstyHouse">
              <ThirstyHouse {...props} userDetails={userDetails} />
            </TitlePage>
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
