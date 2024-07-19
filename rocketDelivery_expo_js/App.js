// File: App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginPage from './components/pages/LoginPage';
import RestaurantsPage from './components/pages/RestaurantsPage';
import OrderHistoryPage from './components/pages/OrderHistoryPage';
import ThirstyHouse from './components/pages/ThirstyHouse'; // Import ThirstyHouse
import TitlePage from './components/pages/TitlePage'; // Import TitlePage

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginPage} />
        <Stack.Screen name="Restaurants" options={{ headerShown: false }}>
          {props => <TitlePage {...props} routeName="Restaurants"><RestaurantsPage {...props} /></TitlePage>}
        </Stack.Screen>
        <Stack.Screen name="OrderHistory" options={{ headerShown: false }}>
          {props => <TitlePage {...props} routeName="OrderHistory"><OrderHistoryPage {...props} /></TitlePage>}
        </Stack.Screen>
        <Stack.Screen name="ThirstyHouse" options={{ headerShown: false }}>
          {props => <TitlePage {...props} routeName="ThirstyHouse"><ThirstyHouse {...props} /></TitlePage>}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;

