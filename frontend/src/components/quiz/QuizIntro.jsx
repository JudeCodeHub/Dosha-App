import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const QuizIntro = ({ onStart }) => {
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
      {/* Inline Back Component */}
      <div className="absolute top-0 left-0 z-50">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/discover")}
          className="flex items-center gap-2 text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </Button>
      </div>

      {/* Glass card */}
      <div className="relative w-full bg-white/90 dark:bg-white/5 backdrop-blur-xl border border-zinc-200 dark:border-white/10 rounded-3xl shadow-lg shadow-zinc-200/60 dark:shadow-stone-900/60 px-8 py-12 sm:px-14 sm:py-16 text-center overflow-hidden transition-colors duration-300">

        {/* Subtle inner gradient glow */}
        <div className="pointer-events-none absolute inset-0 rounded-3xl bg-linear-to-br from-amber-50/60 via-transparent to-rose-50/40 dark:from-amber-900/10 dark:to-transparent" />

        {/* Lotus / mandala icon */}
        <div className="relative mb-6 flex justify-center">
          <div className="w-20 h-20 rounded-full bg-linear-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-300/50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 64 64"
              className="w-10 h-10 fill-white"
            >
              <path d="M32 8c0 0-8 10-8 18s8 10 8 10 8-2 8-10S32 8 32 8z" opacity="0.9"/>
              <path d="M14 22c0 0 6 6 14 12s4 12 4 12-8-2-14-10S14 22 14 22z" opacity="0.75"/>
              <path d="M50 22c0 0-6 6-14 12s-4 12-4 12 8-2 14-10S50 22 50 22z" opacity="0.75"/>
              <path d="M8 38c0 0 8 2 16 0 6-2 8-8 8-8s-4 10-10 14S8 38 8 38z" opacity="0.6"/>
              <path d="M56 38c0 0-8 2-16 0-6-2-8-8-8-8s4 10 10 14S56 38 56 38z" opacity="0.6"/>
            </svg>
          </div>
        </div>

        {/* Badge */}
        <div className="relative inline-flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-5 border border-amber-200 dark:border-amber-700/50">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          Ayurvedic Assessment
        </div>

        {/* Title */}
        <h1 className="relative text-4xl sm:text-5xl font-bold text-zinc-900 dark:text-stone-100 leading-tight mb-4">
          Discover Your{" "}
          <span className="bg-linear-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
            Prakriti
          </span>
        </h1>

        {/* Subtitle */}
        <p className="relative text-zinc-600 dark:text-stone-400 text-lg leading-relaxed max-w-md mx-auto mb-3">
          Uncover your unique mind-body constitution rooted in the ancient
          wisdom of{" "}
          <span className="font-medium text-zinc-800 dark:text-stone-300">Ayurveda</span>.
        </p>
        <p className="relative text-zinc-500 dark:text-stone-500 text-sm mb-10">
          21 questions &nbsp;·&nbsp; ~5 minutes &nbsp;·&nbsp; Free & personalized
        </p>

        {/* CTA Button */}
        <Button
          onClick={onStart}
          size="lg"
          className="relative bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold px-10 py-6 rounded-2xl text-base shadow-lg shadow-orange-300/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-orange-300/60 active:scale-100 border-0"
        >
          Begin Your Journey
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="ml-2 w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Button>

        {/* Dosha pills */}
        <div className="relative mt-10 flex justify-center gap-3 flex-wrap">
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 border border-violet-200 dark:border-violet-700/50">
            🌬️ Vata
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-700/50">
            🔥 Pitta
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-700/50">
            🌿 Kapha
          </span>
        </div>
      </div>
    </div>
  );
};

export default QuizIntro;