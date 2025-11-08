export type AnimationType =
  | 'fade-in'
  | 'slide-left'
  | 'slide-right'
  | 'slide-up'
  | 'slide-down'
  | 'scale'
  | 'rotate'
  | 'bounce'
  | 'pulse'
  | 'draw'
  | 'morph'
  | 'custom';

export type TriggerType = 'click' | 'auto' | 'hover' | 'scroll' | 'voice';

export interface AnimationElement {
  id: string;
  type: 'shape' | 'text' | 'icon' | 'image' | 'svg';
  content?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  color?: string;
  opacity?: number;
  rotation?: number;
}

export interface AnimationStep {
  id: string;
  step: number;
  title: string;
  description: string;
  narration?: string;
  animationType: AnimationType;
  trigger: TriggerType;
  duration?: number;
  delay?: number;
  elements: AnimationElement[];
  quiz?: {
    question: string;
    options: string[];
    correct: number;
  };
}

export interface AnimationSequence {
  id: string;
  title: string;
  topic: string;
  thumbnail?: string;
  description?: string;
  totalSteps: number;
  steps: AnimationStep[];
  autoPlay?: boolean;
  autoPlayDelay?: number;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  tags?: string[];
}

export interface AnimationTemplate {
  id: string;
  name: string;
  description: string;
  category: 'biology' | 'physics' | 'chemistry' | 'computer-science' | 'mathematics' | 'general';
  preview?: string;
  steps: Omit<AnimationStep, 'id'>[];
}
