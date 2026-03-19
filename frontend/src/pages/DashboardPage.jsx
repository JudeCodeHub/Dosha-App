import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import DashboardCard from "@/components/dashboard/DashboardCard";
import { getPersonalization } from "@/utils/personalizationStorage";
import { LogOut, Loader2, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { API_BASE_URL } from "@/config/api";

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

const getPreview = (text) => {
  if (!text) return "Information unavailable.";
  return text.length > 100 ? text.slice(0, 100) + "..." : text;
};

export const DashboardPage = () => {
  const navigate = useNavigate();
  const personalization = getPersonalization() || {};

  const dosha = localStorage.getItem("marinZenUserDosha")?.toLowerCase();
  const userName = localStorage.getItem("userName");
  const displayName = userName || "User";

  const [content, setContent] = useState(null);
  const [loadingContent, setLoadingContent] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState("");

  const openModal = (title, text) => {
    setModalTitle(title);
    setModalContent(text);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isModalOpen]);

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
    ["vata", "pitta", "kapha"].forEach((d) =>
      localStorage.removeItem(`marinZenRecommendations_${d}`),
    );
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

    const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour
    const cacheKey = `marinZenRecommendations_${dosha}`;

    // Try reading a valid cache entry first
    const readCache = () => {
      try {
        const raw = localStorage.getItem(cacheKey);
        if (!raw) return null;
        const { data, timestamp } = JSON.parse(raw);
        if (Date.now() - timestamp < CACHE_TTL_MS) return data;
        localStorage.removeItem(cacheKey); // expired
        return null;
      } catch {
        localStorage.removeItem(cacheKey); // corrupted
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
        // Storage quota exceeded — silently skip caching
      }
    };

    const fetchRecommendations = async () => {
      // Serve from cache immediately if fresh
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
        const response = await fetch(`${API_BASE_URL}/recommendations/${dosha}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

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
          if (stale) {
            setContent(stale);
          }
        }
      } catch {
        const stale = getStale();
        if (stale) {
          setContent(stale);
        }
      } finally {
        setLoadingContent(false);
      }
    };

    fetchRecommendations();
  }, [dosha, navigate, handleLogout]);

  const visual = dosha ? doshaVisuals[dosha] : null;

  if (!dosha || !visual) {
    return null;
  }

  if (loadingContent) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center text-stone-500 dark:text-stone-400 gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600 dark:text-teal-400" />
        <p className="text-lg animate-pulse">
          Loading your personalized wellness plan...
        </p>
      </div>
    );
  }

  if (!content) {
    return null;
  }

  return (
    <main className="min-h-screen w-full flex flex-col items-center relative bg-stone-50 dark:bg-stone-950 transition-colors duration-300">
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-50 w-full bg-white/60 dark:bg-stone-950/60 backdrop-blur-md border-b border-stone-200/50 dark:border-stone-800/50 px-6 py-3 flex justify-center">
        <div className="w-full max-w-6xl flex items-center justify-between">
          {/* User Profile (Left) */}
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center bg-linear-to-br ${visual.gradient} text-white font-bold text-lg shadow-sm`}
            >
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div className="hidden sm:block">
              <p className="text-[10px] font-bold tracking-widest uppercase text-stone-500 dark:text-stone-500 leading-none mb-1">
                Hello
              </p>
              <p className="text-sm font-bold text-stone-800 dark:text-stone-100 leading-none uppercase tracking-tight">
                {displayName}
              </p>
            </div>
          </div>

          {/* Action Buttons (Right) */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (dosha)
                  localStorage.removeItem(`marinZenRecommendations_${dosha}`);
                navigate("/discover");
              }}
              className="hidden md:flex items-center gap-2 rounded-full px-4 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800/60 hover:text-stone-900 dark:hover:text-stone-200 transition-all duration-200 active:scale-95"
            >
              <RefreshCcw className="w-3.5 h-3.5" />
              Retake Quiz
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-full px-4 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800/60 hover:text-stone-900 dark:hover:text-stone-200 transition-all duration-200 active:scale-95"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </nav>

      {/* Background glow effects */}
      <div className="pointer-events-none absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-amber-900/5 blur-3xl opacity-50" />
      <div className="pointer-events-none absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-orange-900/5 blur-3xl opacity-40" />

      <div className="w-full max-w-6xl z-10 flex flex-col items-center relative py-12 px-6">
        {/* Hero Section */}
        <div className="mb-16 mt-4 text-center">
          <p className="text-sm font-semibold tracking-widest uppercase text-stone-500 dark:text-stone-400 mb-4">
            Your Dominant Dosha Is
          </p>
          <div className="flex flex-col items-center justify-center gap-4">
            <div
              className={`w-28 h-28 rounded-full bg-linear-to-br ${visual.gradient} flex items-center justify-center text-6xl shadow-xl shadow-stone-900/20 mb-2`}
            >
              {visual.icon}
            </div>
            <h1
              className={`text-6xl md:text-7xl font-extrabold uppercase tracking-tight ${visual.color} drop-shadow-sm`}
            >
              {dosha}
            </h1>
          </div>
          <p className="text-stone-600 dark:text-stone-400 text-lg md:text-xl max-w-2xl mx-auto mt-6">
            {personalization?.mode === "quiz"
              ? "These recommendations are personalized based on your quiz analysis."
              : "These wellness recommendations are based on the dosha you selected."}
          </p>
        </div>

        {/* Modules Grid */}
        {content && Object.keys(content).length === 0 ? (
          <div className="w-full py-16 text-center bg-white/50 dark:bg-stone-900/30 backdrop-blur-md rounded-3xl border border-stone-200/50 dark:border-stone-800/50">
            <h3 className="text-xl font-bold text-stone-700 dark:text-stone-300 mb-2">
              No recommendations available yet.
            </h3>
            <p className="text-stone-500 dark:text-stone-500 max-w-md mx-auto">
              Your Ayurvedic profile synced successfully, but we don't have
              active wellness recommendations for this dosha yet. Check back
              soon!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            <DashboardCard
              title="Diet Plan"
              description={getPreview(content?.diet)}
              buttonText="View Plan"
              icon="🥑"
              onAction={() =>
                openModal(
                  "Diet Plan",
                  content?.diet || "Information unavailable.",
                )
              }
            />
            <DashboardCard
              title="Yoga & Exercise"
              description={getPreview(content?.yoga)}
              buttonText="Explore"
              icon="🧘‍♀️"
              onAction={() =>
                openModal(
                  "Yoga & Exercise",
                  content?.yoga || "Information unavailable.",
                )
              }
            />
            <DashboardCard
              title="Skincare Routine"
              description={getPreview(content?.skincare)}
              buttonText="View Routine"
              icon="✨"
              onAction={() =>
                openModal(
                  "Skincare Routine",
                  content?.skincare || "Information unavailable.",
                )
              }
            />
            <DashboardCard
              title="Hair Care"
              description={getPreview(content?.haircare)}
              buttonText="View Tips"
              icon="🥥"
              onAction={() =>
                openModal(
                  "Hair Care",
                  content?.haircare || "Information unavailable.",
                )
              }
            />
            <DashboardCard
              title="Herbal Remedies"
              description={getPreview(content?.herbs || content?.remedies)}
              buttonText="Learn More"
              icon="🍵"
              onAction={() =>
                openModal(
                  "Herbal Remedies",
                  content?.herbs ||
                    content?.remedies ||
                    "Information unavailable.",
                )
              }
            />
            <DashboardCard
              title="Daily Routine"
              description={getPreview(content?.routine)}
              buttonText="View Schedule"
              icon="🌅"
              onAction={() =>
                openModal(
                  "Daily Routine",
                  content?.routine || "Information unavailable.",
                )
              }
            />
          </div>
        )}
      </div>

      {/* Detail Modal Overlay */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 transition-opacity"
          onClick={closeModal}
        >
          <div
            className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl w-full max-w-2xl p-6 flex flex-col shadow-2xl relative animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-stone-100 dark:border-stone-800">
              <h2 className="text-2xl font-bold tracking-tight text-stone-800 dark:text-stone-100">
                {modalTitle}
              </h2>
              <button
                onClick={closeModal}
                className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors w-10 h-10 flex items-center justify-center rounded-full hover:bg-stone-100 dark:hover:bg-stone-800"
              >
                ✕
              </button>
            </div>
            <div className="text-stone-600 dark:text-stone-400 text-base font-medium leading-relaxed max-h-[65vh] overflow-y-auto pr-4 custom-scrollbar whitespace-pre-line">
              {modalContent}
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default DashboardPage;
