import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { savePersonalization } from "@/utils/personalizationStorage";
import { API_BASE_URL } from "@/config/api";
import { useTranslation } from "react-i18next";

const doshaDescriptions = {
  vata: "Vata is associated with movement, lightness, creativity, and variability.",
  pitta:
    "Pitta is associated with heat, sharpness, intensity, and transformation.",
  kapha:
    "Kapha is associated with stability, strength, calmness, and endurance.",
  "vata+pitta":
    "Vata-Pitta blends the quick, creative energy of air with the focused intensity of fire.",
  "pitta+kapha":
    "Pitta-Kapha combines the sharp focus of fire with the steady, calm endurance of earth.",
  "vata+kapha":
    "Vata-Kapha is a unique combination of creative movement and grounded stability.",
};

const doshaConfig = {
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
  "vata+pitta": {
    gradient: "from-violet-500 to-orange-500",
    softBg: "bg-violet-50 dark:bg-violet-900/20",
    border: "border-violet-200 dark:border-violet-700/50",
    text: "text-violet-700 dark:text-violet-400",
    badge:
      "bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 border-violet-200 dark:border-violet-700/50",
    emoji: "🌪️",
    element: "Air, Space & Fire",
    qualities: ["Dynamic", "Passionate", "Versatile", "Expressive"],
  },
  "pitta+kapha": {
    gradient: "from-orange-500 to-teal-500",
    softBg: "bg-orange-50 dark:bg-orange-900/20",
    border: "border-orange-200 dark:border-orange-700/50",
    text: "text-orange-700 dark:text-orange-400",
    badge:
      "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-700/50",
    emoji: "🌋",
    element: "Fire, Water & Earth",
    qualities: ["Strong", "Determined", "Stable", "Productive"],
  },
  "vata+kapha": {
    gradient: "from-violet-500 to-teal-500",
    softBg: "bg-teal-50 dark:bg-teal-900/20",
    border: "border-teal-200 dark:border-teal-700/50",
    text: "text-teal-700 dark:text-teal-400",
    badge:
      "bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 border-teal-200 dark:border-teal-700/50",
    emoji: "☁️",
    element: "Air, Space & Earth",
    qualities: ["Adaptable", "Nurturing", "Gentle", "Enduring"],
  },
};

const QuizResult = ({ result, scores, onRestart }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const config = doshaConfig[result];

  const handleFinish = async () => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (userId && token) {
      try {
        await fetch(`${API_BASE_URL}/auth/dosha`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ dosha: result.toLowerCase(), scores }),
        });

        // Also ping the result-service to destroy any currently cached tasks for today
        // so that they are strictly regenerated based on the newly calculated dosha.
        await fetch(`${API_BASE_URL}/tasks/reset`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (err) {
        console.error("Failed to sync Dosha or reset tasks:", err);
      }
    }

    savePersonalization({
      mode: "quiz",
      dominantDosha:
        result.charAt(0).toUpperCase() + result.slice(1).toLowerCase(),
      scores,
    });

    localStorage.setItem("marinZenUserDosha", result.toLowerCase());
    ["vata", "pitta", "kapha"].forEach((d) =>
      localStorage.removeItem(`marinZenRecommendations_${d}`),
    );
    navigate("/dashboard");
  };

  return (
    <div className="fixed inset-0 w-full h-screen flex items-center justify-center bg-stone-50 dark:bg-stone-950 p-3 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-xl my-auto animate-in fade-in zoom-in duration-500">
        <div className="relative bg-white/90 dark:bg-stone-900/50 backdrop-blur-2xl border border-zinc-200 dark:border-white/10 rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden text-center">
          <div
            className={`absolute -top-24 -left-24 w-64 h-64 rounded-full blur-[80px] opacity-20 bg-linear-to-br ${config.gradient}`}
          />

          <div className="relative px-5 sm:px-6 py-8 sm:py-10 md:py-14">
            <div
              className={`mx-auto mb-5 sm:mb-6 w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-linear-to-br ${config.gradient} flex items-center justify-center text-4xl sm:text-5xl shadow-xl`}
            >
              {config.emoji}
            </div>

            <div
              className={`inline-block px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-3 sm:mb-4 border ${config.badge}`}
            >
              {t("discover.result.identified", "Constitution Identified")}
            </div>

            <h1
              className={`text-4xl sm:text-5xl font-black bg-linear-to-r ${config.gradient} bg-clip-text text-transparent mb-3 sm:mb-4 capitalize tracking-tighter`}
            >
              {t(`doshas.${result.toLowerCase()}`, result)}
            </h1>

            <p className="text-zinc-600 dark:text-stone-400 text-sm sm:text-md leading-relaxed max-w-sm mx-auto mb-6 sm:mb-8 px-2">
              {t(
                `discover.result.desc_${result.toLowerCase()}`,
                doshaDescriptions[result.toLowerCase()] || "",
              )}
            </p>

            <div className="flex flex-col items-center gap-3">
              <div
                className={`inline-flex items-center gap-2 text-xs font-bold ${config.text} ${config.softBg} border ${config.border} px-5 py-2 rounded-full`}
              >
                {t(
                  `discover.quiz.element_${result.toLowerCase()}`,
                  config.element,
                )}{" "}
                {t("discover.result.element", "Element")}
              </div>
              <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-1">
                {config.qualities.map((q, idx) => (
                  <span
                    key={q}
                    className="text-[11px] font-medium text-stone-500"
                  >
                    •{" "}
                    {t(
                      `discover.quiz.quality_${result.toLowerCase()}_${idx}`,
                      q,
                    )}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action Area */}
          <div className="bg-stone-50/50 dark:bg-white/5 border-t border-zinc-100 dark:border-white/10 p-4 sm:p-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={onRestart}
              variant="ghost"
              className="w-full sm:w-auto rounded-full px-6 h-11 sm:h-12 font-bold text-stone-500 hover:text-stone-900"
            >
              {t("discover.result.retake", "Retake quiz")}
            </Button>
            <Button
              onClick={handleFinish}
              className={`w-full sm:w-auto rounded-full px-8 sm:px-10 h-11 sm:h-12 font-bold text-white bg-linear-to-r ${config.gradient} shadow-lg hover:scale-105 active:scale-95 transition-all border-0`}
            >
              {t("discover.result.enter_dashboard", "Enter Dashboard")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizResult;
