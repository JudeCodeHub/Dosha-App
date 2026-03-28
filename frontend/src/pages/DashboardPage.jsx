import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import RecommendationSection from "@/components/dashboard/RecommendationSection";
import DoshaTrackingBadge from "@/components/dashboard/DoshaTrackingBadge";
import { getPersonalization } from "@/utils/personalizationStorage";
import { LogOut, Loader2, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { API_BASE_URL } from "@/config/api";
import { useTranslation } from "react-i18next";

const doshaVisuals = {
  vata: {
    color: "text-violet-600 dark:text-violet-400",
    gradient: "from-violet-500 to-indigo-500",
    icon: "🌬️",
  },
  pitta: {
    color: "text-orange-600 dark:text-orange-400",
    gradient: "from-orange-500 to-rose-500",
    icon: "🔥",
  },
  kapha: {
    color: "text-teal-600 dark:text-teal-400",
    gradient: "from-teal-500 to-emerald-500",
    icon: "🌿",
  },
};

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const personalization = getPersonalization() || {};

  const dosha = localStorage.getItem("marinZenUserDosha")?.toLowerCase();
  const userName = localStorage.getItem("userName");
  const displayName = userName || t('dashboard.user', 'User');

  const [content, setContent] = useState(null);
  const [loadingContent, setLoadingContent] = useState(true);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("marinzen_auth");
    localStorage.removeItem("marinzen_personalization");
    localStorage.removeItem("selectedDosha");
    localStorage.removeItem("marinZenUserDosha");
    localStorage.removeItem("dosha");
    ["vata", "pitta", "kapha"].forEach((d) => {
      localStorage.removeItem(`marinZenRecommendations_${d}`);
      localStorage.removeItem(`marinZenRecommendations_${d}_en`);
      localStorage.removeItem(`marinZenRecommendations_${d}_ta`);
    });
    navigate("/auth");
  }, [navigate]);

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

    const CACHE_TTL_MS = 60 * 60 * 1000;
    const cacheKey = `marinZenRecommendations_${dosha}_${i18n.language || "en"}`;

    const readCache = () => {
      try {
        const raw = localStorage.getItem(cacheKey);
        if (!raw) return null;
        const { data, timestamp } = JSON.parse(raw);
        if (Date.now() - timestamp < CACHE_TTL_MS) return data;
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
      } catch {
        /* empty */
      }
    };

    const fetchRecommendations = async () => {
      const cached = readCache();
      if (cached) {
        setContent(cached);
        setLoadingContent(false);
        return;
      }

      const getStale = () => {
        try {
          const r = localStorage.getItem(cacheKey);
          return r ? JSON.parse(r).data : null;
        } catch {
          return null;
        }
      };

      try {
        const response = await fetch(
          `${API_BASE_URL}/recommendations/${dosha}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "X-Language": i18n.language || "en",
            },
          },
        );

        if (response.status === 401) {
          handleLogout();
          return;
        }

        if (response.ok) {
          const data = await response.json();
          writeCache(data);
          setContent(data);
        } else {
          const stale = getStale();
          if (stale) setContent(stale);
        }
      } catch {
        const stale = getStale();
        if (stale) setContent(stale);
      } finally {
        setLoadingContent(false);
      }
    };

    fetchRecommendations();
  }, [dosha, navigate, handleLogout, i18n.language]);

  const visual = dosha ? doshaVisuals[dosha] : null;

  const trackingData = {
    dosha: dosha,
    mode: personalization?.mode || "manual",
    scores: personalization?.scores || null,
    lastUpdated: personalization?.lastUpdated || "Live Profile - Synced",
  };

  if (!dosha || !visual) return null;

  if (loadingContent) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center text-stone-500 dark:text-stone-400 gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600 dark:text-teal-400" />
        <p className="text-lg animate-pulse font-medium">
          {t('dashboard.aligning', 'Aligning your wellness plan...')}
        </p>
      </div>
    );
  }

  if (!content) return null;

  return (
    <main className="min-h-screen w-full flex flex-col items-center relative bg-stone-50 dark:bg-stone-950 transition-colors duration-300 antialiased">
      {/* Dynamic Header */}
      <nav className="sticky top-0 z-50 w-full bg-white/60 dark:bg-stone-950/60 backdrop-blur-md border-b border-stone-200/50 dark:border-stone-800/50 px-6 py-4 flex justify-center">
        <div className="w-full max-w-6xl flex items-center justify-between">
          <div className="flex items-center gap-3 basis-1/4">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center bg-linear-to-br ${visual.gradient} text-white font-bold text-lg shadow-sm font-sans tracking-tight`}
            >
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div className="hidden lg:block">
              <p className="text-[10px] font-bold tracking-widest uppercase text-stone-500 leading-none mb-1">
                {t('dashboard.profile', 'Profile')}
              </p>
              <p className="text-sm font-bold text-stone-800 dark:text-stone-100 leading-none uppercase tracking-tight">
                {displayName}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <DoshaTrackingBadge
              dosha={dosha}
              visual={visual}
              trackingData={trackingData}
            />
          </div>

          <div className="flex items-center justify-end gap-3 basis-1/4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                if (dosha)
                  localStorage.removeItem(`marinZenRecommendations_${dosha}_${i18n.language || "en"}`);
                navigate("/discover");
              }}
              className="rounded-full text-stone-500 hover:text-stone-900 dark:hover:text-stone-200"
            >
              <RefreshCcw className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="rounded-full px-5 border-stone-200 dark:border-stone-800"
            >
              <LogOut className="w-3.5 h-3.5 mr-2" />
              <span className="hidden sm:inline font-bold uppercase tracking-tighter text-[10px]">
                {t('dashboard.logout', 'Logout')}
              </span>
            </Button>
          </div>
        </div>
      </nav>

      <div className="w-full max-w-7xl z-10 flex flex-col items-center py-12 px-6">
        <div className="text-center mb-12">
          <p className="text-stone-500 dark:text-stone-400 text-sm font-medium italic">
            {personalization?.mode === "quiz"
              ? t('dashboard.desc_quiz', 'Personalized suggestions based on your body-mind analysis.')
              : t('dashboard.desc_manual', 'Wellness recommendations tailored to your selected constitution.')}
          </p>
        </div>

        {content && Object.keys(content).length === 0 ? (
          <div className="w-full py-20 text-center bg-white/40 dark:bg-stone-900/30 backdrop-blur-md rounded-3xl border border-stone-200/50 dark:border-stone-800/50 p-12 shadow-xl">
            <h3 className="text-2xl font-black text-stone-800 dark:text-stone-200 uppercase mb-4">
              {t('dashboard.pending', 'Synchronization Pending')}
            </h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full items-stretch animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {[
              { title: t('dashboard.sections.diet_title', 'Dietary Path'), key: "diet", icon: "🥑" },
              { title: t('dashboard.sections.yoga_title', 'Movement & Yoga'), key: "yoga", icon: "🧘‍♀️" },
              { title: t('dashboard.sections.skincare_title', 'Skin Vitality'), key: "skincare", icon: "✨" },
              { title: t('dashboard.sections.haircare_title', 'Lustrous Hair'), key: "haircare", icon: "🥥" },
              {
                title: t('dashboard.sections.herbs_title', 'Ancestral Herbs'),
                key: "herbs",
                icon: "🍵",
                altKey: "remedies",
              },
              { title: t('dashboard.sections.routine_title', 'Daily Rhythm'), key: "routine", icon: "🌅" },
            ].map((section, idx) => (
              <div key={idx} className="flex h-full">
                <RecommendationSection
                  title={section.title}
                  content={content?.[section.key] || content?.[section.altKey]}
                  icon={section.icon}
                  visual={visual}
                  className="h-full w-full"
                />
              </div>
            ))}
          </div>
        )}

        <footer className="mt-20 pb-12 text-center text-stone-400 dark:text-stone-600">
          <p className="text-xs uppercase tracking-[0.3em] font-bold">
            {t('dashboard.footer', 'MarinZen 🌿 Modern Wellness')}
          </p>
        </footer>
      </div>
    </main>
  );
};

export default DashboardPage;
