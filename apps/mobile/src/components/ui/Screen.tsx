import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import { useRole } from '../../context/RoleContext';
import { colors } from '../../theme/colors';
import { HeaderBar } from '../common/HeaderBar';
import { BottomNav } from '../common/BottomNav';
import { OfflineBanner } from '../common/OfflineBanner';

interface ScreenProps {
  title?: string;
  subtitle?: string;
  showOfflineBanner?: boolean;
  showBack?: boolean;
  showBottomNav?: boolean;
  children: React.ReactNode;
  onBack?: () => void;
}

export function Screen({
  title,
  subtitle,
  showOfflineBanner = true,
  showBack = false,
  showBottomNav = true,
  children,
  onBack,
}: ScreenProps) {
  const { role } = useRole();
  const theme = colors.roles[role] || colors.roles.admin;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      {title && (
        <HeaderBar title={title} subtitle={subtitle} showBack={showBack} onBack={onBack} />
      )}
      {showOfflineBanner && <OfflineBanner />}
      <ScrollView
        style={[styles.scroll, { backgroundColor: colors.surface }]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {children}
      </ScrollView>
      {showBottomNav && <BottomNav />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 20,
  },
});
