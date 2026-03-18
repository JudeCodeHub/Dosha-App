import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import DiscoveryOptionCard from "@/components/discover/DiscoveryOptionCard";
import DoshaCard from "@/components/discover/DoshaCard";
import { ChevronRight } from "lucide-react";
import { savePersonalization } from "@/utils/personalizationStorage";
import BackButton from "@/components/navigation/BackButton";

export const DiscoverPage = () => {
  const navigate = useNavigate();

  const handleDoshaSelect = async (dosha) => {

    const userId = localStorage.getItem("userId");
    const selectedDosha = dosha.toLowerCase();

    try {
      if (userId) {
        const token = localStorage.getItem("token");
        const authUrl = import.meta.env.VITE_AUTH_SERVICE_URL || "http://127.0.0.1:8003";
        // Broadcast manual override tracking to Backend
        await fetch(`${authUrl}/auth/dosha`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ dosha: selectedDosha })
        });
      }
    } catch (error) {
      console.error("Failed to sync Dosha to server:", error);
    }

    // Assign Dosha parameter to explicitly chosen local parameter
    localStorage.setItem("marinZenUserDosha", selectedDosha);

    // Save structured personalization object for dashboard logic
    savePersonalization({
      mode: "manual",
      dominantDosha: dosha, // "Vata", "Pitta", "Kapha"
      scores: {
        vata: null,
        pitta: null,
        kapha: null
      }
    });
    
    navigate("/dashboard");
  };

  return (
    <main className="px-4 py-16 md:py-24 flex flex-col items-center justify-center relative overflow-y-auto overflow-x-hidden w-full h-full">
      {/* Background glow effects */}
      <div className="pointer-events-none absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-teal-900/10 blur-3xl opacity-50" />
      <div className="pointer-events-none absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-orange-900/10 blur-3xl opacity-40" />

      {/* Back Button Example */}
      <BackButton to="/auth" />

      {/* Main Container */}
      <div className="w-full max-w-5xl z-10 flex flex-col items-center">
        {/* Header */}
        <div className="mb-14 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-linear-to-r from-amber-400 to-orange-500 mb-4 tracking-tight">
            Discover Your Wellness Path
          </h1>
          <p className="text-stone-600 dark:text-stone-400 text-lg md:text-xl max-w-2xl mx-auto">
            Choose how you want to begin your personalized Ayurvedic journey.
          </p>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full px-4">
          
          {/* Option 1: Take Quiz */}
          <DiscoveryOptionCard 
            title="Take the Prakriti Quiz" 
            description="Answer a few guided questions to identify your Ayurvedic body constitution."
          >
            <Button 
              onClick={() => {
                localStorage.removeItem("prakritiQuizState");
                navigate('/quiz');
              }}
              className="w-full h-14 bg-linear-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white rounded-xl text-lg font-semibold shadow-lg shadow-teal-900/30 transition-all duration-300 hover:scale-[1.02] border-0 mt-4 group"
            >
              Start Quiz
              <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </DiscoveryOptionCard>

          {/* Option 2: Direct Selection */}
          <DiscoveryOptionCard 
            title="I Already Know My Dosha" 
            description="Select your dosha directly and continue to your personalized dashboard."
          >
            <div className="flex gap-3 justify-between mt-4">
              <DoshaCard 
                dosha="Vata" 
                icon="🌬️" 
                colorClass="bg-violet-900/40 text-violet-400" 
                onClick={handleDoshaSelect} 
              />
              <DoshaCard 
                dosha="Pitta" 
                icon="🔥" 
                colorClass="bg-orange-900/40 text-orange-400" 
                onClick={handleDoshaSelect} 
              />
              <DoshaCard 
                dosha="Kapha" 
                icon="🌿" 
                colorClass="bg-teal-900/40 text-teal-400" 
                onClick={handleDoshaSelect} 
              />
            </div>
          </DiscoveryOptionCard>

        </div>
      </div>
    </main>
  );
};

export default DiscoverPage;
