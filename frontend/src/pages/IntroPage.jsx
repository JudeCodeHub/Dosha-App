import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { LanguageSelector } from "@/components/ui/LanguageSelector";

export const IntroPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <main className="px-4 py-20 flex flex-col items-center justify-center relative overflow-hidden w-full h-full">
      <LanguageSelector />
      
      {/* Soft Glow Background Accents */}
      <div className="pointer-events-none absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-orange-900/20 blur-3xl opacity-60" />
      <div className="pointer-events-none absolute bottom-10 right-10 w-[400px] h-[400px] rounded-full bg-amber-900/10 blur-3xl opacity-50" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-orange-500/5 blur-3xl" />

      <div className="relative z-10 w-full max-w-4xl mx-auto text-center flex flex-col items-center">
        {/* App Title & Tagline */}
        <div className="mb-8">
          <h1 className="text-6xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-amber-400 to-orange-500 mb-4 tracking-tight drop-shadow-sm">
            {t('intro.title')}
          </h1>
          <p className="text-xl md:text-2xl font-medium text-amber-700 dark:text-amber-200/80 tracking-wide uppercase">
            {t('intro.tagline')}
          </p>
        </div>

        {/* Main Description */}
        <p className="text-lg md:text-xl text-stone-600 dark:text-stone-300 max-w-2xl leading-relaxed mb-12">
          {t('intro.description')}
        </p>

        {/* Call to Action */}
        <div className="mb-20">
          <Button
            onClick={() => navigate('/auth')}
            size="lg"
            className="h-14 px-10 text-lg rounded-full bg-linear-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold shadow-lg shadow-orange-900/40 transition-all duration-300 hover:scale-105 hover:shadow-orange-900/60 border-0"
          >
            {t('intro.cta')}
            <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Button>
        </div>

        {/* Info Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full px-4">
          <div className="bg-white/60 dark:bg-stone-800/40 backdrop-blur-md border border-stone-200/50 dark:border-stone-700/50 rounded-2xl p-6 text-left hover:bg-white/80 dark:hover:bg-stone-800/60 transition-colors duration-300">
            <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center mb-4 text-orange-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-stone-800 dark:text-stone-200 mb-2">{t('intro.features.discovery.title')}</h3>
            <p className="text-sm text-stone-600 dark:text-stone-400">{t('intro.features.discovery.description')}</p>
          </div>

          <div className="bg-white/60 dark:bg-stone-800/40 backdrop-blur-md border border-stone-200/50 dark:border-stone-700/50 rounded-2xl p-6 text-left hover:bg-white/80 dark:hover:bg-stone-800/60 transition-colors duration-300">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center mb-4 text-amber-400">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-stone-800 dark:text-stone-200 mb-2">{t('intro.features.customization.title')}</h3>
            <p className="text-sm text-stone-600 dark:text-stone-400">{t('intro.features.customization.description')}</p>
          </div>

          <div className="bg-white/60 dark:bg-stone-800/40 backdrop-blur-md border border-stone-200/50 dark:border-stone-700/50 rounded-2xl p-6 text-left hover:bg-white/80 dark:hover:bg-stone-800/60 transition-colors duration-300">
            <div className="w-10 h-10 rounded-full bg-orange-600/20 flex items-center justify-center mb-4 text-orange-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0M3.124 7.5A8.969 8.969 0 015.292 3m13.416 0a8.969 8.969 0 012.168 4.5" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-stone-800 dark:text-stone-200 mb-2">{t('intro.features.holistic.title')}</h3>
            <p className="text-sm text-stone-600 dark:text-stone-400">{t('intro.features.holistic.description')}</p>
          </div>
        </div>

      </div>
    </main>
  );
};

export default IntroPage;
