import { motion } from 'framer-motion';
import { AnimationStep as IAnimationStep } from '../types/animations';

interface AnimationStepProps {
  step: IAnimationStep;
  isActive: boolean;
  isCompleted: boolean;
}

const getAnimationVariants = (animationType: string, duration: number = 1) => {
  const baseTransition = { duration, ease: 'easeInOut' };

  const variants: { [key: string]: any } = {
    'fade-in': {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: baseTransition },
    },
    'slide-left': {
      hidden: { x: 100, opacity: 0 },
      visible: { x: 0, opacity: 1, transition: baseTransition },
    },
    'slide-right': {
      hidden: { x: -100, opacity: 0 },
      visible: { x: 0, opacity: 1, transition: baseTransition },
    },
    'slide-up': {
      hidden: { y: 100, opacity: 0 },
      visible: { y: 0, opacity: 1, transition: baseTransition },
    },
    'slide-down': {
      hidden: { y: -100, opacity: 0 },
      visible: { y: 0, opacity: 1, transition: baseTransition },
    },
    scale: {
      hidden: { scale: 0, opacity: 0 },
      visible: { scale: 1, opacity: 1, transition: baseTransition },
    },
    rotate: {
      hidden: { rotate: -180, opacity: 0 },
      visible: { rotate: 0, opacity: 1, transition: baseTransition },
    },
    bounce: {
      hidden: { y: 100, opacity: 0 },
      visible: {
        y: 0,
        opacity: 1,
        transition: {
          type: 'spring',
          stiffness: 200,
          damping: 20,
          duration: baseTransition.duration,
        },
      },
    },
    pulse: {
      hidden: { opacity: 0, scale: 0.8 },
      visible: {
        opacity: 1,
        scale: 1,
        transition: {
          ...baseTransition,
          repeat: 2,
          repeatType: 'reverse',
        },
      },
    },
    draw: {
      hidden: { pathLength: 0, opacity: 0 },
      visible: { pathLength: 1, opacity: 1, transition: baseTransition },
    },
    morph: {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: baseTransition },
    },
  };

  return variants[animationType] || variants['fade-in'];
};

const AnimationStepComponent = ({ step, isActive, isCompleted }: AnimationStepProps) => {
  const variants = getAnimationVariants(step.animationType, step.duration || 1);

  return (
    <motion.div
      initial="hidden"
      animate={isActive ? 'visible' : 'hidden'}
      variants={variants}
      className="w-full h-full flex items-center justify-center relative"
    >
      <div className="w-full h-full max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
          {/* Animation Canvas */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 flex flex-col items-center justify-center min-h-96 shadow-lg relative overflow-hidden">
            {step.elements.map((element, idx) => (
              <motion.div
                key={element.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: isActive ? 1 : 0 }}
                transition={{
                  delay: (element.id === 'sun' || element.id === 'projectile' ? 0.2 : 0) + idx * 0.2,
                  duration: 0.5,
                }}
                style={{
                  position: 'absolute',
                  left: `${element.x}%`,
                  top: `${element.y}%`,
                  width: element.width ? `${element.width}px` : 'auto',
                  height: element.height ? `${element.height}px` : 'auto',
                  fontSize: element.type === 'shape' ? '3xl' : '1.25rem',
                }}
                className="flex items-center justify-center font-bold"
              >
                {element.type === 'text' || element.type === 'shape' ? (
                  <span style={{ color: element.color, textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    {element.content}
                  </span>
                ) : null}
              </motion.div>
            ))}
          </div>

          {/* Content Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-col justify-center"
          >
            <div className="space-y-4">
              <div>
                <span className="inline-block px-3 py-1 bg-[#E63946] bg-opacity-10 text-[#E63946] rounded-full text-sm font-semibold mb-3">
                  Step {step.step}
                </span>
                <h3 className="text-2xl font-bold text-[#1C1C1C] mb-2">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </div>

              {step.narration && (
                <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <p className="text-sm text-blue-900">
                    <span className="font-semibold">Narration: </span>
                    {step.narration}
                  </p>
                </div>
              )}

              {isActive && isCompleted && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-green-50 rounded-lg border border-green-200"
                >
                  <p className="text-sm text-green-700 font-semibold">✓ Step completed!</p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default AnimationStepComponent;
