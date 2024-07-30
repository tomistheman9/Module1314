import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button } from 'react-native';
import { NGROK_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginPage = ({ navigation }) => {
  const [email, setEmail] = useState('erica.ger@gmail.com');
  const [password, setPassword] = useState('password');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch(`${NGROK_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        await AsyncStorage.setItem('user_id', data.user_id.toString());
        await AsyncStorage.setItem('customer_id', data.customer_id?.toString() || '');
        await AsyncStorage.setItem('courier_id', data.courier_id?.toString() || '');

        // Log the stored values
        console.log('user_id:', data.user_id);
        console.log('customer_id:', data.customer_id);
        console.log('courier_id:', data.courier_id);

        // Navigate based on courier_id
        if (data.courier_id && data.courier_id !== 'null') {
          navigation.navigate('CourierHome');
        } else {
          navigation.navigate('Restaurants');
        }
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Login Failed');
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Log In" onPress={handleLogin} />
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
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: 200,
    height: 40,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'gray',
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
});

export default LoginPage;
