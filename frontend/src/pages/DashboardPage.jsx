import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import RecommendationSection from "@/components/dashboard/RecommendationSection";
import { getPersonalization } from "@/utils/personalizationStorage";
import { LogOut, Loader2, RefreshCcw, Leaf, ChevronDown } from "lucide-react";
import { API_BASE_URL } from "@/config/api";
import { useTranslation } from "react-i18next";

/* ─── Dosha Profiles ─────────────────────────────────────────────── */
const PROFILES = {
  vata:  { gradient: "linear-gradient(135deg,#7C3AED,#4F46E5)", heroBg: "linear-gradient(160deg,#F5F3FF,#EDE9FE 40%,#E0E7FF)", heroBgDark: "linear-gradient(160deg,#0f0c1e,#1e1b4b 60%,#1e1047)", accent: "#7C3AED", accentLight: "#DDD6FE", icon: "🌬️", element: "Air & Space", tagline: "Creative · Dynamic · Ethereal", description: "As a Vata type, you embody the qualities of air and space — creative, quick-thinking, and always in motion. Your path to balance lies in warmth, grounding routines, and nourishing practices.", mantra: "Sthira Sukham Asanam" },
  pitta: { gradient: "linear-gradient(135deg,#EA580C,#DC2626)", heroBg: "linear-gradient(160deg,#FFFBEB,#FFF7ED 40%,#FEF2F2)", heroBgDark: "linear-gradient(160deg,#1a0900,#431407 60%,#450a0a)", accent: "#EA580C", accentLight: "#FED7AA", icon: "🔥", element: "Fire & Water", tagline: "Focused · Passionate · Transformative", description: "As a Pitta type, you carry the fire of transformation — sharp intellect, strong digestion, and natural leadership. Balance comes through cooling foods, serene environments, and self-compassion.", mantra: "Shanti Shanti Shanti" },
  kapha: { gradient: "linear-gradient(135deg,#0D9488,#059669)", heroBg: "linear-gradient(160deg,#F0FDFA,#ECFDF5 40%,#F0FDF4)", heroBgDark: "linear-gradient(160deg,#021a17,#042f2e 60%,#064e3b)", accent: "#0D9488", accentLight: "#CCFBF1", icon: "🌿", element: "Earth & Water", tagline: "Nurturing · Steady · Abundant", description: "As a Kapha type, you embody the nurturing qualities of earth and water — loving, patient, and naturally resilient. Your wellness journey thrives with movement, light foods, and daily invigoration.", mantra: "Tejasvi Navadhitamastu" },
};

const SECTIONS = [
  { key: "diet",     altKey: null,       icon: "🌾", titleKey: "diet_title",     titleFb: "Dietary Path",    sub: "Nourishment for your constitution" },
  { key: "yoga",     altKey: null,       icon: "🧘", titleKey: "yoga_title",     titleFb: "Movement & Yoga", sub: "Body-mind harmony practices" },
  { key: "skincare", altKey: null,       icon: "✨", titleKey: "skincare_title", titleFb: "Skin Vitality",   sub: "Radiance rituals" },
  { key: "haircare", altKey: null,       icon: "🥥", titleKey: "haircare_title", titleFb: "Lustrous Hair",   sub: "Traditional care wisdom" },
  { key: "herbs",    altKey: "remedies", icon: "🌿", titleKey: "herbs_title",    titleFb: "Ancestral Herbs", sub: "Sri Lankan botanical remedies" },
  { key: "routine",  altKey: null,       icon: "🌅", titleKey: "routine_title",  titleFb: "Daily Rhythm",    sub: "Your Dinacharya blueprint" },
];

const getGreetingKey = () => {
  const h = new Date().getHours();
  return h < 12 ? "dashboard.greeting_morning" : h < 17 ? "dashboard.greeting_afternoon" : "dashboard.greeting_evening";
};

const FONT_URL = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap";

/* ─── Component ──────────────────────────────────────────────────── */
export const DashboardPage = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const personalization = getPersonalization() || {};

  const dosha       = localStorage.getItem("marinZenUserDosha")?.toLowerCase();
  const displayName = localStorage.getItem("userName") || "Wellness Seeker";

  const [content,  setContent]  = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [isDark,   setIsDark]   = useState(false);

  // Load fonts
  useEffect(() => {
    if (!document.getElementById("mz-fonts")) {
      const l = Object.assign(document.createElement("link"), { id: "mz-fonts", rel: "stylesheet", href: FONT_URL });
      document.head.appendChild(l);
    }
  }, []);

  // Scroll + dark observer
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    const detect   = () => setIsDark(document.documentElement.classList.contains("dark"));
    detect();
    window.addEventListener("scroll", onScroll);
    const obs = new MutationObserver(detect);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => { window.removeEventListener("scroll", onScroll); obs.disconnect(); };
  }, []);

  // Logout
  const handleLogout = useCallback(() => {
    ["token","userId","userName","userEmail","marinzen_auth","marinzen_personalization","selectedDosha","marinZenUserDosha","dosha"]
      .forEach(k => localStorage.removeItem(k));
    ["vata","pitta","kapha"].forEach(d => {
      localStorage.removeItem(`marinZenRecommendations_${d}`);
      localStorage.removeItem(`marinZenRecommendations_${d}_en`);
      localStorage.removeItem(`marinZenRecommendations_${d}_ta`);
    });
    navigate("/auth");
  }, [navigate]);

  // Fetch recommendations
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { handleLogout(); return; }
    if (!dosha || dosha === "null") { navigate("/discover"); return; }

    const lang     = i18n.language || "en";
    const cacheKey = `marinZenRecommendations_${dosha}_${lang}`;
    const TTL      = 60 * 60 * 1000;

    const readCache = () => {
      try {
        const raw = localStorage.getItem(cacheKey);
        if (!raw) return null;
        const { data, timestamp } = JSON.parse(raw);
        if (Date.now() - timestamp < TTL) return data;
        localStorage.removeItem(cacheKey);
      } catch { localStorage.removeItem(cacheKey); }
      return null;
    };

    const writeCache = (data) => {
      try { localStorage.setItem(cacheKey, JSON.stringify({ data, timestamp: Date.now() })); } catch {}
    };

    (async () => {
      const cached = readCache();
      if (cached) { setContent(cached); setLoading(false); return; }
      try {
        const res = await fetch(`${API_BASE_URL}/recommendations/${dosha}`, {
          headers: { Authorization: `Bearer ${token}`, "X-Language": lang },
        });
        if (res.status === 401) { handleLogout(); return; }
        if (res.ok) { const d = await res.json(); writeCache(d); setContent(d); }
      } catch { /* network error */ } finally { setLoading(false); }
    })();
  }, [dosha, navigate, handleLogout, i18n.language]);

  const profile = dosha ? PROFILES[dosha] : null;
  const scores  = personalization?.scores || null;
  const total   = scores ? Object.values(scores).reduce((a, b) => (a || 0) + (b || 0), 0) : 0;

  if (!dosha || !profile) return null;

  // Loading screen
  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6"
      style={{ background: isDark ? profile.heroBgDark : profile.heroBg, fontFamily: "'DM Sans',sans-serif" }}>
      <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl shadow-xl" style={{ background: profile.gradient }}>
        {profile.icon}
      </div>
      <p className="text-xl font-light text-stone-600 dark:text-stone-300" style={{ fontFamily: "'Cormorant Garamond',serif" }}>
        {t("dashboard.loading_text", "Going to the dashboard...")}
      </p>
      <Loader2 className="w-5 h-5 animate-spin text-stone-400" />
    </div>
  );

  const retake = () => {
    if (dosha) localStorage.removeItem(`marinZenRecommendations_${dosha}_${i18n.language || "en"}`);
    navigate("/discover");
  };

  return (
    <div className="min-h-screen" style={{ fontFamily: "'DM Sans',sans-serif" }}>

      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/80 dark:bg-stone-950/80 backdrop-blur-xl border-b border-stone-200/60 dark:border-stone-800/60 shadow-sm" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 grid grid-cols-3 items-center">
          {/* Left — Brand */}
          <div className="flex items-center gap-2">
            <Leaf className="w-4 h-4" style={{ color: profile.accent }} />
            <span className="font-semibold tracking-tight text-stone-800 dark:text-stone-200" style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.15rem" }}>MarinZen</span>
          </div>

          {/* Centre — Dosha pill */}
          <div className="flex justify-center">
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border" style={{ borderColor: profile.accentLight, background: `${profile.accent}0d` }}>
              <span className="text-lg">{profile.icon}</span>
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: profile.accent }}>{dosha}</span>
            </div>
          </div>

          {/* Right — Actions */}
          <div className="flex items-center gap-3 justify-end">
            <button onClick={retake} title="Retake Assessment"
              className="flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-semibold uppercase tracking-wider border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-all">
              <RefreshCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t("dashboard.retake_quiz", "Retake Quiz")}</span>
            </button>
            <button onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-semibold uppercase tracking-wider bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/60 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-all">
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t("dashboard.sign_out", "Sign Out")}</span>
            </button>
          </div>
        </div>

      </nav>

      {/* Hero */}
      <div className="relative overflow-hidden" style={{ background: isDark ? profile.heroBgDark : profile.heroBg }}>
        {/* Mandala rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden>
          {[320, 460, 600, 740, 900].map((sz, i) => (
            <div key={i} className="absolute rounded-full border" style={{ width: sz, height: sz, borderColor: profile.accent, borderWidth: 1, opacity: 0.04 + i * 0.015 }} />
          ))}
        </div>
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full blur-3xl pointer-events-none" style={{ background: profile.accent, opacity: 0.08 }} />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full blur-3xl pointer-events-none" style={{ background: profile.accent, opacity: 0.06 }} />

        <div className="relative max-w-4xl mx-auto px-6 pt-36 pb-28 text-center">
          <p className="text-xs font-semibold tracking-[0.3em] uppercase mb-8 text-stone-400">{t(getGreetingKey())} &nbsp;✦&nbsp; {t("dashboard.wellness_sanctuary", "Your Wellness Sanctuary")}</p>

          {/* Dosha badge */}
          <div className="inline-flex items-center gap-5 px-8 py-5 rounded-3xl mb-8 border" style={{ background: `${profile.accent}10`, borderColor: `${profile.accent}30` }}>
            <span className="text-6xl drop-shadow-md" role="img" aria-label={dosha}>{profile.icon}</span>
            <div className="text-left">
              <h1 className="leading-none capitalize font-bold" style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(3rem,8vw,5rem)", background: profile.gradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                {dosha}
              </h1>
              <p className="text-[10px] font-bold tracking-[0.35em] uppercase mt-1 text-stone-400">{t(`dashboard.profiles.${dosha}.element`, profile.element)}</p>
            </div>
          </div>

          <h2 className="text-2xl md:text-3xl font-light text-stone-700 dark:text-stone-300 mb-2" style={{ fontFamily: "'Cormorant Garamond',serif" }}>
            Hi, <em className="not-italic font-semibold">{displayName}</em>
          </h2>
          <p className="text-xs tracking-[0.25em] uppercase text-stone-400 mb-8">{t(`dashboard.profiles.${dosha}.tagline`, profile.tagline)}</p>
          <p className="text-sm text-stone-600 dark:text-stone-400 max-w-xl mx-auto leading-loose mb-12">{t(`dashboard.profiles.${dosha}.description`, profile.description)}</p>

          {/* Score rings */}
          {total > 0 && scores && (
            <div className="flex items-center justify-center gap-8 flex-wrap mb-12">
              {Object.entries(scores).map(([name, score]) => {
                const pct  = Math.round(((score || 0) / total) * 100);
                const isDom = name.toLowerCase() === dosha;
                const dp   = PROFILES[name.toLowerCase()];
                return (
                  <div key={name} className="flex flex-col items-center gap-2">
                    <div className="relative w-16 h-16">
                      <svg viewBox="0 0 36 36" className="w-16 h-16 -rotate-90" aria-hidden>
                        <circle cx="18" cy="18" r="14" fill="none" stroke="#e5e7eb" strokeWidth="2.5" />
                        <circle cx="18" cy="18" r="14" fill="none" stroke={dp?.accent || "#aaa"}
                          strokeWidth={isDom ? 3.5 : 2} strokeDasharray={`${pct * 0.88} 100`}
                          strokeLinecap="round" style={{ transition: "stroke-dasharray 1s ease" }} />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-stone-700 dark:text-stone-200">{pct}%</span>
                    </div>
                    <span className={`text-[10px] font-semibold uppercase tracking-widest ${isDom ? "text-stone-700 dark:text-stone-200" : "text-stone-400"}`}>{name}</span>
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex flex-col items-center gap-1 text-stone-400 animate-bounce">
            <span className="text-[10px] tracking-widest uppercase font-semibold">{t("dashboard.wellness_plan", "Your Wellness Plan")}</span>
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Gradient bar */}
      <div className="h-[3px] w-full" style={{ background: profile.gradient }} />

      {/* Recommendation cards */}
      <div className="bg-stone-50 dark:bg-stone-950 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[10px] font-bold tracking-[0.35em] uppercase mb-4" style={{ color: profile.accent }}>{t("dashboard.blueprint_label", "Your Personalised Wellness Blueprint")}</p>
            <h2 className="text-4xl md:text-5xl text-stone-800 dark:text-stone-100 mb-4" style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 600 }}>{t("dashboard.blueprint_title", "Ancient Wisdom, Modern Living")}</h2>
            <p className="text-sm text-stone-500 dark:text-stone-400 max-w-lg mx-auto leading-relaxed">
              {t("dashboard.blueprint_desc", "Ayurvedic guidance rooted in Sri Lankan tradition, aligned with your")}{" "}
              <span className="font-semibold capitalize" style={{ color: profile.accent }}>{dosha}</span>{" "}
              {t("dashboard.blueprint_constitution", "constitution")}
            </p>
          </div>

          {content && Object.keys(content).length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {SECTIONS.map((s, idx) => {
                const text = content?.[s.key] || content?.[s.altKey];
                if (!text) return null;
                return (
                  <RecommendationSection key={s.key} title={t(`dashboard.sections.${s.titleKey}`, s.titleFb)}
                    subtitle={s.sub} content={text} icon={s.icon} profile={profile} index={idx} />
                );
              })}
            </div>
          ) : (
            <div className="py-20 text-center">
              <p className="text-stone-400 text-sm">{t("dashboard.no_recs", "Recommendations are being prepared.")}</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-stone-900 dark:bg-black py-14 px-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Leaf className="w-3.5 h-3.5 text-stone-600" />
          <span className="text-stone-600 text-[10px] font-bold tracking-[0.4em] uppercase">MarinZen</span>
        </div>
        <p className="text-stone-500 text-base italic mb-4" style={{ fontFamily: "'Cormorant Garamond',serif" }}>&ldquo;{t(`dashboard.profiles.${dosha}.mantra`, profile.mantra)}&rdquo;</p>
        <div className="flex items-center justify-center gap-2">
          <div className="h-px w-12 bg-stone-800" />
          <p className="text-stone-700 text-[10px] tracking-[0.3em] uppercase font-semibold">{t("dashboard.footer_tagline", "Rooted in Sri Lankan Ayurvedic Tradition")}</p>
          <div className="h-px w-12 bg-stone-800" />
        </div>
      </footer>
    </div>
  );
};

export default DashboardPage;
