import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../../components/ui/Screen';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { colors } from '../../theme/colors';
import { BookOpen, Sparkles, Droplets, Sun, Ban, Layers, ShieldAlert, Trash2, CheckCircle2, Globe, ChevronRight, Award } from 'lucide-react-native';

const CITIZEN_PRIMARY = colors.roles.citizen.primary; // #d97706
const CITIZEN_LIGHT = colors.roles.citizen.light; // #fef3c7

type Lang = 'en' | 'ta';

const STREAMS: { id: string; nameEn: string; nameTa: string; icon: any; color: string; light: string }[] = [
  {
    id: 'Wet',
    nameEn: 'Wet / Organic',
    nameTa: 'ஈரக் கழிவு',
    icon: Droplets,
    color: '#10b981',
    light: '#ecfdf5',
  },
  {
    id: 'Dry',
    nameEn: 'Dry / Recyclable',
    nameTa: 'உலர்ந்த கழிவு',
    icon: Trash2,
    color: '#2563eb',
    light: '#eff6ff',
  },
  {
    id: 'Sanitary',
    nameEn: 'Sanitary / Hazardous',
    nameTa: 'சுகாதார அபராஜகம்',
    icon: ShieldAlert,
    color: '#ef4444',
    light: '#fef2f2',
  },
  {
    id: 'MLP',
    nameEn: 'MLP Plastic',
    nameTa: 'MLP பிளாஸ்டிக்',
    icon: Layers,
    color: '#1a5c38',
    light: '#e8f5e9',
  },
];

const CONTENT: Record<Lang, {
  title: string;
  subtitle: string;
  heroTitle: string;
  heroSub: string;
  streamsTitle: string;
  mlpTitle: string;
  mlpSub: string;
  mlpTip: string;
  mlpItems: string[];
  quizTitle: string;
  quizQuestion: string;
  quizOptions: string[];
  correctAnswer: number;
  langLabel: string;
}> = {
  en: {
    title: 'Segregation Guide',
    subtitle: 'Bilingual MLP Education',
    heroTitle: 'How to Segregate MLP Waste?',
    heroSub: 'Multi-layer plastic includes snack wrappers, biscuit packets & pouch packaging.',
    streamsTitle: 'Four-Stream Segregation Guide',
    mlpTitle: 'MLP-Specific Guidance',
    mlpSub: 'Rinse, dry and deposit snack wrappers, sachets & laminated pouches on MLP collection day.',
    mlpTip: 'Always rinse and dry MLP before dropping it in the Friday MLP bin.',
    mlpItems: ['Chips & biscuit wrappers', 'Instant noodle pouches', 'Tea & coffee sachets', 'Laminated shampoo pouches'],
    quizTitle: 'Quick Knowledge Check',
    quizQuestion: 'Where should empty, dry chips pouches go?',
    quizOptions: ['Wet Organic Bin', 'Friday MLP Collection Bin', 'Burn in backyard'],
    correctAnswer: 1,
    langLabel: 'தமிழ்',
  },
  ta: {
    title: 'பிரித்தெடுத்தல் வழிகாட்டி',
    subtitle: 'இருமொழி MLP கல்வி',
    heroTitle: 'MLP கழிவை எப்படி பிரித்தெடுப்பது?',
    heroSub: 'பல அடுக்குச் சுமார் பிளாஸ்டிக் சிப்ஸ் பாக்கெட்டுகள், பிஸ்கட் உறைகள் மற்றும் பைல்ம் பைகளை உள்ளடக்கும்.',
    streamsTitle: 'நான்கு ஒழுங்குமுறை பிரித்தெடுத்தல்',
    mlpTitle: 'MLP குறிப்பிட்ட வழிகாட்டு',
    mlpSub: 'சிப்ஸ் பாக்கெட்டுகள், சாஷேக்கள் மற்றும் லேமினேட்டட் பைகளை வெள்ளிக்கிழமை MLP சேகரிப்பு நாளில் உலர்த்தி வைக்கவும்.',
    mlpTip: 'MLP ஐ வெள்ளிக்கிழமை தொட்டியில் வைப்பதற்கு முன் எப்போதும் கழுவி உலர்த்தி வைக்கவும்.',
    mlpItems: ['சிப்ஸ் & பிஸ்கட் உறைகள்', 'இன்ஸ்டன்ட் நூடுல்ஸ் பைகள்', 'டீ & காபி சாஷேக்கள்', 'லேமினேட்டட் சாம்பூ பைகள்'],
    quizTitle: 'விரைவான வினாடி வினா',
    quizQuestion: 'காலியான சிப்ஸ் பாக்கெட்டுகளை எங்கு வைக்க வேண்டும்?',
    quizOptions: ['ஈரக் கழிவு தொட்டி', 'வெள்ளிக்கிழமை MLP தொட்டி', 'பின்புறத்தில் எரிக்க வேண்டும்'],
    correctAnswer: 1,
    langLabel: 'English',
  },
};

// Stream Tamil names
const STREAM_TA: Record<string, string> = {
  Wet: 'ஈரக் கழிவு',
  Dry: 'உலர்ந்த கழிவு',
  Sanitary: 'சுகாதார அபராஜகம்',
  MLP: 'MLP பிளாஸ்டிக்',
};

export default function CitizenLearnScreen() {
  const [lang, setLang] = useState<Lang>('en');
  const [quizAnswered, setQuizAnswered] = useState<number | null>(null);

  const t = CONTENT[lang];

  return (
    <Screen title={t.title} subtitle={t.subtitle} showBack>
      {/* Language toggle (top-right) */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.langBtn}
          onPress={() => setLang(lang === 'en' ? 'ta' : 'en')}
          activeOpacity={0.85}
        >
          <Globe size={14} color={CITIZEN_PRIMARY} />
          <Text style={styles.langBtnText}>{t.langLabel}</Text>
        </TouchableOpacity>
      </View>
      {/* Hero Card */}
      <Card padding={16} style={styles.heroCard}>
        <View style={styles.badgeRow}>
          <Sparkles size={12} color="#15803d" />
          <Text style={styles.badgeText}>Gram Panchayat Awareness</Text>
        </View>
        <Text style={styles.heroTitle}>{t.heroTitle}</Text>
        <Text style={styles.heroSub}>{t.heroSub}</Text>
      </Card>

      {/* Four-Stream Segregation */}
      <SectionHeader title={t.streamsTitle} subtitle="Wet • Dry • Sanitary • MLP" />
      <View style={styles.streamsGrid}>
        {STREAMS.map((s) => {
          const IconComp = s.icon;
          const name = lang === 'en' ? s.nameEn : (STREAM_TA[s.id] || s.nameEn);
          return (
            <Card key={s.id} padding={14} style={styles.streamCard}>
              <View style={[styles.streamIcon, { backgroundColor: s.light }]}>
                <IconComp size={22} color={s.color} />
              </View>
              <Text style={styles.streamTitle}>{name}</Text>
              <StatusBadge variant={s.id === 'MLP' ? 'mlp' : 'default'} small>{s.id}</StatusBadge>
            </Card>
          );
        })}
      </View>

      {/* MLP-Specific Guidance */}
      <Card padding={16} style={styles.mlpCard}>
        <View style={styles.mlpHeader}>
          <Layers size={20} color={CITIZEN_PRIMARY} />
          <Text style={styles.mlpTitle}>{t.mlpTitle}</Text>
        </View>
        <Text style={styles.mlpSub}>{t.mlpSub}</Text>
        <View style={styles.mlpItems}>
          {t.mlpItems.map((item, i) => (
            <View key={i} style={styles.mlpItemRow}>
              <CheckCircle2 size={14} color="#15803d" />
              <Text style={styles.mlpItemText}>{item}</Text>
            </View>
          ))}
        </View>
        <View style={styles.mlpTipRow}>
          <Text style={styles.mlpTipLabel}>Tip:</Text>
          <Text style={styles.mlpTipText}>{t.mlpTip}</Text>
        </View>
      </Card>

      {/* Interactive Quiz */}
      <SectionHeader title={t.quizTitle} subtitle="Test your segregation knowledge" />
      <Card padding={16} style={styles.quizCard}>
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
                  <CheckCircle2 size={16} color={isCorrect ? '#15803d' : '#dc2626'} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heroCard: {},
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 10,
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
    marginTop: 6,
    lineHeight: 17,
  },
  streamsGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  streamCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    gap: 8,
  },
  streamIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  streamTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  mlpCard: {},
  mlpHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  mlpTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  mlpSub: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 17,
    marginBottom: 12,
  },
  mlpItems: {
    gap: 8,
  },
  mlpItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  mlpItemText: {
    fontSize: 12,
    color: colors.textPrimary,
  },
  mlpTipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginTop: 10,
  },
  mlpTipLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: CITIZEN_PRIMARY,
  },
  mlpTipText: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 17,
  },
  quizCard: {},
  quizQuestion: {
    fontSize: 14,
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
    color: CITIZEN_PRIMARY,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
});
