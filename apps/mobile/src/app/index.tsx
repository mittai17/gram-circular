import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Platform,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useRole } from '../context/RoleContext';
import { useNetwork } from '../context/NetworkContext';
import { colors } from '../theme/colors';
import { UserRole } from '../types';
import {
  ShieldCheck,
  Truck,
  Building2,
  Factory,
  Users,
  ChevronRight,
  Wifi,
  WifiOff,
  Layers,
  Sparkles,
} from 'lucide-react-native';

interface RoleCardData {
  role: UserRole;
  name: string;
  badge: string;
  subtitle: string;
  persona: string;
  color: string;
  lightColor: string;
  route: string;
  icon: any;
  bulletPoints: string[];
}

const ROLES_LIST: RoleCardData[] = [
  {
    role: 'admin',
    name: 'Panchayat Admin',
    badge: 'Admin',
    subtitle: 'Panchayat / Block / District HQ',
    persona: 'admin@panchayat.gov.in',
    color: '#1a5c38',
    lightColor: '#e8f5e9',
    route: '/(admin)/dashboard',
    icon: ShieldCheck,
    bulletPoints: [
      'Monitor all 28 villages & 96 collection points',
      'View real-time analytics & compliance reports',
      'Manage user roster & field personnel',
      'Vehicle route optimization & status',
    ],
  },
  {
    role: 'worker',
    name: 'Collection Worker',
    badge: 'Field Staff',
    subtitle: 'Ramesh K • Waste Collector',
    persona: 'Vehicle 1 • Route 1 (Shanti Nagar)',
    color: '#2563eb',
    lightColor: '#eff6ff',
    route: '/(worker)/dashboard',
    icon: Truck,
    bulletPoints: [
      'Assigned 6 collection stops (18.4 km)',
      'Smart digital scale reading & category logging',
      'Generate QR codes with offline outbox queue',
      'Full offline-first SQLite synchronization',
    ],
  },
  {
    role: 'mrf',
    name: 'MRF Operator',
    badge: 'Facility Staff',
    subtitle: 'Selvam M • MRF Lead',
    persona: 'Tidel MRF Block Facility',
    color: '#ea580c',
    lightColor: '#fff7ed',
    route: '/(mrf)/dashboard',
    icon: Building2,
    bulletPoints: [
      'Receive & inspect incoming batches (12.8 kg MLP)',
      'Moisture, contamination & Grade A/B scoring',
      'Zone storage capacity management (Zone A, B, C)',
      'Create dispatch orders to recycling processors',
    ],
  },
  {
    role: 'buyer',
    name: 'Buyer / Processor',
    badge: 'Recycle Industry',
    subtitle: 'GreenCycle Pvt Ltd • Arun Kumar',
    persona: 'Industrial Recycler • 50 km hub',
    color: '#7c3aed',
    lightColor: '#f5f3ff',
    route: '/(buyer)/dashboard',
    icon: Factory,
    bulletPoints: [
      'Browse available MLP, HDPE, LDPE batches',
      'Schedule pickups with truck allocation',
      'Confirm receipt weights & upload inspection proof',
      'Track monthly procurement spend (₹48,500)',
    ],
  },
  {
    role: 'citizen',
    name: 'Village Citizen',
    badge: 'Community',
    subtitle: 'Karthik S • Resident',
    persona: 'Shanti Nagar Ward 3',
    color: '#d97706',
    lightColor: '#fef3c7',
    route: '/(citizen)/home',
    icon: Users,
    bulletPoints: [
      'Bilingual MLP segregation guide (English & Tamil)',
      'Weekly waste collection schedule & reminders',
      'Report full / overflowing public bins with GPS photo',
      'Earn eco-reward points & redeem local vouchers',
    ],
  },
];

export default function DemoRoleSelector() {
  const router = useRouter();
  const { setRole } = useRole();
  const { isOnline, toggleNetwork } = useNetwork();

  const handleSelectRole = (card: RoleCardData) => {
    setRole(card.role);
    router.push(card.route as any);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#1a5c38" />
      {/* Brand Header */}
      <View style={styles.header}>
        <View style={styles.brandRow}>
          <View style={styles.logoBadge}>
            <Image
              source={require('../../assets/logo.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
          <View style={styles.brandMeta}>
            <Text style={styles.brandTitle}>GRAM-CIRCULAR</Text>
            <Text style={styles.brandTagline}>Clean Villages • Circular India</Text>
          </View>
          {/* Network Switcher in Header */}
          <TouchableOpacity
            style={[
              styles.networkToggle,
              isOnline ? styles.onlineBadge : styles.offlineBadge,
            ]}
            onPress={toggleNetwork}
            activeOpacity={0.8}
          >
            {isOnline ? (
              <Wifi size={12} color="#15803d" />
            ) : (
              <WifiOff size={12} color="#b91c1c" />
            )}
            <Text style={[styles.networkText, { color: isOnline ? '#15803d' : '#b91c1c' }]}>
              {isOnline ? 'Online' : 'Offline'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.demoBanner}>
          <Sparkles size={14} color="#fef08a" />
          <Text style={styles.demoBannerText}>
            Clean Rural Circular Economy • 5-Role Interactive Prototype
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sectionHeading}>
          <Text style={styles.headingTitle}>Select User Role</Text>
          <Text style={styles.headingSubtitle}>
            Experience the complete rural waste value chain from collection to processing
          </Text>
        </View>

        {ROLES_LIST.map((card) => {
          const IconComp = card.icon;

          return (
            <TouchableOpacity
              key={card.role}
              style={styles.card}
              onPress={() => handleSelectRole(card)}
              activeOpacity={0.85}
            >
              <View style={styles.cardHeader}>
                <View style={[styles.iconBox, { backgroundColor: card.lightColor }]}>
                  <IconComp size={24} color={card.color} />
                </View>

                <View style={styles.cardMeta}>
                  <View style={styles.titleRow}>
                    <Text style={styles.roleName}>{card.name}</Text>
                    <View style={[styles.roleBadge, { backgroundColor: card.lightColor }]}>
                      <Text style={[styles.roleBadgeText, { color: card.color }]}>
                        {card.badge}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.personaText}>{card.subtitle}</Text>
                </View>

                <View style={[styles.arrowCircle, { backgroundColor: card.lightColor }]}>
                  <ChevronRight size={18} color={card.color} />
                </View>
              </View>

              <View style={styles.cardBody}>
                {card.bulletPoints.map((point, idx) => (
                  <View key={idx} style={styles.bulletRow}>
                    <View style={[styles.bulletDot, { backgroundColor: card.color }]} />
                    <Text style={styles.bulletText}>{point}</Text>
                  </View>
                ))}
              </View>

              <View style={[styles.cardFooter, { borderTopColor: colors.borderLight }]}>
                <Text style={styles.launchText}>Enter as {card.name}</Text>
                <ChevronRight size={14} color={card.color} />
              </View>
            </TouchableOpacity>
          );
        })}

        <View style={styles.footerNote}>
          <Layers size={14} color={colors.textMuted} />
          <Text style={styles.footerNoteText}>
            You can also switch roles anytime using the floating button in the bottom corner.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1a5c38',
  },
  header: {
    backgroundColor: '#1a5c38',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 20) + 10 : 16,
    paddingBottom: 16,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoBadge: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    padding: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  logoImage: {
    width: 46,
    height: 46,
  },
  brandMeta: {
    flex: 1,
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  brandTagline: {
    fontSize: 11,
    color: '#a7f3d0',
    fontWeight: '500',
  },
  networkToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    gap: 5,
  },
  onlineBadge: {
    backgroundColor: '#dcfce7',
  },
  offlineBadge: {
    backgroundColor: '#fee2e2',
  },
  networkText: {
    fontSize: 11,
    fontWeight: '700',
  },
  demoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 12,
    gap: 6,
  },
  demoBannerText: {
    color: '#fef08a',
    fontSize: 11,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionHeading: {
    marginBottom: 16,
  },
  headingTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  headingSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardMeta: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  roleName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  roleBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  personaText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  arrowCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  cardBody: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 0.8,
    borderTopColor: colors.borderLight,
    gap: 6,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  bulletDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    marginTop: 6,
  },
  bulletText: {
    fontSize: 12,
    color: '#475569',
    flex: 1,
    lineHeight: 18,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 0.8,
  },
  launchText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  footerNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 8,
    paddingHorizontal: 16,
  },
  footerNoteText: {
    fontSize: 11,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
