import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

export const BackButton = ({ to }) => {
  const navigate = useNavigate();

  const handleNavigation = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  return (
    <button 
      onClick={handleNavigation}
      className="absolute top-6 left-6 flex items-center gap-2 text-stone-600 hover:text-stone-800 transition-colors bg-white/50 hover:bg-white/80 dark:text-stone-400 dark:hover:text-stone-200 dark:bg-stone-800/50 dark:hover:bg-stone-800 backdrop-blur-sm px-4 py-2 rounded-full border border-stone-200/50 dark:border-stone-700/50 z-50"
      aria-label="Go back"
    >
      <ChevronLeft className="w-4 h-4" />
      <span className="text-sm font-medium"></span>
    </button>
  );
};

export default BackButton;
