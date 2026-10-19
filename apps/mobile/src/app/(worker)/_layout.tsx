import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Slot } from 'expo-router';
import { FloatingRoleSwitcher } from '../../components/common/FloatingRoleSwitcher';

export default function WorkerLayout() {
  return (
    <View style={styles.container}>
      <Slot />
      <FloatingRoleSwitcher />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
