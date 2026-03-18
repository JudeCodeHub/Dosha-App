import { Button } from "@/components/ui/button";

export const DashboardCard = ({ title, description, buttonText, icon, onAction }) => {
  return (
    <div className="bg-white/60 dark:bg-stone-800/40 backdrop-blur-md border border-stone-200/50 dark:border-stone-700/50 rounded-2xl p-6 flex flex-col items-start gap-4 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-2xl shadow-sm text-amber-600 dark:text-amber-500">
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-2">{title}</h3>
        <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed font-medium">
          {description}
        </p>
      </div>
      <Button 
        onClick={onAction}
        className="w-full mt-2 bg-stone-100 hover:bg-stone-200 text-stone-800 dark:bg-stone-700/50 dark:text-stone-200 dark:hover:bg-stone-700/80 transition-colors shadow-sm rounded-xl py-5 font-semibold"
      >
        {buttonText}
      </Button>
    </div>
  );
};

export default DashboardCard;
