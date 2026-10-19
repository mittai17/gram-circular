import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '../../theme/colors';
import {
  Leaf,
  Sparkles,
  Award,
  Calendar,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react-native';

export default function CitizenWelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#1a5c38" />

      {/* Hero Banner */}
      <View style={styles.heroBanner}>
        <View style={styles.logoCircle}>
          <Leaf size={32} color="#ffffff" />
        </View>
        <Text style={styles.brandTitle}>GRAM-CIRCULAR</Text>
        <Text style={styles.heroHeading}>A Cleaner Village Starts with You</Text>
        <Text style={styles.heroSub}>Together for a greener tomorrow in Shanti Nagar</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionHeader}>How You Can Make an Impact</Text>

        <View style={styles.featureCard}>
          <View style={[styles.iconBox, { backgroundColor: '#e8f5e9' }]}>
            <Leaf size={22} color="#1a5c38" />
          </View>
          <View style={styles.featureMeta}>
            <Text style={styles.featureTitle}>Segregate at Source</Text>
            <Text style={styles.featureDesc}>
              Separate dry MLP plastic pouches from wet organic waste so it can be recycled.
            </Text>
          </View>
        </View>

        <View style={styles.featureCard}>
          <View style={[styles.iconBox, { backgroundColor: '#eff6ff' }]}>
            <Calendar size={22} color="#2563eb" />
          </View>
          <View style={styles.featureMeta}>
            <Text style={styles.featureTitle}>Doorstep Collection Timetable</Text>
            <Text style={styles.featureDesc}>
              Know exactly which stream is picked up each morning in your ward.
            </Text>
          </View>
        </View>

        <View style={styles.featureCard}>
          <View style={[styles.iconBox, { backgroundColor: '#fff7ed' }]}>
            <AlertTriangle size={22} color="#ea580c" />
          </View>
          <View style={styles.featureMeta}>
            <Text style={styles.featureTitle}>Report Full or Overflowing Bins</Text>
            <Text style={styles.featureDesc}>
              Snap a quick photo with GPS. Our collection truck is routed directly.
            </Text>
          </View>
        </View>

        <View style={styles.featureCard}>
          <View style={[styles.iconBox, { backgroundColor: '#fef3c7' }]}>
            <Award size={22} color="#d97706" />
          </View>
          <View style={styles.featureMeta}>
            <Text style={styles.featureTitle}>Earn Green Eco-Points</Text>
            <Text style={styles.featureDesc}>
              Get rewarded with points redeemable for Panchayat discounts and compost bags.
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.startBtn}
          onPress={() => router.push('/(citizen)/home')}
          activeOpacity={0.85}
        >
          <Text style={styles.startBtnText}>Get Started</Text>
          <ArrowRight size={18} color="#ffffff" />
        </TouchableOpacity>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1a5c38',
  },
  heroBanner: {
    backgroundColor: '#1a5c38',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
    alignItems: 'center',
  },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  brandTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#a7f3d0',
    letterSpacing: 1,
  },
  heroHeading: {
    fontSize: 22,
    fontWeight: '900',
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 6,
  },
  heroSub: {
    fontSize: 13,
    color: '#d1fae5',
    textAlign: 'center',
    marginTop: 6,
  },
  content: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: 18,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 14,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 10,
    gap: 12,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureMeta: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  featureDesc: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  startBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#1a5c38',
    borderRadius: 14,
    paddingVertical: 16,
    marginTop: 16,
  },
  startBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
  },
});
