import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { AnimationSequence } from '../types/animations';
import AnimationStepComponent from './AnimationStep';

interface InteractiveAnimationPlayerProps {
  animation: AnimationSequence;
  onComplete?: () => void;
}

const InteractiveAnimationPlayer = ({
  animation,
  onComplete,
}: InteractiveAnimationPlayerProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);

  const currentStepData = animation.steps[currentStep];
  const progress = ((currentStep + 1) / animation.totalSteps) * 100;

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isPlaying && currentStep < animation.totalSteps - 1) {
      interval = setTimeout(() => {
        handleNextStep();
      }, (animation.autoPlayDelay || 3) * 1000);
    } else if (isPlaying && currentStep === animation.totalSteps - 1) {
      setIsPlaying(false);
      onComplete?.();
    }

    return () => clearTimeout(interval);
  }, [isPlaying, currentStep, animation.totalSteps, animation.autoPlayDelay, onComplete]);

  const markStepCompleted = () => {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }
  };

  const handleNextStep = () => {
    markStepCompleted();

    if (currentStepData.quiz && !showQuiz) {
      setShowQuiz(true);
      return;
    }

    if (currentStep < animation.totalSteps - 1) {
      setCurrentStep(currentStep + 1);
      setShowQuiz(false);
      setQuizAnswer(null);
    } else {
      setIsPlaying(false);
      onComplete?.();
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setShowQuiz(false);
      setQuizAnswer(null);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setCompletedSteps([]);
    setIsPlaying(false);
    setShowQuiz(false);
    setQuizAnswer(null);
  };

  const handleQuizSubmit = () => {
    if (quizAnswer !== null) {
      const isCorrect = quizAnswer === currentStepData.quiz?.correct;
      if (isCorrect) {
        handleNextStep();
      } else {
        setQuizAnswer(null);
      }
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="aspect-video bg-gray-900 relative overflow-hidden">
        <AnimatePresence mode="wait">
          <AnimationStepComponent
            key={`step-${currentStep}`}
            step={currentStepData}
            isActive={true}
            isCompleted={completedSteps.includes(currentStep)}
          />
        </AnimatePresence>

        {/* Quiz Overlay */}
        <AnimatePresence>
          {showQuiz && currentStepData.quiz && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
              >
                <h3 className="text-xl font-bold text-[#1C1C1C] mb-4">
                  Quick Check: {currentStepData.quiz.question}
                </h3>
                <div className="space-y-3 mb-6">
                  {currentStepData.quiz.options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => setQuizAnswer(idx)}
                      className={`w-full text-left p-4 rounded-lg transition-all duration-300 border-2 ${
                        quizAnswer === idx
                          ? 'bg-[#E63946] text-white border-[#E63946]'
                          : 'bg-gray-50 text-[#1C1C1C] border-gray-200 hover:border-[#E63946]'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>

                {quizAnswer !== null && quizAnswer !== currentStepData.quiz.correct && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-600 text-sm mb-4 font-semibold"
                  >
                    Try again! This isn't quite right.
                  </motion.p>
                )}

                <button
                  onClick={handleQuizSubmit}
                  disabled={quizAnswer === null}
                  className="w-full py-3 bg-[#E63946] text-white rounded-lg hover:bg-[#d32f3b] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                >
                  {quizAnswer === null ? 'Select an answer' : 'Continue'}
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-6 space-y-6">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-[#1C1C1C]">{animation.title}</h3>
            <span className="text-sm text-gray-600">
              Step {currentStep + 1} of {animation.totalSteps}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-gradient-to-r from-[#E63946] to-[#d32f3b]"
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Step Indicators */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {animation.steps.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCurrentStep(idx);
                setShowQuiz(false);
                setQuizAnswer(null);
              }}
              className={`flex-shrink-0 w-10 h-10 rounded-full font-semibold transition-all duration-300 ${
                idx === currentStep
                  ? 'bg-[#E63946] text-white shadow-lg scale-110'
                  : completedSteps.includes(idx)
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              {completedSteps.includes(idx) ? '✓' : idx + 1}
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-3 justify-between items-center">
          <div className="flex gap-2">
            <button
              onClick={handlePreviousStep}
              disabled={currentStep === 0}
              className="p-3 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Previous step"
            >
              <SkipBack className="w-5 h-5" />
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-3 rounded-lg bg-[#E63946] text-white hover:bg-[#d32f3b] transition-all duration-300"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>

            <button
              onClick={handleNextStep}
              disabled={currentStep === animation.totalSteps - 1 && completedSteps.includes(currentStep)}
              className="p-3 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Next step"
            >
              <SkipForward className="w-5 h-5" />
            </button>

            <button
              onClick={handleReset}
              className="p-3 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-300"
              title="Reset animation"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-3 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-300"
            title={isMuted ? 'Unmute narration' : 'Mute narration'}
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
        </div>

        {/* Current Step Info */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          key={`info-${currentStep}`}
          className="p-4 bg-blue-50 rounded-lg border border-blue-200"
        >
          <p className="text-sm text-blue-900">
            <span className="font-semibold">💡 Tip: </span>
            {currentStepData.narration ||
              currentStepData.description ||
              'Click "Next" to continue.'}
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default InteractiveAnimationPlayer;
