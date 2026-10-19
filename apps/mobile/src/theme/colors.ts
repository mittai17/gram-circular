export const colors = {
  // Brand Primary & Accents (GRAM-CIRCULAR design system)
  primary: '#1a5c38',
  primaryDark: '#0f3d24',
  primaryLight: '#2d8653',
  accent: '#4caf50',
  accentLight: '#e8f5e9',
  
  // Surfaces & Backgrounds
  background: '#ffffff',
  surface: '#f8faf9',
  surfaceCard: '#ffffff',
  surfaceHover: '#f1f5f3',
  border: '#e2e8f0',
  borderLight: '#edf2f7',
  
  // Typography
  textPrimary: '#0f172a',
  textSecondary: '#475569',
  textMuted: '#94a3b8',
  textOnPrimary: '#ffffff',
  
  // Feedback Statuses
  success: '#10b981',
  successLight: '#ecfdf5',
  warning: '#f59e0b',
  warningLight: '#fffbeb',
  error: '#ef4444',
  errorLight: '#fef2f2',
  info: '#3b82f6',
  infoLight: '#eff6ff',
  
  // Role Themes
  roles: {
    admin: {
      primary: '#1a5c38',
      light: '#e8f5e9',
      border: '#c8e6c9',
      label: 'Panchayat Admin',
    },
    worker: {
      primary: '#2563eb',
      light: '#eff6ff',
      border: '#bfdbfe',
      label: 'Collection Worker',
    },
    mrf: {
      primary: '#ea580c',
      light: '#fff7ed',
      border: '#fed7aa',
      label: 'MRF Operator',
    },
    buyer: {
      primary: '#7c3aed',
      light: '#f5f3ff',
      border: '#ddd6fe',
      label: 'Buyer / Processor',
    },
    citizen: {
      primary: '#d97706',
      light: '#fef3c7',
      border: '#fde68a',
      label: 'Village Citizen',
    },
  },
  
  // Waste Category Colors
  wasteCategories: {
    mlp: '#1a5c38',       // Multi-Layer Plastic (Featured)
    dry: '#3b82f6',       // Dry Recyclable
    wet: '#10b981',       // Wet / Organic
    sanitary: '#ef4444',  // Sanitary / Hazardous
    hdpe: '#0284c7',
    ldpe: '#0d9488',
    pet: '#8b5cf6',
  },
};

export default colors;
