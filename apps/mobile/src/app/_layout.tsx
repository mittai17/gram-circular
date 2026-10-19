import React from 'react';
import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RoleProvider } from '../context/RoleContext';
import { NetworkProvider } from '../context/NetworkContext';
import { SyncProvider } from '../context/SyncContext';
import { RoleSwitchModal } from '../components/common/RoleSwitchModal';

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <NetworkProvider>
        <RoleProvider>
          <SyncProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="(admin)" />
              <Stack.Screen name="(worker)" />
              <Stack.Screen name="(mrf)" />
              <Stack.Screen name="(buyer)" />
              <Stack.Screen name="(citizen)" />
            </Stack>
            <RoleSwitchModal />
          </SyncProvider>
        </RoleProvider>
      </NetworkProvider>
    </QueryClientProvider>
  );
}
