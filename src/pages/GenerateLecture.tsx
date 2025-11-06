import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Download, Video, FileText, RefreshCw } from 'lucide-react';
import { mockQuestions } from '../utils/mockData';

const GenerateLecture = () => {
  const [topic, setTopic] = useState('');
  const [audience, setAudience] = useState('High School');
  const [duration, setDuration] = useState('5 min');
  const [theme, setTheme] = useState('Minimalist');
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [progress, setProgress] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<{ [key: number]: number }>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleGenerate = async () => {
    setGenerating(true);
    setGenerated(false);
    setProgress(0);

    const steps = ['Generating Slides', 'Adding Voiceover', 'Creating Quiz', 'Done!'];

    for (let i = 0; i < steps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setProgress(((i + 1) / steps.length) * 100);
    }

    setGenerating(false);
    setGenerated(true);
  };

  const handleQuizSubmit = () => {
    let correctCount = 0;
    mockQuestions.forEach((q) => {
      if (quizAnswers[q.id] === q.correct) {
        correctCount++;
      }
    });
    setScore(correctCount);
    setQuizSubmitted(true);

    const existingQuizzes = JSON.parse(localStorage.getItem('edubuilder_quizzes') || '[]');
    existingQuizzes.push({
      id: Date.now(),
      topic,
      score: correctCount,
      total: mockQuestions.length,
      date: new Date().toISOString().split('T')[0],
    });
    localStorage.setItem('edubuilder_quizzes', JSON.stringify(existingQuizzes));
  };

  const handleRetakeQuiz = () => {
    setQuizAnswers({});
    setQuizSubmitted(false);
    setScore(0);
  };

  const getScoreMessage = () => {
    if (score === 3) return { text: 'Excellent!', emoji: '🎉' };
    if (score === 2) return { text: 'Good Job!', emoji: '👏' };
    return { text: 'Keep Practicing', emoji: '💪' };
  };

  return (
    <div className="max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-[#1C1C1C] mb-2">Generate Lecture</h1>
        <p className="text-gray-600">Transform your ideas into complete educational materials</p>
      </motion.div>

      <AnimatePresence mode="wait">
        {!generating && !generated && (
          <motion.div
            key="form"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl p-8 shadow-lg"
          >
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-[#1C1C1C] mb-2">
                  Topic
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Explain the water cycle for middle school students"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#E63946] focus:outline-none transition-all duration-300"
                />
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-[#1C1C1C] mb-2">
                    Target Audience
                  </label>
                  <select
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#E63946] focus:outline-none transition-all duration-300"
                  >
                    <option>Primary</option>
                    <option>High School</option>
                    <option>College</option>
                    <option>Corporate</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#1C1C1C] mb-2">
                    Duration
                  </label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#E63946] focus:outline-none transition-all duration-300"
                  >
                    <option>2 min</option>
                    <option>5 min</option>
                    <option>10 min</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#1C1C1C] mb-2">
                    Visual Theme
                  </label>
                  <select
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#E63946] focus:outline-none transition-all duration-300"
                  >
                    <option>Minimalist</option>
                    <option>Chalkboard</option>
                    <option>Corporate</option>
                  </select>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGenerate}
                disabled={!topic}
                className="w-full py-4 bg-gradient-to-r from-[#E63946] to-[#d32f3b] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Generate Assets
              </motion.button>
            </div>
          </motion.div>
        )}

        {generating && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-white rounded-2xl p-12 shadow-lg text-center"
          >
            <div className="max-w-md mx-auto">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-[#E63946] to-[#d32f3b] rounded-full flex items-center justify-center"
              >
                <Sparkles className="w-10 h-10 text-white" />
              </motion.div>

              <h2 className="text-2xl font-bold text-[#1C1C1C] mb-4">
                Creating Your Lecture...
              </h2>

              <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-gradient-to-r from-[#E63946] to-[#d32f3b] rounded-full"
                  transition={{ duration: 0.3 }}
                />
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <p className={progress >= 25 ? 'text-[#E63946] font-semibold' : ''}>
                  ✓ Generating Slides
                </p>
                <p className={progress >= 50 ? 'text-[#E63946] font-semibold' : ''}>
                  {progress >= 50 ? '✓' : '○'} Adding Voiceover
                </p>
                <p className={progress >= 75 ? 'text-[#E63946] font-semibold' : ''}>
                  {progress >= 75 ? '✓' : '○'} Creating Quiz
                </p>
                <p className={progress === 100 ? 'text-[#E63946] font-semibold' : ''}>
                  {progress === 100 ? '✓' : '○'} Done!
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {generated && (
          <motion.div
            key="output"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="grid md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg"
              >
                <div className="flex items-center gap-3 mb-4">
                  <FileText className="w-6 h-6 text-[#E63946]" />
                  <h3 className="text-xl font-bold text-[#1C1C1C]">Slides</h3>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center text-gray-400"
                    >
                      Slide {i}
                    </div>
                  ))}
                </div>
                <button className="w-full py-2 bg-[#E63946] text-white rounded-xl hover:bg-[#d32f3b] transition-all duration-300 flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" />
                  Download Slides (.PDF)
                </button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl p-6 shadow-lg"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Video className="w-6 h-6 text-[#E63946]" />
                  <h3 className="text-xl font-bold text-[#1C1C1C]">Video</h3>
                </div>
                <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg mb-4 flex items-center justify-center">
                  <Video className="w-16 h-16 text-gray-600" />
                </div>
                <button className="w-full py-2 bg-[#E63946] text-white rounded-xl hover:bg-[#d32f3b] transition-all duration-300 flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" />
                  Download Video (.MP4)
                </button>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl p-6 shadow-lg"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <FileText className="w-6 h-6 text-[#E63946]" />
                  <h3 className="text-xl font-bold text-[#1C1C1C]">Quiz</h3>
                </div>
                {quizSubmitted && (
                  <div className="text-right">
                    <p className="text-2xl font-bold text-[#E63946]">
                      {score}/{mockQuestions.length}
                    </p>
                    <p className="text-sm text-gray-600">
                      {getScoreMessage().text} {getScoreMessage().emoji}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                {mockQuestions.map((question, idx) => (
                  <div key={question.id} className="border-b border-gray-200 pb-6 last:border-0">
                    <h4 className="font-semibold text-[#1C1C1C] mb-3">
                      {idx + 1}. {question.question}
                    </h4>
                    <div className="space-y-2">
                      {question.options.map((option, optIdx) => (
                        <label
                          key={optIdx}
                          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                            quizAnswers[question.id] === optIdx
                              ? 'bg-[#E63946] bg-opacity-10 border-2 border-[#E63946]'
                              : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                          } ${
                            quizSubmitted
                              ? optIdx === question.correct
                                ? 'bg-green-100 border-green-500'
                                : quizAnswers[question.id] === optIdx
                                ? 'bg-red-100 border-red-500'
                                : ''
                              : ''
                          }`}
                        >
                          <input
                            type="radio"
                            name={`question-${question.id}`}
                            checked={quizAnswers[question.id] === optIdx}
                            onChange={() =>
                              !quizSubmitted &&
                              setQuizAnswers({ ...quizAnswers, [question.id]: optIdx })
                            }
                            disabled={quizSubmitted}
                            className="w-4 h-4 text-[#E63946]"
                          />
                          <span className="flex-1">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-4 mt-6">
                {!quizSubmitted ? (
                  <button
                    onClick={handleQuizSubmit}
                    disabled={Object.keys(quizAnswers).length !== mockQuestions.length}
                    className="flex-1 py-3 bg-[#E63946] text-white rounded-xl hover:bg-[#d32f3b] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                  >
                    Submit Quiz
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleRetakeQuiz}
                      className="flex-1 py-3 bg-gray-200 text-[#1C1C1C] rounded-xl hover:bg-gray-300 transition-all duration-300 font-semibold flex items-center justify-center gap-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Retake Quiz
                    </button>
                    <button className="flex-1 py-3 bg-[#E63946] text-white rounded-xl hover:bg-[#d32f3b] transition-all duration-300 font-semibold flex items-center justify-center gap-2">
                      <Download className="w-4 h-4" />
                      Export Quiz (.TXT)
                    </button>
                  </>
                )}
              </div>
            </motion.div>

            <button
              onClick={() => {
                setGenerated(false);
                setTopic('');
                setQuizAnswers({});
                setQuizSubmitted(false);
                setScore(0);
              }}
              className="w-full py-3 bg-gray-200 text-[#1C1C1C] rounded-xl hover:bg-gray-300 transition-all duration-300 font-semibold"
            >
              Generate New Lecture
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GenerateLecture;
