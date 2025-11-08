import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, BookOpen, Tag } from 'lucide-react';
import { AnimationSequence } from '../types/animations';

interface AnimationGalleryProps {
  animations: AnimationSequence[];
  onSelectAnimation: (animation: AnimationSequence) => void;
  selectedAnimation?: AnimationSequence;
}

const AnimationGallery = ({
  animations,
  onSelectAnimation,
  selectedAnimation,
}: AnimationGalleryProps) => {
  const [filter, setFilter] = useState<string>('All');

  const allCategories = ['All', ...new Set(animations.flatMap((a) => a.tags || []))];

  const filteredAnimations = animations.filter((animation) => {
    if (filter === 'All') return true;
    return animation.tags?.includes(filter);
  });

  const difficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-700';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-700';
      case 'advanced':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="w-full">
      {/* Filter Tags */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap gap-2 mb-8"
      >
        {allCategories.map((category) => (
          <button
            key={category}
            onClick={() => setFilter(category)}
            className={`px-4 py-2 rounded-full font-semibold transition-all duration-300 ${
              filter === category
                ? 'bg-[#E63946] text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </motion.div>

      {/* Animation Cards Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredAnimations.map((animation) => (
          <motion.div
            key={animation.id}
            variants={itemVariants}
            whileHover={{ scale: 1.03, y: -5 }}
            onClick={() => onSelectAnimation(animation)}
            className={`rounded-2xl overflow-hidden shadow-lg cursor-pointer transition-all duration-300 ${
              selectedAnimation?.id === animation.id
                ? 'ring-4 ring-[#E63946] shadow-2xl'
                : 'hover:shadow-xl'
            }`}
          >
            {/* Thumbnail */}
            <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden group">
              {animation.thumbnail ? (
                <img
                  src={animation.thumbnail}
                  alt={animation.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">{animation.totalSteps} Steps</p>
                  </div>
                </div>
              )}

              {/* Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                <motion.div
                  initial={{ scale: 0 }}
                  whileHover={{ scale: 1 }}
                  className="bg-[#E63946] text-white rounded-full p-3 shadow-lg"
                >
                  <Play className="w-6 h-6 fill-current" />
                </motion.div>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 bg-white">
              <h3 className="font-bold text-[#1C1C1C] mb-2 line-clamp-2">{animation.title}</h3>

              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{animation.description}</p>

              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <BookOpen className="w-3 h-3" />
                  {animation.totalSteps} steps
                </div>

                {animation.difficulty && (
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${difficultyColor(
                      animation.difficulty
                    )}`}
                  >
                    {animation.difficulty}
                  </span>
                )}
              </div>

              {/* Tags */}
              {animation.tags && animation.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-gray-200">
                  {animation.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded"
                    >
                      <Tag className="w-3 h-3" />
                      {tag}
                    </span>
                  ))}
                  {animation.tags.length > 2 && (
                    <span className="text-xs text-gray-500 px-2 py-1">
                      +{animation.tags.length - 2} more
                    </span>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {filteredAnimations.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 font-semibold">No animations found</p>
          <p className="text-gray-500 text-sm">Try a different filter</p>
        </motion.div>
      )}
    </div>
  );
};

export default AnimationGallery;
