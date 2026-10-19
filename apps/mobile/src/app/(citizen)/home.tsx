import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { HeaderBar } from '../../components/common/HeaderBar';
import { BottomNav } from '../../components/common/BottomNav';
import { colors } from '../../theme/colors';
import {
  Award,
  AlertTriangle,
  Calendar,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Leaf,
  Layers,
  Sparkles,
} from 'lucide-react-native';

export default function CitizenHomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.screen}>
      <HeaderBar
        title="Hello, Karthik!"
        subtitle="Resident • Shanti Nagar Ward 3"
      />

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Top 2 Counters */}
        <View style={styles.countersRow}>
          <TouchableOpacity
            style={styles.counterCard}
            onPress={() => router.push('/(citizen)/rewards')}
            activeOpacity={0.8}
          >
            <View style={[styles.counterIcon, { backgroundColor: '#fef3c7' }]}>
              <Award size={20} color="#d97706" />
            </View>
            <View>
              <Text style={styles.counterVal}>125 pts</Text>
              <Text style={styles.counterSub}>My Green Rewards</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.counterCard}
            onPress={() => router.push('/(citizen)/profile')}
            activeOpacity={0.8}
          >
            <View style={[styles.counterIcon, { backgroundColor: '#eff6ff' }]}>
              <AlertTriangle size={20} color="#2563eb" />
            </View>
            <View>
              <Text style={styles.counterVal}>4</Text>
              <Text style={styles.counterSub}>My Reports Logged</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* 2 Big Action Buttons */}
        <View style={styles.mainActionsRow}>
          <TouchableOpacity
            style={[styles.mainActionBtn, { backgroundColor: '#ea580c' }]}
            onPress={() => router.push('/(citizen)/report-bin')}
            activeOpacity={0.85}
          >
            <AlertTriangle size={20} color="#ffffff" />
            <Text style={styles.mainActionText}>Report Full Bin</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.mainActionBtn, { backgroundColor: '#1a5c38' }]}
            onPress={() => router.push('/(citizen)/schedule')}
            activeOpacity={0.85}
          >
            <Calendar size={20} color="#ffffff" />
            <Text style={styles.mainActionText}>Collection Schedule</Text>
          </TouchableOpacity>
        </View>

        {/* Segregation Guide Promo Card */}
        <TouchableOpacity
          style={styles.guideCard}
          onPress={() => router.push('/(citizen)/learn')}
          activeOpacity={0.85}
        >
          <View style={styles.guideLeft}>
            <View style={styles.guideBadge}>
              <Sparkles size={12} color="#15803d" />
              <Text style={styles.guideBadgeText}>Tip of the Day</Text>
            </View>
            <Text style={styles.guideTitle}>How to Segregate MLP?</Text>
            <Text style={styles.guideSub}>
              Rinse chips & biscuit packets, keep them dry, and place in Friday's MLP bin.
            </Text>
            <View style={styles.learnRow}>
              <Text style={styles.learnText}>Read Interactive Guide (English & தமிழ்)</Text>
              <ArrowRight size={14} color="#1a5c38" />
            </View>
          </View>
        </TouchableOpacity>

        {/* Village Progress Card */}
        <TouchableOpacity
          style={styles.villageProgressCard}
          onPress={() => router.push('/(citizen)/village-progress')}
          activeOpacity={0.85}
        >
          <View style={styles.progressHeader}>
            <View>
              <Text style={styles.progressVillage}>Shanti Nagar Progress</Text>
              <Text style={styles.progressSub}>Clean Village Clean India Initiative</Text>
            </View>
            <View style={styles.growthBadge}>
              <TrendingUp size={12} color="#15803d" />
              <Text style={styles.growthText}>+12% Waste</Text>
            </View>
          </View>

          <View style={styles.progressRow}>
            <View style={styles.progressCol}>
              <Text style={styles.progressVal}>320.5 kg</Text>
              <Text style={styles.progressLbl}>Total Segregated</Text>
            </View>

            <View style={styles.progressDiv} />

            <View style={styles.progressCol}>
              <Text style={[styles.progressVal, { color: '#1a5c38' }]}>86.4 kg</Text>
              <Text style={styles.progressLbl}>MLP Collected (+18%)</Text>
            </View>
          </View>
        </TouchableOpacity>

        <View style={{ height: 24 }} />
      </ScrollView>

      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  scroll: {
    flex: 1,
    padding: 16,
  },
  countersRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  counterCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  counterIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterVal: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  counterSub: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 1,
  },
  mainActionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  mainActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 14,
    paddingVertical: 14,
  },
  mainActionText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  guideCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14,
  },
  guideLeft: {
    gap: 6,
  },
  guideBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  guideBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#15803d',
  },
  guideTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 2,
  },
  guideSub: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 17,
  },
  learnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  learnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1a5c38',
  },
  villageProgressCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  progressVillage: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  progressSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  growthBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  growthText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#15803d',
  },
  progressRow: {
    flexDirection: 'row',
    backgroundColor: '#f8faf9',
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
  },
  progressCol: {
    flex: 1,
    alignItems: 'center',
  },
  progressVal: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  progressLbl: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
  },
  progressDiv: {
    width: 1,
    backgroundColor: colors.border,
  },
});
