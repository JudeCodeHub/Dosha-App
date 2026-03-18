import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Dosha color config
const doshaConfig = {
  vata: {
    border: "border-violet-400",
    bg: "bg-violet-50 dark:bg-violet-900/20",
    ring: "ring-violet-400",
    text: "text-violet-700 dark:text-violet-400",
    dot: "bg-violet-500",
    label: "🌬️ Vata",
  },
  pitta: {
    border: "border-orange-400",
    bg: "bg-orange-50 dark:bg-orange-900/20",
    ring: "ring-orange-400",
    text: "text-orange-700 dark:text-orange-400",
    dot: "bg-orange-500",
    label: "🔥 Pitta",
  },
  kapha: {
    border: "border-teal-400",
    bg: "bg-teal-50 dark:bg-teal-900/20",
    ring: "ring-teal-400",
    text: "text-teal-700 dark:text-teal-400",
    dot: "bg-teal-500",
    label: "🌿 Kapha",
  },
};

const QuizQuestion = ({
  question,
  currentQuestionIndex,
  totalQuestions,
  selectedAnswer,
  onAnswerSelect,
  onNext,
  onPrev,
}) => {
  if (!question) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white/90 dark:bg-white/5 backdrop-blur-xl border border-zinc-200 dark:border-white/10 rounded-3xl shadow-lg shadow-zinc-200/60 dark:shadow-stone-900/60 overflow-hidden transition-colors duration-300 p-8">
        <div className="text-center text-zinc-600 dark:text-stone-400">
          Loading question...
        </div>
      </div>
    </div>
  );
}

  const progressValue = ((currentQuestionIndex + 1) / totalQuestions) * 100;
  const isFirst = currentQuestionIndex === 0;
  const isLast = currentQuestionIndex === totalQuestions - 1;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white/90 dark:bg-white/5 backdrop-blur-xl border border-zinc-200 dark:border-white/10 rounded-3xl shadow-lg shadow-zinc-200/60 dark:shadow-stone-900/60 overflow-hidden transition-colors duration-300">
        {/* Progress header strip */}
        <div className="px-8 pt-8 pb-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold tracking-widest uppercase text-zinc-500 dark:text-stone-500">
              Question
            </span>
            <span className="text-xs font-bold text-zinc-600 dark:text-stone-400 tabular-nums">
              {currentQuestionIndex + 1}
              <span className="text-zinc-400 dark:text-stone-600">
                {" "}
                / {totalQuestions}
              </span>
            </span>
          </div>

          {/* Single progress bar */}
          <Progress value={progressValue} className="h-2" />
        </div>

        {/* Question text */}
        <div className="px-8 pb-6">
          <div className="inline-flex items-center gap-2 bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full border border-amber-200 dark:border-amber-700/50 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            {question.question}
          </div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-stone-100 leading-snug">
            Which best describes your{" "}
            <span className="text-amber-600 dark:text-amber-400">
              {question.question?.toLowerCase()}
            </span>
            ?
          </h2>
        </div>

        {/* Answer option cards */}
        <div className="px-8 pb-6 space-y-3">
          {question.options.map((option, index) => {
            const doshaKey = option.dosha ? option.dosha.toLowerCase() : "";
            const dosha = doshaConfig[doshaKey];
            const isSelected = selectedAnswer === doshaKey;
            return (
              <button
                key={option.key || index}
                onClick={() => onAnswerSelect(doshaKey)}
                className={`group w-full text-left rounded-2xl border-2 px-5 py-4 flex items-start gap-4 transition-all duration-200
                  ${
                    isSelected && dosha
                      ? `${dosha.border} ${dosha.bg} ring-2 ${dosha.ring}/40 shadow-md`
                      : isSelected 
                      ? "border-zinc-500 bg-zinc-100 ring-2 ring-zinc-500/40 shadow-md"
                      : "border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 hover:border-zinc-300 dark:hover:border-white/20 hover:shadow-sm"
                  }`}
              >
                {/* Indicator circle */}
                <div
                  className={`mt-0.5 shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200
                    ${
                      isSelected && dosha
                        ? `${dosha.border} ${dosha.dot}`
                        : isSelected
                        ? "border-zinc-500 bg-zinc-500"
                        : "border-zinc-300 dark:border-stone-600 group-hover:border-zinc-400 dark:group-hover:border-stone-500"
                    }`}
                >
                  {isSelected && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-3 h-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm leading-relaxed transition-colors duration-200 ${
                      isSelected && dosha
                        ? `${dosha.text} font-medium`
                        : "text-zinc-700 dark:text-stone-400"
                    }`}
                  >
                    {option.text}
                  </p>
                  {isSelected && dosha && (
                    <span
                      className={`inline-block mt-1.5 text-xs font-semibold tracking-wide ${dosha.text}`}
                    >
                      {dosha.label}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Navigation */}
        <div className="px-8 pb-8 mt-2 flex w-full items-center justify-between gap-3">
          <Button
            variant="outline"
            onClick={onPrev}
            disabled={isFirst}
            className="flex items-center gap-2 h-11 px-4 rounded-xl border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-stone-400 hover:bg-zinc-50 dark:hover:bg-white/10 hover:text-zinc-900 dark:hover:text-stone-200 disabled:opacity-30 transition-all duration-200"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          <Button
            onClick={onNext}
            disabled={!selectedAnswer}
            className="flex items-center gap-2 h-11 px-5 rounded-xl bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold shadow-md shadow-orange-200/50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 active:scale-100 border-0"
          >
            {isLast ? "See My Result" : "Next Question"}
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuizQuestion;
