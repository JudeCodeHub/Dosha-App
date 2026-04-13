import React from "react";
import { useTranslation } from "react-i18next";

const RecommendationSection = ({
  title,
  subtitle,
  icon,
  profile,
  index = 0,
  onClick,
}) => {
  const { t } = useTranslation();
  const delayMs = index * 80;

  return (
    <article
      onClick={onClick}
      className={`group relative bg-white dark:bg-stone-900 rounded-2xl overflow-hidden border border-stone-100 dark:border-stone-800 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-0.5 flex flex-col ${onClick ? "cursor-pointer" : ""}`}
      style={{ animationDelay: `${delayMs}ms` }}
    >
      <div
        className="h-0.75 w-full shrink-0"
        style={{ background: profile.gradient }}
      />

      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-start gap-4 mb-4">
          <div
            className="w-12 h-12 rounded-xl shrink-0 flex items-center justify-center text-xl shadow-md"
            style={{ background: profile.gradient }}
            aria-hidden
          >
            {icon}
          </div>

          <div className="min-w-0 flex-1">
            <h3
              className="text-xl font-semibold text-stone-800 dark:text-stone-100 leading-tight truncate"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              {title}
            </h3>
            <p className="text-[10px] font-semibold tracking-widest uppercase text-stone-400 mt-1">
              {subtitle}
            </p>
          </div>
        </div>

        <div className="mt-auto pt-2 flex items-center justify-end">
          {onClick && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClick();
              }}
              className="group-hover:bg-opacity-20 transition-all flex items-center gap-1.5 px-4 py-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider rounded-full border"
              style={{
                color: profile.accent,
                borderColor: `${profile.accent}40`,
                backgroundColor: `${profile.accent}0d`,
              }}
            >
              {t("dashboard.explore", "Explore")}{" "}
              <span className="text-sm leading-none transition-transform group-hover:translate-x-1">
                →
              </span>
            </button>
          )}
        </div>
      </div>

      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
        style={{ boxShadow: `inset 0 0 0 1px ${profile.accent}30` }}
        aria-hidden
      />
    </article>
  );
};

export default RecommendationSection;
