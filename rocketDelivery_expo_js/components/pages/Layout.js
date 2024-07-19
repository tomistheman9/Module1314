// File: Layout.js

import React from 'react';
import { View, StyleSheet } from 'react-native';
import TitlePage from './TitlePage';

const Layout = ({ children, routeName }) => {
  const showTitlePage = routeName !== 'Login';

  return (
    <View style={styles.container}>
      {showTitlePage && <TitlePage />}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  }
});

export default Layout;
