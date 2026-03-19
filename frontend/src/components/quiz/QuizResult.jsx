import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { savePersonalization } from "@/utils/personalizationStorage";
import { API_BASE_URL } from "@/config/api";

const doshaDescriptions = {
  vata: "Vata is associated with movement, lightness, creativity, and variability.",
  pitta:
    "Pitta is associated with heat, sharpness, intensity, and transformation.",
  kapha:
    "Kapha is associated with stability, strength, calmness, and endurance.",
};

const doshaConfig = {
  vata: {
    gradient: "from-violet-500 to-indigo-500",
    softBg: "bg-violet-50 dark:bg-violet-900/20",
    border: "border-violet-200 dark:border-violet-700/50",
    text: "text-violet-700 dark:text-violet-400",
    badge:
      "bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 border-violet-200 dark:border-violet-700/50",
    scoreBg:
      "bg-violet-50 dark:bg-violet-900/20 border-violet-200 dark:border-violet-700/50",
    scoreText: "text-violet-700 dark:text-violet-400",
    scoreBar: "bg-violet-400",
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
    scoreBg:
      "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-700/50",
    scoreText: "text-orange-700 dark:text-orange-400",
    scoreBar: "bg-orange-400",
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
    scoreBg:
      "bg-teal-50 dark:bg-teal-900/20 border-teal-200 dark:border-teal-700/50",
    scoreText: "text-teal-700 dark:text-teal-400",
    scoreBar: "bg-teal-400",
    emoji: "🌿",
    element: "Earth & Water",
    qualities: ["Calm", "Stable", "Nurturing", "Enduring"],
  },
};

const allDoshas = ["vata", "pitta", "kapha"];

const QuizResult = ({ result, scores, onRestart }) => {
  const navigate = useNavigate();
  const config = doshaConfig[result];
  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);

  const getPercent = (dosha) =>
    totalScore > 0 ? Math.round((scores[dosha] / totalScore) * 100) : 0;

  return (
    <div className="w-full max-w-5xl mx-auto relative">
      {/* Two-column grid on desktop, stacked on mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Hero result card */}
        <div className="relative bg-white/90 dark:bg-white/5 backdrop-blur-xl border border-zinc-200 dark:border-white/10 rounded-3xl shadow-lg shadow-zinc-200/60 dark:shadow-stone-900/60 overflow-hidden transition-colors duration-300">
          {/* Gradient top accent */}
          <div className={`h-2 w-full bg-linear-to-r ${config.gradient}`} />

          {/* Glow blob */}
          <div
            className={`pointer-events-none absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl opacity-20 bg-linear-to-br ${config.gradient}`}
          />

          <div className="relative px-8 py-10 text-center">
            {/* Emoji orb */}
            <div
              className={`mx-auto mb-5 w-24 h-24 rounded-full bg-linear-to-br ${config.gradient} flex items-center justify-center text-5xl shadow-xl`}
            >
              {config.emoji}
            </div>

            {/* Badge */}
            <div
              className={`inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-4 border ${config.badge}`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
              Your Dominant Dosha
            </div>

            {/* Dominant dosha name */}
            <h1
              className={`text-5xl sm:text-6xl font-extrabold bg-linear-to-r ${config.gradient} bg-clip-text text-transparent mb-3 capitalize`}
            >
              {result}
            </h1>

            <p className="text-zinc-600 dark:text-stone-400 text-base leading-relaxed max-w-md mx-auto mb-6">
              {doshaDescriptions[result]}
            </p>

            {/* Element & qualities */}
            <div
              className={`inline-flex items-center gap-2 text-sm font-medium ${config.text} ${config.softBg} border ${config.border} px-4 py-2 rounded-full mb-5`}
            >
              ✦ Element: {config.element}
            </div>

            <div className="flex flex-wrap justify-center gap-2 mb-2">
              {config.qualities.map((q) => (
                <span
                  key={q}
                  className={`px-3 py-1 text-xs font-semibold rounded-full border ${config.badge}`}
                >
                  {q}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Score breakdown cards */}
        <div className="bg-white/90 dark:bg-white/5 backdrop-blur-xl border border-zinc-200 dark:border-white/10 rounded-3xl shadow-lg shadow-zinc-200/60 dark:shadow-stone-900/60 px-8 py-7 transition-colors duration-300">
          <h2 className="text-sm font-semibold tracking-widest uppercase text-zinc-500 dark:text-stone-500 mb-5">
            Your Dosha Breakdown
          </h2>

          <div className="space-y-4">
            {allDoshas.map((dosha) => {
              const dc = doshaConfig[dosha];
              const pct = getPercent(dosha);
              const isDominant = dosha === result;
              return (
                <div
                  key={dosha}
                  className={`rounded-2xl border p-4 transition-all ${
                    isDominant
                      ? `${dc.scoreBg} ${dc.border} ring-2 ring-offset-1 ${dc.border.replace("border-", "ring-")}`
                      : "bg-zinc-50 dark:bg-white/5 border-zinc-100 dark:border-white/10"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{dc.emoji}</span>
                      <span
                        className={`text-sm font-bold capitalize ${
                          isDominant
                            ? dc.scoreText
                            : "text-zinc-700 dark:text-stone-400"
                        }`}
                      >
                        {dosha}
                      </span>
                      {isDominant && (
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${dc.badge}`}
                        >
                          Dominant
                        </span>
                      )}
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      <span
                        className={`text-xl font-extrabold tabular-nums ${
                          isDominant
                            ? dc.scoreText
                            : "text-zinc-600 dark:text-stone-400"
                        }`}
                      >
                        {pct}%
                      </span>
                      <span className="text-xs text-zinc-500 dark:text-stone-500">
                        ({scores[dosha]} pts)
                      </span>
                    </div>
                  </div>

                  {/* Score bar */}
                  <div className="w-full h-2 bg-zinc-200 dark:bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${dc.scoreBar}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {/* end grid */}

      {/* Restart button */}
      <div className="flex justify-center pb-4 mt-10">
        <Button
          onClick={onRestart}
          variant="outline"
          className="rounded-2xl px-8 py-5 text-sm font-semibold border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-stone-400 hover:bg-zinc-50 dark:hover:bg-white/10 hover:text-zinc-900 dark:hover:text-stone-200 hover:border-zinc-300 dark:hover:border-white/20 hover:shadow-md transition-all duration-200 hover:scale-105 active:scale-100"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mr-2 w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Retake Quiz
        </Button>

        <Button
          onClick={async () => {
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
                  body: JSON.stringify({ dosha: result.toLowerCase() }),
                });
              } catch (err) {
                console.error("Failed to sync Dosha to server:", err);
              }
            }

            savePersonalization({
              mode: "quiz",
              dominantDosha:
                result.charAt(0).toUpperCase() + result.slice(1).toLowerCase(),
              scores: {
                vata: scores.vata,
                pitta: scores.pitta,
                kapha: scores.kapha,
              },
            });

            localStorage.setItem("marinZenUserDosha", result.toLowerCase());
            // Clear recommendation cache so the new dosha fetches fresh data
            ["vata", "pitta", "kapha"].forEach((d) =>
              localStorage.removeItem(`marinZenRecommendations_${d}`),
            );
            navigate("/dashboard");
          }}
          className="rounded-2xl px-8 py-5 text-sm font-semibold text-white bg-linear-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 shadow-lg shadow-teal-900/30 transition-all duration-300 hover:scale-105 active:scale-100 border-0 ml-4"
        >
          Go to Dashboard
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="ml-2 w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </Button>
      </div>
    </div>
  );
};

export default QuizResult;
