import React, { useState, useRef, useEffect } from "react";
import { Activity } from "lucide-react";


const DoshaTrackingBadge = ({ dosha, visual, trackingData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  const totalScore = trackingData?.scores 
    ? Object.values(trackingData.scores).reduce((a, b) => (a || 0) + (b || 0), 0)
    : 0;

  const getPercent = (score) => {
    if (!totalScore || !score) return 0;
    return Math.round((score / totalScore) * 100);
  };

  const scores = trackingData?.scores || {};
  const mode = trackingData?.mode || "manual";

  const getFocus = () => {
    const vPct = getPercent(scores.vata);
    const pPct = getPercent(scores.pitta);
    const kPct = getPercent(scores.kapha);

    if (vPct > 50) return "Grounding and warming balance";
    if (pPct > 50) return "Cooling and calming balance";
    if (kPct > 50) return "Light and energizing balance";
    
    // Default to dominant if none > 50
    const dLower = dosha?.toLowerCase();
    if (dLower === "vata") return "Grounding and warming balance";
    if (dLower === "pitta") return "Cooling and calming balance";
    return "Light and energizing balance";
  };

  return (
    <div 
      ref={containerRef}
      className="relative flex items-center justify-center h-full"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
   
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer flex items-center gap-3 bg-stone-100/50 dark:bg-stone-900/50 px-6 py-2.5 rounded-full border border-stone-200/50 dark:border-stone-800/50 shadow-inner group transition-all duration-300 hover:border-stone-300 dark:hover:border-stone-700 active:scale-95"
      >
        <span className="text-2xl group-hover:scale-110 transition-transform duration-300">
          {visual.icon}
        </span>
        <span className={`text-xl font-extrabold uppercase tracking-[0.2em] ${visual.color}`}>
          {dosha}
        </span>
      </div>

      {/* Popover Card */}
      {isOpen && (
        <div 
          className="absolute top-full mt-4 w-72 z-100 animate-in fade-in slide-in-from-top-2 duration-200"
          style={{ transform: 'translateX(-50%)', left: '50%' }}
        >
          {/* Glass Card */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-2xl shadow-stone-400/20 dark:shadow-black/50">
            
            {/* Header / Mode */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-teal-500" />
                <span className="text-xs font-bold uppercase tracking-widest text-stone-500">
                  Profile
                </span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-500 uppercase">
                {mode}
              </span>
            </div>

            {/* Dominant Info */}
            <div className="mb-6 flex items-center gap-4">
               <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl bg-linear-to-br ${visual.gradient} text-white shadow-sm font-sans`}>
                 {visual.icon}
               </div>
               <p className={`text-2xl font-black uppercase tracking-tight ${visual.color}`}>{dosha}</p>
            </div>

            {/* Progress Bars (Breakdown) */}
            {totalScore > 0 && (
              <div className="space-y-4 mb-6 pt-4 border-t border-stone-100 dark:border-stone-800">
                {Object.entries(scores).map(([name, score]) => {
                  const pct = getPercent(score);
                  const isDom = name.toLowerCase() === dosha.toLowerCase();
                  
                  return (
                    <div key={name} className="space-y-1.5">
                      <div className="flex justify-between items-end">
                        <span className={`text-[11px] font-bold uppercase tracking-wider ${isDom ? 'text-stone-800 dark:text-stone-200' : 'text-stone-400'}`}>
                          {name}
                        </span>
                        <span className={`text-xs font-black ${isDom ? 'text-stone-800 dark:text-stone-200' : 'text-stone-400'}`}>
                          {pct}%
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ${isDom ? `bg-linear-to-r ${visual.gradient}` : 'bg-stone-300 dark:bg-stone-700'}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Insights Section */}
            <div className="pt-4 border-t border-stone-100 dark:border-stone-800 space-y-2">
              <div className="space-y-0.5">
                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-tighter">Primary Focus</p>
                <p className="text-xs font-bold text-stone-700 dark:text-stone-200">{getFocus()}</p>
              </div>
            </div>

            {/* Triangle Pointer */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white dark:bg-stone-900 border-t border-l border-stone-200 dark:border-stone-800 rotate-45 rounded-sm" />
          </div>
        </div>
      )}
    </div>
  );
};

export default DoshaTrackingBadge;
