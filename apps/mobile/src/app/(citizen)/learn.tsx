import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { HeaderBar } from '../../components/common/HeaderBar';
import { BottomNav } from '../../components/common/BottomNav';
import { colors } from '../../theme/colors';
import {
  BookOpen,
  Sparkles,
  Droplets,
  Sun,
  Ban,
  CheckCircle2,
  Globe,
  Award,
  ChevronRight,
} from 'lucide-react-native';

const CONTENT = {
  en: {
    title: 'How to Segregate MLP Waste?',
    subtitle: 'Multi-layer plastic includes snack wrappers, biscuit packets & pouch packaging.',
    steps: [
      {
        num: 1,
        title: 'Rinse if possible',
        desc: 'Shake out leftover food crumbs or oily film so that recyclers can process high-purity granules.',
        icon: Droplets,
        color: '#2563eb',
        light: '#eff6ff',
      },
      {
        num: 2,
        title: 'Keep it completely dry',
        desc: 'Store in your dry waste container. Wet or soggy plastic causes mold in the MRF storage balers.',
        icon: Sun,
        color: '#d97706',
        light: '#fef3c7',
      },
      {
        num: 3,
        title: 'Do not mix with food waste',
        desc: 'Keep separate from organic vegetable peels and cooked meals. Food degrades plastic value.',
        icon: Ban,
        color: '#dc2626',
        light: '#fef2f2',
      },
    ],
    examples: ['Chips Wrappers (Lays, Kurkure)', 'Biscuit Packaging', 'Instant Noodle Pouches', 'Tea & Coffee Sachets'],
    quizTitle: 'Quick Knowledge Check',
    quizQuestion: 'Where should empty, dry chips pouches go?',
    quizOptions: ['Wet Organic Bin', 'Friday MLP Collection Bin', 'Burn in backyard'],
    correctAnswer: 1,
  },
  ta: {
    title: 'பல் அடுக்கு நெகிழி (MLP) பிரித்தெடுக்கும் முறை',
    subtitle: 'சிப்ஸ் பாக்கெட்டுகள், பிஸ்கட் உறைகள் மற்றும் மசாலா பாக்கெட்டுகள் இதில் அடங்கும்.',
    steps: [
      {
        num: 1,
        title: 'முடிந்தால் கழுவவும்',
        desc: 'உணவு துகள்கள் மற்றும் எண்ணெய் எச்சங்களை அகற்றி சுத்தமாக வைக்கவும்.',
        icon: Droplets,
        color: '#2563eb',
        light: '#eff6ff',
      },
      {
        num: 2,
        title: 'உலர்ந்த நிலையில் வைக்கவும்',
        desc: 'ஈரப்பதம் இல்லாத உலர்ந்த தொட்டியில் சேமிக்கவும். ஈரம் மறுசுழற்சியை பாதிக்கிறது.',
        icon: Sun,
        color: '#d97706',
        light: '#fef3c7',
      },
      {
        num: 3,
        title: 'உணவு கழிவுகளுடன் கலக்க வேண்டாம்',
        desc: 'காய்கறி கழிவுகள் அல்லது சமைத்த உணவுகளுடன் சேர்த்து வீச வேண்டாம்.',
        icon: Ban,
        color: '#dc2626',
        light: '#fef2f2',
      },
    ],
    examples: ['சிப்ஸ் பாக்கெட்டுகள்', 'பிஸ்கட் உறைகள்', 'நூடுல்ஸ் பாக்கெட்டுகள்', 'டீ மற்றும் காபி சாஷேக்கள்'],
    quizTitle: 'விரைவான வினாடி வினா',
    quizQuestion: 'காலியான சிப்ஸ் பாக்கெட்டுகளை எங்கு போட வேண்டும்?',
    quizOptions: ['ஈரக் கழிவு தொட்டி', 'வெள்ளிக்கிழமை MLP தொட்டி', 'எரிக்க வேண்டும்'],
    correctAnswer: 1,
  },
};

export default function CitizenLearnScreen() {
  const [lang, setLang] = useState<'en' | 'ta'>('en');
  const [quizAnswered, setQuizAnswered] = useState<number | null>(null);

  const t = CONTENT[lang];

  return (
    <View style={styles.screen}>
      <HeaderBar
        title={lang === 'en' ? 'Segregation Guide' : 'வழிகாட்டி'}
        subtitle={lang === 'en' ? 'Bilingual MLP Education' : 'இருமொழி வழிகாட்டல்'}
        showBack
        rightAction={
          <TouchableOpacity
            style={styles.langBtn}
            onPress={() => setLang(lang === 'en' ? 'ta' : 'en')}
          >
            <Globe size={14} color="#1a5c38" />
            <Text style={styles.langBtnText}>{lang === 'en' ? 'தமிழ்' : 'English'}</Text>
          </TouchableOpacity>
        }
      />

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Hero Card */}
        <View style={styles.heroCard}>
          <View style={styles.badgeRow}>
            <Sparkles size={12} color="#15803d" />
            <Text style={styles.badgeText}>Gram Panchayat Awareness</Text>
          </View>
          <Text style={styles.heroTitle}>{t.title}</Text>
          <Text style={styles.heroSub}>{t.subtitle}</Text>
        </View>

        {/* 3 Golden Steps */}
        <Text style={styles.sectionTitle}>
          {lang === 'en' ? '3 Golden Rules for MLP' : 'MLP கழிவுக்கான 3 முக்கிய விதிகள்'}
        </Text>

        {t.steps.map((step) => {
          const IconComp = step.icon;

          return (
            <View key={step.num} style={styles.stepCard}>
              <View style={[styles.stepIconBox, { backgroundColor: step.light }]}>
                <IconComp size={24} color={step.color} />
              </View>

              <View style={styles.stepMeta}>
                <View style={styles.stepTitleRow}>
                  <Text style={styles.stepNum}>{step.num}.</Text>
                  <Text style={styles.stepTitle}>{step.title}</Text>
                </View>
                <Text style={styles.stepDesc}>{step.desc}</Text>
              </View>
            </View>
          );
        })}

        {/* Common MLP Packaging Examples */}
        <View style={styles.examplesCard}>
          <Text style={styles.cardHeader}>
            {lang === 'en' ? 'Common Items to Segregate' : 'பிரித்தெடுக்க வேண்டிய பொருட்கள்'}
          </Text>
          <View style={styles.examplesGrid}>
            {t.examples.map((ex, i) => (
              <View key={i} style={styles.examplePill}>
                <CheckCircle2 size={12} color="#15803d" />
                <Text style={styles.exampleText}>{ex}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Interactive Quiz */}
        <View style={styles.quizCard}>
          <View style={styles.quizHeader}>
            <Award size={18} color="#d97706" />
            <Text style={styles.quizTitle}>{t.quizTitle}</Text>
          </View>
          <Text style={styles.quizQuestion}>{t.quizQuestion}</Text>

          <View style={styles.quizOptions}>
            {t.quizOptions.map((opt, idx) => {
              const isSelected = quizAnswered === idx;
              const isCorrect = idx === t.correctAnswer;

              return (
                <TouchableOpacity
                  key={idx}
                  style={[
                    styles.quizOptionBtn,
                    isSelected && (isCorrect ? styles.quizCorrect : styles.quizWrong),
                  ]}
                  onPress={() => {
                    setQuizAnswered(idx);
                    if (isCorrect) {
                      Alert.alert(
                        lang === 'en' ? 'Correct!' : 'சரியான விடை!',
                        lang === 'en' ? '+10 Eco points awarded!' : '+10 புள்ளிகள் வழங்கப்பட்டது!'
                      );
                    }
                  }}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.quizOptionText,
                      isSelected && { color: isCorrect ? '#15803d' : '#dc2626', fontWeight: '700' },
                    ]}
                  >
                    {opt}
                  </Text>
                  {isSelected && (
                    <CheckCircle2
                      size={16}
                      color={isCorrect ? '#15803d' : '#dc2626'}
                      style={{ marginLeft: 'auto' }}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

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
  langBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  langBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1a5c38',
  },
  heroCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#15803d',
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.textPrimary,
  },
  heroSub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
    lineHeight: 17,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 10,
  },
  stepCard: {
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
  stepIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepMeta: {
    flex: 1,
  },
  stepTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  stepNum: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  stepDesc: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 3,
    lineHeight: 16,
  },
  examplesCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  cardHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 10,
  },
  examplesGrid: {
    gap: 8,
  },
  examplePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#f8faf9',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 0.8,
    borderColor: colors.border,
  },
  exampleText: {
    fontSize: 11,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  quizCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  quizHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  quizTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#b45309',
  },
  quizQuestion: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  quizOptions: {
    gap: 8,
  },
  quizOptionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#f8faf9',
  },
  quizCorrect: {
    borderColor: '#10b981',
    backgroundColor: '#ecfdf5',
  },
  quizWrong: {
    borderColor: '#ef4444',
    backgroundColor: '#fef2f2',
  },
  quizOptionText: {
    fontSize: 12,
    color: colors.textPrimary,
  },
});
