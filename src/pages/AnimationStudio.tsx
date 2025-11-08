import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Plus, BookOpen, Grid, Video } from 'lucide-react';
import { AnimationSequence } from '../types/animations';
import { animationTemplates } from '../utils/animationTemplates';
import AnimationGallery from '../components/AnimationGallery';
import InteractiveAnimationPlayer from '../components/InteractiveAnimationPlayer';

const AnimationStudio = () => {
  const [selectedAnimation, setSelectedAnimation] = useState<AnimationSequence | null>(
    animationTemplates[0]
  );
  const [view, setView] = useState<'gallery' | 'player'>('gallery');
  const [savedAnimations, setSavedAnimations] = useState<AnimationSequence[]>(animationTemplates);

  const handleAnimationSelect = (animation: AnimationSequence) => {
    setSelectedAnimation(animation);
    setView('player');
  };

  const handleAnimationComplete = () => {
    alert('Animation completed! Great learning! 🎉');
  };

  const handleExportAnimation = () => {
    if (!selectedAnimation) return;

    const json = JSON.stringify(selectedAnimation, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedAnimation.title.replace(/\s+/g, '-').toLowerCase()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSaveAnimation = () => {
    if (selectedAnimation && !savedAnimations.find((a) => a.id === selectedAnimation.id)) {
      setSavedAnimations([...savedAnimations, selectedAnimation]);
      alert('Animation saved to your library!');
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-[#1C1C1C] mb-2">Animation Studio</h1>
        <p className="text-gray-600">Create and explore interactive educational animations</p>
      </motion.div>

      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setView('gallery')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
            view === 'gallery'
              ? 'bg-[#E63946] text-white shadow-lg'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Grid className="w-5 h-5" />
          Gallery
        </button>
        <button
          onClick={() => setView('player')}
          disabled={!selectedAnimation}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
            view === 'player' && selectedAnimation
              ? 'bg-[#E63946] text-white shadow-lg'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50'
          }`}
        >
          <Play className="w-5 h-5" />
          Player
        </button>
        <button
          onClick={() => {
            const newAnimation = JSON.parse(JSON.stringify(selectedAnimation || animationTemplates[0]));
            newAnimation.id = `custom-${Date.now()}`;
            newAnimation.title = `${newAnimation.title} (Copy)`;
            setSavedAnimations([...savedAnimations, newAnimation]);
            setSelectedAnimation(newAnimation);
          }}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-green-100 text-green-700 hover:bg-green-200 transition-all duration-300 ml-auto"
        >
          <Plus className="w-5 h-5" />
          Create
        </button>
      </div>

      <AnimatePresence mode="wait">
        {view === 'gallery' ? (
          <motion.div
            key="gallery"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <AnimationGallery
              animations={savedAnimations}
              onSelectAnimation={handleAnimationSelect}
              selectedAnimation={selectedAnimation || undefined}
            />
          </motion.div>
        ) : (
          <motion.div
            key="player"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {selectedAnimation && (
              <>
                <InteractiveAnimationPlayer
                  animation={selectedAnimation}
                  onComplete={handleAnimationComplete}
                />

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid md:grid-cols-3 gap-4"
                >
                  <div className="bg-white rounded-2xl p-6 shadow-md">
                    <h3 className="font-bold text-[#1C1C1C] mb-2">About This Animation</h3>
                    <p className="text-gray-600 text-sm mb-4">{selectedAnimation.description}</p>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="font-semibold text-gray-700">Topic:</span>{' '}
                        {selectedAnimation.topic}
                      </p>
                      <p>
                        <span className="font-semibold text-gray-700">Difficulty:</span>{' '}
                        <span className="capitalize">{selectedAnimation.difficulty || 'N/A'}</span>
                      </p>
                      <p>
                        <span className="font-semibold text-gray-700">Total Steps:</span>{' '}
                        {selectedAnimation.totalSteps}
                      </p>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-6 shadow-md">
                    <h3 className="font-bold text-[#1C1C1C] mb-4">Quick Stats</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Animations with quizzes:</span>
                        <span className="font-bold text-[#E63946]">
                          {selectedAnimation.steps.filter((s) => s.quiz).length}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Avg step duration:</span>
                        <span className="font-bold text-[#E63946]">
                          {(
                            selectedAnimation.steps.reduce((acc, s) => acc + (s.duration || 1), 0) /
                            selectedAnimation.steps.length
                          ).toFixed(1)}
                          s
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-6 shadow-md">
                    <h3 className="font-bold text-[#1C1C1C] mb-4">Actions</h3>
                    <div className="space-y-2">
                      <button
                        onClick={handleSaveAnimation}
                        className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-300 font-semibold"
                      >
                        Save to Library
                      </button>
                      <button
                        onClick={handleExportAnimation}
                        className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300 font-semibold"
                      >
                        Export JSON
                      </button>
                      <button
                        onClick={() => setView('gallery')}
                        className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-300 font-semibold"
                      >
                        Back to Gallery
                      </button>
                    </div>
                  </div>
                </motion.div>

                {/* Steps Detail */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl p-6 shadow-md"
                >
                  <h3 className="font-bold text-[#1C1C1C] mb-6">Animation Steps</h3>
                  <div className="space-y-4">
                    {selectedAnimation.steps.map((step) => (
                      <div
                        key={step.id}
                        className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-300"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold text-[#1C1C1C]">
                              Step {step.step}: {step.title}
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                            <div className="flex gap-2 mt-2 flex-wrap">
                              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                {step.animationType}
                              </span>
                              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                                {step.trigger}
                              </span>
                              {step.quiz && (
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                                  ✓ Quiz
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-500">
                              Duration: {step.duration || 1}s
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AnimationStudio;
