import React from "react";

const RecommendationSection = ({ title, content, icon, visual }) => {
  if (!content) return null;

  return (
    <section className="w-full mb-8 bg-white/40 dark:bg-stone-900/40 backdrop-blur-md border border-stone-200/50 dark:border-stone-800/50 rounded-3xl p-8 transition-all duration-300 hover:shadow-lg hover:shadow-stone-200/40 dark:hover:shadow-black/20">
      <div className="flex items-center gap-4 mb-6">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl bg-linear-to-br ${visual.gradient} text-white shadow-sm shadow-stone-400/20`}>
          {icon}
        </div>
        <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 tracking-tight">
          {title}
        </h2>
      </div>
      
      <div className="text-stone-600 dark:text-stone-400 text-lg leading-relaxed whitespace-pre-line font-medium italic">
        {content}
      </div>
    </section>
  );
};

export default RecommendationSection;
