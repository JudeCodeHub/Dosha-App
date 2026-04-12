// Data & UI Configurations for Doshas

export const DASHBOARD_PROFILES = {
  vata: {
    gradient: "linear-gradient(135deg,#7C3AED,#4F46E5)",
    heroBg: "linear-gradient(160deg,#F5F3FF,#EDE9FE 40%,#E0E7FF)",
    heroBgDark: "linear-gradient(160deg,#0f0c1e,#1e1b4b 60%,#1e1047)",
    accent: "#7C3AED",
    accentLight: "#DDD6FE",
    icon: "🌬️",
    element: "Air & Space",
    tagline: "Creative · Dynamic · Ethereal",
    description:
      "As a Vata type, you embody the qualities of air and space — creative, quick-thinking, and always in motion. Your path to balance lies in warmth, grounding routines, and nourishing practices.",
    mantra: "Sthira Sukham Asanam",
  },
  pitta: {
    gradient: "linear-gradient(135deg,#EA580C,#DC2626)",
    heroBg: "linear-gradient(160deg,#FFFBEB,#FFF7ED 40%,#FEF2F2)",
    heroBgDark: "linear-gradient(160deg,#1a0900,#431407 60%,#450a0a)",
    accent: "#EA580C",
    accentLight: "#FED7AA",
    icon: "🔥",
    element: "Fire & Water",
    tagline: "Focused · Passionate · Transformative",
    description:
      "As a Pitta type, you carry the fire of transformation — sharp intellect, strong digestion, and natural leadership. Balance comes through cooling foods, serene environments, and self-compassion.",
    mantra: "Shanti Shanti Shanti",
  },
  kapha: {
    gradient: "linear-gradient(135deg,#0D9488,#059669)",
    heroBg: "linear-gradient(160deg,#F0FDFA,#ECFDF5 40%,#F0FDF4)",
    heroBgDark: "linear-gradient(160deg,#021a17,#042f2e 60%,#064e3b)",
    accent: "#0D9488",
    accentLight: "#CCFBF1",
    icon: "🌿",
    element: "Earth & Water",
    tagline: "Nurturing · Steady · Abundant",
    description:
      "As a Kapha type, you embody the nurturing qualities of earth and water — loving, patient, and naturally resilient. Your wellness journey thrives with movement, light foods, and daily invigoration.",
    mantra: "Tejasvi Navadhitamastu",
  },
};

export const DASHBOARD_SECTIONS = [
  {
    key: "diet",
    altKey: null,
    icon: "🌾",
    titleKey: "diet_title",
    titleFb: "Dietary Path",
    sub: "Nourishment for your constitution",
  },
  {
    key: "yoga",
    altKey: null,
    icon: "🧘",
    titleKey: "yoga_title",
    titleFb: "Movement & Yoga",
    sub: "Body-mind harmony practices",
  },
  {
    key: "skincare",
    altKey: null,
    icon: "✨",
    titleKey: "skincare_title",
    titleFb: "Skin Vitality",
    sub: "Radiance rituals",
  },
  {
    key: "haircare",
    altKey: null,
    icon: "🥥",
    titleKey: "haircare_title",
    titleFb: "Lustrous Hair",
    sub: "Traditional care wisdom",
  },
  {
    key: "herbs",
    altKey: "remedies",
    icon: "🌿",
    titleKey: "herbs_title",
    titleFb: "Ancestral Herbs",
    sub: "Sri Lankan botanical remedies",
  },
  {
    key: "routine",
    altKey: null,
    icon: "🌅",
    titleKey: "routine_title",
    titleFb: "Daily Rhythm",
    sub: "Your Dinacharya blueprint",
  },
];

export const QUIZ_QUESTION_CONFIG = {
  vata: {
    border: "border-violet-400",
    bg: "bg-violet-50 dark:bg-violet-900/20",
    ring: "ring-violet-400",
    text: "text-violet-700 dark:text-violet-400",
    dot: "bg-violet-500",
    icon: "🌬️",
  },
  pitta: {
    border: "border-orange-400",
    bg: "bg-orange-50 dark:bg-orange-900/20",
    ring: "ring-orange-400",
    text: "text-orange-700 dark:text-orange-400",
    dot: "bg-orange-500",
    icon: "🔥",
  },
  kapha: {
    border: "border-teal-400",
    bg: "bg-teal-50 dark:bg-teal-900/20",
    ring: "ring-teal-400",
    text: "text-teal-700 dark:text-teal-400",
    dot: "bg-teal-500",
    icon: "🌿",
  },
};

export const DOSHA_DESCRIPTIONS = {
  vata: "Vata is associated with movement, lightness, creativity, and variability.",
  pitta:
    "Pitta is associated with heat, sharpness, intensity, and transformation.",
  kapha:
    "Kapha is associated with stability, strength, calmness, and endurance.",
};

export const QUIZ_RESULT_CONFIG = {
  vata: {
    gradient: "from-violet-500 to-indigo-500",
    softBg: "bg-violet-50 dark:bg-violet-900/20",
    border: "border-violet-200 dark:border-violet-700/50",
    text: "text-violet-700 dark:text-violet-400",
    badge:
      "bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 border-violet-200 dark:border-violet-700/50",
    emoji: "🌬️",
    element: "Air & Space",
    qualities: ["Creative", "Quick-minded", "Enthusiastic", "Variable"],
  },
  pitta: {
    gradient: "from-orange-500 to-rose-500",
    softBg: "bg-orange-50 dark:bg-orange-900/20",
    border: "border-orange-200 dark:border-orange-700/50",
    text: "text-orange-700 dark:text-orange-400",
    badge:
      "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-700/50",
    emoji: "🔥",
    element: "Fire & Water",
    qualities: ["Driven", "Focused", "Intense", "Transformative"],
  },
  kapha: {
    gradient: "from-teal-500 to-emerald-500",
    softBg: "bg-teal-50 dark:bg-teal-900/20",
    border: "border-teal-200 dark:border-teal-700/50",
    text: "text-teal-700 dark:text-teal-400",
    badge:
      "bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 border-teal-200 dark:border-teal-700/50",
    emoji: "🌿",
    element: "Earth & Water",
    qualities: ["Calm", "Stable", "Nurturing", "Enduring"],
  },
};
