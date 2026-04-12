import React, { useState } from "react";

/**
 * RecommendationSection
 * Premium card component for the MarinZen dashboard.
 *
 * Props:
 *   title    – card heading
 *   subtitle – small descriptor below heading
 *   content  – raw text from the API (newline-separated or paragraph)
 *   icon     – emoji icon
 *   profile  – dosha profile object ({ gradient, accent, accentLight })
 *   index    – position in grid (used for stagger animation delay)
 */
const RecommendationSection = ({ title, subtitle, content, icon, profile, index = 0 }) => {
  const [expanded, setExpanded] = useState(false);

  if (!content) return null;

  /* ── Parse content into bullet lines ─────────────────────────────── */
  const rawLines = content
    .split("\n")
    .map((l) => l.replace(/^[-•*✦▸►→]\s*/, "").trim())
    .filter((l) => l.length > 0);

  const PREVIEW_COUNT = 4;
  const hasMore       = rawLines.length > PREVIEW_COUNT;
  const visibleLines  = hasMore && !expanded ? rawLines.slice(0, PREVIEW_COUNT) : rawLines;

  const delayMs = index * 80;

  return (
    <article
      className="group relative bg-white dark:bg-stone-900 rounded-2xl overflow-hidden border border-stone-100 dark:border-stone-800 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-0.5 flex flex-col"
      style={{ animationDelay: `${delayMs}ms` }}
    >
      {/* Top gradient accent bar */}
      <div className="h-[3px] w-full flex-shrink-0" style={{ background: profile.gradient }} />

      {/* Card body */}
      <div className="p-6 flex flex-col flex-1">

        {/* ── Header ── */}
        <div className="flex items-start gap-4 mb-5">
          {/* Icon bubble */}
          <div
            className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center text-xl shadow-md"
            style={{ background: profile.gradient }}
            aria-hidden
          >
            {icon}
          </div>

          {/* Title block */}
          <div className="min-w-0">
            <h3
              className="text-xl font-semibold text-stone-800 dark:text-stone-100 leading-tight truncate"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              {title}
            </h3>
            <p className="text-[10px] font-semibold tracking-widest uppercase text-stone-400 mt-0.5">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-stone-100 dark:bg-stone-800 mb-5 flex-shrink-0" />

        {/* ── Bullet list ── */}
        <ul className="flex-1 space-y-3 mb-4" role="list">
          {visibleLines.map((line, i) => (
            <li key={i} className="flex items-start gap-3">
              {/* Dot */}
              <span
                className="mt-[7px] w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: profile.accent }}
                aria-hidden
              />
              {/* Text */}
              <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                {line}
              </p>
            </li>
          ))}
        </ul>

        {/* ── Expand / Collapse ── */}
        {hasMore && (
          <button
            onClick={() => setExpanded((v) => !v)}
            className="mt-auto self-start text-[11px] font-semibold tracking-widest uppercase transition-opacity hover:opacity-70"
            style={{ color: profile.accent }}
            aria-expanded={expanded}
          >
            {expanded
              ? "↑ Show Less"
              : `+ ${rawLines.length - PREVIEW_COUNT} More`}
          </button>
        )}
      </div>

      {/* Subtle hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
        style={{ boxShadow: `inset 0 0 0 1px ${profile.accent}30` }}
        aria-hidden
      />
    </article>
  );
};

export default RecommendationSection;