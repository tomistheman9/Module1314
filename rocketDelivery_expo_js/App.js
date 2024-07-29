import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginPage from './components/pages/LoginPage';
import RestaurantsPage from './components/pages/RestaurantsPage';
import OrderHistoryPage from './components/pages/OrderHistoryPage';
import ThirstyHouse from './components/pages/ThirstyHouse';
import SpiceGrill from './components/pages/SpiceGrill';
import SpiceSushi from './components/pages/SpiceSushi';
import SweetSubs from './components/pages/SweetSubs';
import FastJuiceBar from './components/pages/FastJuiceBar';
import FastKing from './components/pages/FastKing';
import SilverGrillTap from './components/pages/SilverGrillTap';
import YIRHouse from './components/pages/YIRHouse';  // Import the new page
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
        <Stack.Screen name="SpiceGrill" options={{ headerShown: false }}>
          {props => (
            <TitlePage {...props} routeName="SpiceGrill">
              <SpiceGrill {...props} userDetails={userDetails} />
            </TitlePage>
          )}
        </Stack.Screen>
        <Stack.Screen name="SpiceSushi" options={{ headerShown: false }}>
          {props => (
            <TitlePage {...props} routeName="SpiceSushi">
              <SpiceSushi {...props} userDetails={userDetails} />
            </TitlePage>
          )}
        </Stack.Screen>
        <Stack.Screen name="SweetSubs" options={{ headerShown: false }}>
          {props => (
            <TitlePage {...props} routeName="SweetSubs">
              <SweetSubs {...props} userDetails={userDetails} />
            </TitlePage>
          )}
        </Stack.Screen>
        <Stack.Screen name="FastJuiceBar" options={{ headerShown: false }}>
          {props => (
            <TitlePage {...props} routeName="FastJuiceBar">
              <FastJuiceBar {...props} userDetails={userDetails} />
            </TitlePage>
          )}
        </Stack.Screen>
        <Stack.Screen name="FastKing" options={{ headerShown: false }}>
          {props => (
            <TitlePage {...props} routeName="FastKing">
              <FastKing {...props} userDetails={userDetails} />
            </TitlePage>
          )}
        </Stack.Screen>
        <Stack.Screen name="SilverGrillTap" options={{ headerShown: false }}>
          {props => (
            <TitlePage {...props} routeName="SilverGrillTap">
              <SilverGrillTap {...props} userDetails={userDetails} />
            </TitlePage>
          )}
        </Stack.Screen>
        <Stack.Screen name="YIRHouse" options={{ headerShown: false }}>
          {props => (
            <TitlePage {...props} routeName="YIRHouse">
              <YIRHouse {...props} userDetails={userDetails} />
            </TitlePage>
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
