import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import QuizIntro from "@/components/quiz/QuizIntro";
import QuizQuestion from "@/components/quiz/QuizQuestion";
import QuizResult from "@/components/quiz/QuizResult";
import { ChevronLeft } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import IntroPage from "@/pages/IntroPage";
import AuthPage from "@/pages/AuthPage";
import DiscoverPage from "@/pages/DiscoverPage";
import DashboardPage from "@/pages/DashboardPage";
import { API_BASE_URL } from "@/config/api";
import { useTranslation } from "react-i18next";

const QuizModule = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
 
  const [quizStarted, setQuizStarted] = useState(() => {
    try {
      const s = localStorage.getItem("prakritiQuizState");
      return s ? JSON.parse(s).quizStarted ?? false : false;
    } catch { return false; }
  });
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(() => {
    try {
      const s = localStorage.getItem("prakritiQuizState");
      return s ? JSON.parse(s).currentQuestionIndex ?? 0 : 0;
    } catch { return 0; }
  });
  const [answers, setAnswers] = useState(() => {
    try {
      const s = localStorage.getItem("prakritiQuizState");
      return s ? JSON.parse(s).answers ?? [] : [];
    } catch { return []; }
  });
  const [quizFinished, setQuizFinished] = useState(() => {
    try {
      const s = localStorage.getItem("prakritiQuizState");
      return s ? JSON.parse(s).quizFinished ?? false : false;
    } catch { return false; }
  });

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      try {
        const response = await fetch(`${API_BASE_URL}/api/questions`, { 
          signal: controller.signal,
          headers: {
            "X-Language": i18n.language || "en",
          }
        });
        
        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data.questions)) {
            setQuestions(data.questions);
          } else {
            console.error("Malformed API response: 'questions' should be an array.");
            setError("The quiz service returned invalid data. Please try again.");
          }
        } else {
          console.error(`Failed to load questions: ${response.status} ${response.statusText}`);
          setError("Failed to load questions from backend. Please try again.");
        }
      } catch (err) {
        if (err.name === 'AbortError') {
          console.error("Quiz questions fetch timed out.");
          setError("The request timed out. Please check your connection and try again.");
        } else {
          console.error("Error fetching questions:", err);
          setError("Error connecting to the backend API.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [i18n.language]);

  // Persist state to localStorage on every change
  useEffect(() => {
    localStorage.setItem(
      "prakritiQuizState",
      JSON.stringify({ quizStarted, currentQuestionIndex, answers, quizFinished })
    );
  }, [quizStarted, currentQuestionIndex, answers, quizFinished]);

  const currentQuestion = questions?.[currentQuestionIndex] || null;
  const selectedAnswer = answers[currentQuestionIndex] || "";

  const handleStartQuiz = () => {
    setQuizStarted(true);
  };

  const handleAnswerSelect = (value) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestionIndex] = value;
    setAnswers(updatedAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    } else {
      navigate("/discover");
    }
  };

  const calculateScores = () => {
    const scores = {
      vata: 0,
      pitta: 0,
      kapha: 0,
    };

    answers.forEach((answer) => {
      if (scores[answer] !== undefined) {
        scores[answer] += 1;
      }
    });

    return scores;
  };

  const getDominantDosha = (scores) => {
    return Object.keys(scores).reduce((a, b) =>
      scores[a] >= scores[b] ? a : b
    );
  };

  const handleRestart = () => {
    localStorage.removeItem("prakritiQuizState");
    setQuizStarted(false);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setQuizFinished(false);
  };

  const scores = calculateScores();
  const result = getDominantDosha(scores);

  return (
    <main className="px-4 pt-20 pb-10 flex items-center justify-center relative overflow-hidden h-full w-full">
      {/* Decorative background blobs */}
      <div className="pointer-events-none absolute -top-32 -left-32 w-96 h-96 rounded-full bg-violet-200/30 dark:bg-violet-900/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-orange-200/30 dark:bg-orange-900/20 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-amber-100/20 dark:bg-amber-900/10 blur-3xl" />

      {/* Inline Back Component — replaces global BackButton */}
      {quizStarted && (
        <div className="absolute top-6 left-6 z-50">
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePrev}
            className="flex items-center gap-2 text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </Button>
        </div>
      )}

      <div className="relative z-10 w-full flex items-center justify-center">
        {!quizStarted ? (
          <QuizIntro onStart={handleStartQuiz} />
        ) : loading ? (
          <div className="text-center p-8 bg-white/80 dark:bg-stone-900/80 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-2xl shadow-xl max-w-2xl w-full mx-4">
            <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100">{t('discover.quiz.loading', 'Loading questions...')}</h2>
          </div>
        ) : error ? (
          <div className="text-center p-8 bg-rose-50/80 dark:bg-rose-900/30 backdrop-blur-md border border-rose-200 dark:border-rose-800/50 rounded-2xl shadow-xl max-w-2xl w-full mx-4">
            <h2 className="text-2xl font-bold text-rose-800 dark:text-rose-200 mb-4">{error}</h2>
            <Button onClick={() => window.location.reload()} variant="outline" className="border-rose-200 text-rose-700 hover:bg-rose-100">{t('discover.quiz.try_again', 'Try Again')}</Button>
          </div>
        ) : questions.length === 0 ? (
          <div className="text-center p-8 bg-white/80 dark:bg-stone-900/80 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-2xl shadow-xl max-w-2xl w-full mx-4">
            <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100">{t('discover.quiz.no_questions', 'No questions found!')}</h2>
          </div>
        ) : !quizFinished ? (
          <QuizQuestion
            question={currentQuestion}
            currentQuestionIndex={currentQuestionIndex}
            totalQuestions={questions.length}
            selectedAnswer={selectedAnswer}
            onAnswerSelect={handleAnswerSelect}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        ) : (
          <QuizResult result={result} scores={scores} onRestart={handleRestart} />
        )}
      </div>
    </main>
  );
};

const App = () => {
  return (
    <div className="min-h-screen w-full bg-linear-to-br from-amber-50 via-orange-50 to-rose-50 dark:from-stone-950 dark:via-stone-900 dark:to-stone-950 text-stone-800 dark:text-stone-200 transition-colors duration-300">
      <BrowserRouter>
        {/* Global Theme Toggle */}
        <div className="fixed top-4 right-4 z-50">
          <ThemeToggle />
        </div>

        <Routes>
          <Route path="/" element={<IntroPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/discover" element={<DiscoverPage />} />
          <Route path="/quiz" element={<QuizModule />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;