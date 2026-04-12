import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import RecommendationSection from "@/components/dashboard/RecommendationSection";
import { getPersonalization } from "@/utils/personalizationStorage";
import { LogOut, Loader2, RefreshCcw, Leaf, ChevronDown } from "lucide-react";
import { API_BASE_URL } from "@/config/api";
import { useTranslation } from "react-i18next";

/* ─── Dosha Profiles ───────────────────────────────────────────────── */
const doshaProfiles = {
  vata: {
    gradient: "linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)",
    heroBg: "linear-gradient(160deg, #F5F3FF 0%, #EDE9FE 40%, #E0E7FF 100%)",
    heroBgDark:
      "linear-gradient(160deg, #0f0c1e 0%, #1e1b4b 60%, #1e1047 100%)",
    accent: "#7C3AED",
    accentLight: "#DDD6FE",
    icon: "🌬️",
    element: "Air & Space",
    tagline: "Creative · Dynamic · Ethereal",
    description:
      "As a Vata type, you embody the qualities of air and space — creative, quick-thinking, and always in motion. Your path to balance lies in warmth, grounding routines, and nourishing practices.",
    mantra: "Sthira Sukham Asanam",
    balanceTip: "Grounding & Warmth",
  },
  pitta: {
    gradient: "linear-gradient(135deg, #EA580C 0%, #DC2626 100%)",
    heroBg: "linear-gradient(160deg, #FFFBEB 0%, #FFF7ED 40%, #FEF2F2 100%)",
    heroBgDark:
      "linear-gradient(160deg, #1a0900 0%, #431407 60%, #450a0a 100%)",
    accent: "#EA580C",
    accentLight: "#FED7AA",
    icon: "🔥",
    element: "Fire & Water",
    tagline: "Focused · Passionate · Transformative",
    description:
      "As a Pitta type, you carry the fire of transformation — sharp intellect, strong digestion, and natural leadership. Balance comes through cooling foods, serene environments, and self-compassion.",
    mantra: "Shanti Shanti Shanti",
    balanceTip: "Cooling & Calm",
  },
  kapha: {
    gradient: "linear-gradient(135deg, #0D9488 0%, #059669 100%)",
    heroBg: "linear-gradient(160deg, #F0FDFA 0%, #ECFDF5 40%, #F0FDF4 100%)",
    heroBgDark:
      "linear-gradient(160deg, #021a17 0%, #042f2e 60%, #064e3b 100%)",
    accent: "#0D9488",
    accentLight: "#CCFBF1",
    icon: "🌿",
    element: "Earth & Water",
    tagline: "Nurturing · Steady · Abundant",
    description:
      "As a Kapha type, you embody the nurturing qualities of earth and water — loving, patient, and naturally resilient. Your wellness journey thrives with movement, light foods, and daily invigoration.",
    mantra: "Tejasvi Navadhitamastu",
    balanceTip: "Light & Energy",
  },
};

/* ─── Helpers ───────────────────────────────────────────────────────── */
const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Ayubowan, Good Morning";
  if (h < 17) return "Ayubowan, Good Afternoon";
  return "Ayubowan, Good Evening";
};

/* ─── Component ─────────────────────────────────────────────────────── */
export const DashboardPage = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const personalization = getPersonalization() || {};

  const dosha = localStorage.getItem("marinZenUserDosha")?.toLowerCase();
  const userName = localStorage.getItem("userName");
  const displayName = userName || "Wellness Seeker";

  const [content, setContent] = useState(null);
  const [loadingContent, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [isDark, setIsDark] = useState(false);

  /* Load Cormorant Garamond + DM Sans */
  useEffect(() => {
    if (document.getElementById("mz-fonts")) return;
    const link = document.createElement("link");
    link.id = "mz-fonts";
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap";
    document.head.appendChild(link);
  }, []);

  /* Scroll & dark-mode detection */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDark(
      mq.matches || document.documentElement.classList.contains("dark"),
    );
    const obs = new MutationObserver(() =>
      setIsDark(document.documentElement.classList.contains("dark")),
    );
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => {
      window.removeEventListener("scroll", onScroll);
      obs.disconnect();
    };
  }, []);

  /* Logout */
  const handleLogout = useCallback(() => {
    [
      "token",
      "userId",
      "userName",
      "userEmail",
      "marinzen_auth",
      "marinzen_personalization",
      "selectedDosha",
      "marinZenUserDosha",
      "dosha",
    ].forEach((k) => localStorage.removeItem(k));
    ["vata", "pitta", "kapha"].forEach((d) => {
      localStorage.removeItem(`marinZenRecommendations_${d}`);
      localStorage.removeItem(`marinZenRecommendations_${d}_en`);
      localStorage.removeItem(`marinZenRecommendations_${d}_ta`);
    });
    navigate("/auth");
  }, [navigate]);

  /* Fetch recommendations */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      handleLogout();
      return;
    }
    if (!dosha || dosha === "null") {
      navigate("/discover");
      return;
    }

    const CACHE_TTL = 60 * 60 * 1000;
    const cacheKey = `marinZenRecommendations_${dosha}_${i18n.language || "en"}`;

    const readCache = () => {
      try {
        const raw = localStorage.getItem(cacheKey);
        if (!raw) return null;
        const { data, timestamp } = JSON.parse(raw);
        if (Date.now() - timestamp < CACHE_TTL) return data;
        localStorage.removeItem(cacheKey);
        return null;
      } catch {
        localStorage.removeItem(cacheKey);
        return null;
      }
    };
    const writeCache = (data) => {
      try {
        localStorage.setItem(
          cacheKey,
          JSON.stringify({ data, timestamp: Date.now() }),
        );
      } catch {}
    };

    (async () => {
      const cached = readCache();
      if (cached) {
        setContent(cached);
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`${API_BASE_URL}/recommendations/${dosha}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Language": i18n.language || "en",
          },
        });
        if (res.status === 401) {
          handleLogout();
          return;
        }
        if (res.ok) {
          const d = await res.json();
          writeCache(d);
          setContent(d);
        }
      } catch {
        /* empty */
      } finally {
        setLoading(false);
      }
    })();
  }, [dosha, navigate, handleLogout, i18n.language]);

  const profile = dosha ? doshaProfiles[dosha] : null;
  const scores = personalization?.scores || null;
  const total = scores
    ? Object.values(scores).reduce((a, b) => (a || 0) + (b || 0), 0)
    : 0;

  if (!dosha || !profile) return null;

  /* ── Loading screen ── */
  if (loadingContent) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-6"
        style={{
          background: isDark ? profile.heroBgDark : profile.heroBg,
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center text-4xl shadow-xl"
          style={{ background: profile.gradient }}
        >
          {profile.icon}
        </div>
        <div className="text-center">
          <p
            className="text-xl font-light text-stone-600 dark:text-stone-300 mb-2"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Going to the dashboard...
          </p>
          <Loader2 className="w-5 h-5 animate-spin mx-auto text-stone-400" />
        </div>
      </div>
    );
  }

  /* ── Recommendation sections ── */
  const sections = [
    {
      key: "diet",
      altKey: null,
      icon: "🌾",
      title: t("dashboard.sections.diet_title", "Dietary Path"),
      sub: "Nourishment for your constitution",
    },
    {
      key: "yoga",
      altKey: null,
      icon: "🧘",
      title: t("dashboard.sections.yoga_title", "Movement & Yoga"),
      sub: "Body-mind harmony practices",
    },
    {
      key: "skincare",
      altKey: null,
      icon: "✨",
      title: t("dashboard.sections.skincare_title", "Skin Vitality"),
      sub: "Radiance rituals",
    },
    {
      key: "haircare",
      altKey: null,
      icon: "🥥",
      title: t("dashboard.sections.haircare_title", "Lustrous Hair"),
      sub: "Traditional care wisdom",
    },
    {
      key: "herbs",
      altKey: "remedies",
      icon: "🌿",
      title: t("dashboard.sections.herbs_title", "Ancestral Herbs"),
      sub: "Sri Lankan botanical remedies",
    },
    {
      key: "routine",
      altKey: null,
      icon: "🌅",
      title: t("dashboard.sections.routine_title", "Daily Rhythm"),
      sub: "Your Dinacharya blueprint",
    },
  ];

  return (
    <div
      className="min-h-screen"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* ══ NAVBAR ══════════════════════════════════════════════════════ */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${
          scrolled
            ? "bg-white/80 dark:bg-stone-950/80 backdrop-blur-xl border-b border-stone-200/60 dark:border-stone-800/60 shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <Leaf className="w-4 h-4" style={{ color: profile.accent }} />
            <span
              className="text-stone-800 dark:text-stone-200 font-semibold tracking-tight"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "1.15rem",
              }}
            >
              MarinZen
            </span>
          </div>

          {/* Dosha pill */}
          <div
            className="flex items-center gap-2 px-4 py-1.5 rounded-full border"
            style={{
              borderColor: profile.accentLight,
              background: `${profile.accent}0d`,
            }}
          >
            <span className="text-lg">{profile.icon}</span>
            <span
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: profile.accent }}
            >
              {dosha}
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                if (dosha)
                  localStorage.removeItem(
                    `marinZenRecommendations_${dosha}_${i18n.language || "en"}`,
                  );
                navigate("/discover");
              }}
              className="p-2 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              title="Retake Assessment"
            >
              <RefreshCcw className="w-4 h-4" />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </nav>

      <div
        className="relative overflow-hidden"
        style={{ background: isDark ? profile.heroBgDark : profile.heroBg }}
      >
        {/* Concentric mandala rings */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          aria-hidden
        >
          {[320, 460, 600, 740, 900].map((sz, i) => (
            <div
              key={i}
              className="absolute rounded-full border"
              style={{
                width: sz,
                height: sz,
                borderColor: profile.accent,
                borderWidth: 1,
                opacity: 0.04 + i * 0.015,
              }}
            />
          ))}
        </div>

        {/* Blurred blob */}
        <div
          className="absolute -top-20 -right-20 w-80 h-80 rounded-full blur-3xl pointer-events-none"
          style={{ background: profile.accent, opacity: 0.08 }}
        />
        <div
          className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full blur-3xl pointer-events-none"
          style={{ background: profile.accent, opacity: 0.06 }}
        />

        <div className="relative max-w-4xl mx-auto px-6 pt-36 pb-28 text-center">
          {/* Eyebrow */}
          <p className="text-xs font-semibold tracking-[0.3em] uppercase mb-8 text-stone-400">
            {getGreeting()} &nbsp;✦&nbsp; Your Wellness Sanctuary
          </p>

          {/* Big dosha badge */}
          <div
            className="inline-flex items-center gap-5 px-8 py-5 rounded-3xl mb-8 border"
            style={{
              background: `${profile.accent}10`,
              borderColor: `${profile.accent}30`,
            }}
          >
            <span
              className="text-6xl drop-shadow-md"
              role="img"
              aria-label={dosha}
            >
              {profile.icon}
            </span>
            <div className="text-left">
              <h1
                className="leading-none capitalize font-bold"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "clamp(3rem, 8vw, 5rem)",
                  background: profile.gradient,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {dosha}
              </h1>
              <p className="text-[10px] font-bold tracking-[0.35em] uppercase mt-1 text-stone-400">
                {profile.element}
              </p>
            </div>
          </div>

          {/* Name greeting */}
          <h2
            className="text-2xl md:text-3xl font-light text-stone-700 dark:text-stone-300 mb-2"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Hi, <em className="not-italic font-semibold">{displayName}</em>
          </h2>
          <p className="text-xs tracking-[0.25em] uppercase text-stone-400 mb-8">
            {profile.tagline}
          </p>

          {/* Description */}
          <p className="text-sm text-stone-600 dark:text-stone-400 max-w-xl mx-auto leading-loose mb-12">
            {profile.description}
          </p>

          {/* Dosha score rings (if quiz was taken) */}
          {total > 0 && scores && (
            <div className="flex items-center justify-center gap-8 flex-wrap mb-12">
              {Object.entries(scores).map(([name, score]) => {
                const pct = Math.round(((score || 0) / total) * 100);
                const isDom = name.toLowerCase() === dosha;
                const dp = doshaProfiles[name.toLowerCase()];
                return (
                  <div key={name} className="flex flex-col items-center gap-2">
                    <div className="relative w-16 h-16">
                      <svg
                        viewBox="0 0 36 36"
                        className="w-16 h-16 -rotate-90"
                        aria-hidden
                      >
                        <circle
                          cx="18"
                          cy="18"
                          r="14"
                          fill="none"
                          stroke="#e5e7eb"
                          strokeWidth="2.5"
                        />
                        <circle
                          cx="18"
                          cy="18"
                          r="14"
                          fill="none"
                          stroke={dp?.accent || "#aaa"}
                          strokeWidth={isDom ? 3.5 : 2}
                          strokeDasharray={`${pct * 0.88} ${100}`}
                          strokeLinecap="round"
                          style={{ transition: "stroke-dasharray 1s ease" }}
                        />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-stone-700 dark:text-stone-200">
                        {pct}%
                      </span>
                    </div>
                    <span
                      className={`text-[10px] font-semibold uppercase tracking-widest ${
                        isDom
                          ? "text-stone-700 dark:text-stone-200"
                          : "text-stone-400"
                      }`}
                    >
                      {name}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Scroll cue */}
          <div className="flex flex-col items-center gap-1 text-stone-400 animate-bounce">
            <span className="text-[10px] tracking-widest uppercase font-semibold">
              Your Wellness Plan
            </span>
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Gradient bar */}
      <div
        className="h-[3px] w-full"
        style={{ background: profile.gradient }}
      />

      <div className="bg-stone-50 dark:bg-stone-950 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Section heading */}
          <div className="text-center mb-16">
            <p
              className="text-[10px] font-bold tracking-[0.35em] uppercase mb-4"
              style={{ color: profile.accent }}
            >
              Your Personalised Wellness Bluepri
            </p>
            <h2
              className="text-4xl md:text-5xl text-stone-800 dark:text-stone-100 mb-4"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 600,
              }}
            >
              Ancient Wisdom, Modern Living
            </h2>
            <p className="text-sm text-stone-500 dark:text-stone-400 max-w-lg mx-auto leading-relaxed">
              Ayurvedic guidance rooted in Sri Lankan tradition, aligned with
              your{" "}
              <span
                className="font-semibold capitalize"
                style={{ color: profile.accent }}
              >
                {dosha}
              </span>{" "}
              constitution
            </p>
          </div>

          {/* Cards */}
          {content && Object.keys(content).length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sections.map((s, idx) => {
                const text = content?.[s.key] || content?.[s.altKey];
                if (!text) return null;
                return (
                  <RecommendationSection
                    key={s.key}
                    title={s.title}
                    subtitle={s.sub}
                    content={text}
                    icon={s.icon}
                    profile={profile}
                    index={idx}
                  />
                );
              })}
            </div>
          ) : (
            <div className="py-20 text-center">
              <p className="text-stone-400 text-sm">
                Recommendations are being prepared.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ══ FOOTER ══════════════════════════════════════════════════════ */}
      <footer className="bg-stone-900 dark:bg-black py-14 px-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Leaf className="w-3.5 h-3.5 text-stone-600" />
          <span className="text-stone-600 text-[10px] font-bold tracking-[0.4em] uppercase">
            MarinZen
          </span>
        </div>
        <p
          className="text-stone-500 text-base italic mb-4"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          &ldquo;{profile.mantra}&rdquo;
        </p>
        <div className="flex items-center justify-center gap-2">
          <div className="h-px w-12 bg-stone-800" />
          <p className="text-stone-700 text-[10px] tracking-[0.3em] uppercase font-semibold">
            Rooted in Sri Lankan Ayurvedic Tradition
          </p>
          <div className="h-px w-12 bg-stone-800" />
        </div>
      </footer>
    </div>
  );
};

export default DashboardPage;
