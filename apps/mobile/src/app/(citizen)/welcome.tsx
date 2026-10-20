import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../../components/ui/Screen';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { colors } from '../../theme/colors';
import { Leaf, Sparkles, Calendar, AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react-native';

const CITIZEN_PRIMARY = colors.roles.citizen.primary; // #d97706
const CITIZEN_LIGHT = colors.roles.citizen.light; // #fef3c7

export default function CitizenWelcomeScreen() {
  const router = useRouter();

  const setupSteps = [
    {
      num: '1',
      title: 'Segregate waste at home',
      desc: 'Separate wet, dry, sanitary and MLP streams before disposal.',
      icon: Leaf,
      color: '#10b981',
      light: '#ecfdf5',
    },
    {
      num: '2',
      title: 'Use collection schedule',
      desc: 'Put your bin out before the pickup window each ward day.',
      icon: Calendar,
      color: '#2563eb',
      light: '#eff6ff',
    },
    {
      num: '3',
      title: 'Report issues & earn points',
      desc: 'Snap full bins and earn Green Eco-Points redeemable locally.',
      icon: AlertTriangle,
      color: CITIZEN_PRIMARY,
      light: CITIZEN_LIGHT,
    },
  ];

  return (
    <Screen
      title="Welcome to GRAM-CIRCULAR"
      subtitle="Your village, cleaner every day"
      showBottomNav={false}
    >
      {/* Hero Card */}
      <Card padding={20} style={styles.heroCard}>
        <View style={styles.logoRow}>
          <View style={styles.logoBadge}>
            <Image
              source={require('../../../assets/logo.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
          <View style={styles.brandMeta}>
            <Text style={styles.brandTitle}>GRAM-CIRCULAR</Text>
            <Text style={styles.brandSub}>Swachh Village Initiative • Clean India</Text>
          </View>
        </View>
        <Text style={styles.welcomeTitle}>Welcome, Citizen!</Text>
        <Text style={styles.welcomeSub}>
          You are now connected to Shanti Nagar's waste management system.
          Segregate waste, report issues, and earn Green Eco-Points.
        </Text>
        <View style={styles.heroDivider} />
        <Text style={styles.heroRole}>
          <ShieldCheck size={14} color={CITIZEN_PRIMARY} />{' '}
          Role: Village Citizen • Shanti Nagar Ward 3
        </Text>
      </Card>

      {/* Quick Setup */}
      <SectionHeader title="Quick Setup" subtitle="Get started in three steps" />
      <View style={styles.stepsRow}>
        {setupSteps.map((step) => {
          const IconComp = step.icon;
          return (
            <View key={step.num} style={styles.stepCard}>
              <View style={[styles.stepIcon, { backgroundColor: step.light }]}>
                <IconComp size={20} color={step.color} />
              </View>
              <View style={styles.stepMeta}>
                <Text style={styles.stepNum}>{step.num}</Text>
                <Text style={styles.stepTitle}>{step.title}</Text>
                <Text style={styles.stepDesc}>{step.desc}</Text>
              </View>
            </View>
          );
        })}
      </View>

      {/* Role Explanation */}
      <Card padding={14} style={styles.roleCard}>
        <View style={styles.roleHeader}>
          <View style={styles.roleIcon}>
            <ShieldCheck size={18} color={CITIZEN_PRIMARY} />
          </View>
          <Text style={styles.roleTitle}>Your Role: Village Citizen</Text>
        </View>
        <Text style={styles.roleSub}>
          As a resident of Shanti Nagar, you can log bin reports, track collection days,
          redeem Green Eco-Points, and view village progress — all in English and Tamil.
        </Text>
        <StatusBadge variant="primary" style={styles.roleBadge}>
          Village Citizen • Amber Theme
        </StatusBadge>
      </Card>

      <TouchableOpacity
        style={styles.startBtn}
        onPress={() => router.push('/(citizen)/home')}
        activeOpacity={0.85}
      >
        <Text style={styles.startBtnText}>Get Started</Text>
        <ArrowRight size={18} color="#ffffff" />
      </TouchableOpacity>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heroCard: {},
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  logoImage: {
    width: 56,
    height: 56,
  },
  brandMeta: {},
  brandTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: 0.5,
  },
  brandSub: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 1,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  welcomeSub: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 19,
    marginBottom: 14,
  },
  heroDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 12,
  },
  heroRole: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    fontSize: 11,
    fontWeight: '700',
    color: CITIZEN_PRIMARY,
  },
  stepsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  stepCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    gap: 10,
  },
  stepIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepMeta: {},
  stepNum: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.textMuted,
  },
  stepTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 2,
  },
  stepDesc: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
    lineHeight: 14,
  },
  roleCard: {},
  roleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  roleIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: CITIZEN_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  roleSub: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 17,
    marginBottom: 10,
  },
  roleBadge: {
    alignSelf: 'flex-start',
  },
  startBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: CITIZEN_PRIMARY,
    borderRadius: 14,
    paddingVertical: 16,
    minHeight: 52,
  },
  startBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
  },
});
