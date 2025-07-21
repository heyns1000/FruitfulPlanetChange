import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export interface TourStep {
  id: string;
  target: string;
  title: string;
  content: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  spotlight?: boolean;
  action?: () => void;
}

interface OnboardingTourProps {
  steps: TourStep[];
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  userName?: string;
}

export function OnboardingTour({ 
  steps, 
  isOpen, 
  onClose, 
  onComplete, 
  userName = "there" 
}: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      updateTooltipPosition();
      window.addEventListener('resize', updateTooltipPosition);
      window.addEventListener('scroll', updateTooltipPosition);
      
      return () => {
        window.removeEventListener('resize', updateTooltipPosition);
        window.removeEventListener('scroll', updateTooltipPosition);
      };
    } else {
      setIsVisible(false);
      setCurrentStep(0);
    }
  }, [isOpen, currentStep]);

  const updateTooltipPosition = () => {
    if (!isOpen || !steps[currentStep]) return;
    
    const targetElement = document.querySelector(steps[currentStep].target);
    if (!targetElement) return;

    const rect = targetElement.getBoundingClientRect();
    const step = steps[currentStep];
    
    let x = 0;
    let y = 0;
    
    switch (step.position) {
      case 'top':
        x = rect.left + rect.width / 2;
        y = rect.top - 20;
        break;
      case 'bottom':
        x = rect.left + rect.width / 2;
        y = rect.bottom + 20;
        break;
      case 'left':
        x = rect.left - 20;
        y = rect.top + rect.height / 2;
        break;
      case 'right':
        x = rect.right + 20;
        y = rect.top + rect.height / 2;
        break;
    }
    
    setTooltipPosition({ x, y });
  };

  const nextStep = () => {
    if (steps[currentStep]?.action) {
      steps[currentStep].action!();
    }
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeTour();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeTour = () => {
    setIsVisible(false);
    setTimeout(() => {
      onComplete();
      onClose();
    }, 300);
  };

  const skipTour = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const getSpotlightStyle = () => {
    if (!steps[currentStep]?.spotlight) return {};
    
    const targetElement = document.querySelector(steps[currentStep].target);
    if (!targetElement) return {};
    
    const rect = targetElement.getBoundingClientRect();
    const padding = 10;
    
    return {
      clipPath: `polygon(0% 0%, 0% 100%, ${rect.left - padding}px 100%, ${rect.left - padding}px ${rect.top - padding}px, ${rect.right + padding}px ${rect.top - padding}px, ${rect.right + padding}px ${rect.bottom + padding}px, ${rect.left - padding}px ${rect.bottom + padding}px, ${rect.left - padding}px 100%, 100% 100%, 100% 0%)`,
    };
  };

  if (!isOpen || !steps.length) return null;

  const step = steps[currentStep];
  if (!step) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            ref={overlayRef}
            className="fixed inset-0 bg-black/60 z-[100]"
            style={getSpotlightStyle()}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />

          {/* Welcome Message (First Step) */}
          {currentStep === 0 && (
            <motion.div
              className="fixed inset-0 flex items-center justify-center z-[101]"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="max-w-md mx-4 p-6 bg-white dark:bg-gray-800 shadow-2xl">
                <div className="text-center">
                  <div className="mb-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
                      <CheckCircle className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Welcome, {userName}!</h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Let's take a quick tour of your Fruitful portal to help you get started.
                    This will only take a minute!
                  </p>
                  <div className="flex gap-3 justify-center">
                    <Button variant="outline" onClick={skipTour}>
                      Skip Tour
                    </Button>
                    <Button onClick={nextStep} className="bg-gradient-to-r from-blue-500 to-purple-600">
                      Start Tour
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Tooltip for Steps */}
          {currentStep > 0 && (
            <motion.div
              className="fixed z-[101] pointer-events-none"
              style={{
                left: tooltipPosition.x,
                top: tooltipPosition.y,
                transform: step.position === 'top' || step.position === 'bottom' 
                  ? 'translateX(-50%)' 
                  : step.position === 'left' 
                    ? 'translateX(-100%) translateY(-50%)' 
                    : 'translateY(-50%)'
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="max-w-sm p-4 bg-white dark:bg-gray-800 shadow-2xl pointer-events-auto">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-500 text-white text-xs font-semibold rounded-full">
                      {currentStep}
                    </span>
                    <h3 className="font-semibold text-sm">{step.title}</h3>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={skipTour}
                    className="h-6 w-6 p-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  {step.content}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {steps.slice(1).map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index + 1 <= currentStep 
                            ? 'bg-blue-500' 
                            : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    {currentStep > 1 && (
                      <Button variant="outline" size="sm" onClick={prevStep}>
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        Back
                      </Button>
                    )}
                    <Button size="sm" onClick={nextStep}>
                      {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
                      {currentStep === steps.length - 1 ? (
                        <CheckCircle className="w-4 h-4 ml-1" />
                      ) : (
                        <ArrowRight className="w-4 h-4 ml-1" />
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
              
              {/* Tooltip Arrow */}
              <div
                className={`absolute w-3 h-3 bg-white dark:bg-gray-800 transform rotate-45 ${
                  step.position === 'top' 
                    ? 'top-full left-1/2 -translate-x-1/2 -translate-y-1/2' 
                    : step.position === 'bottom'
                    ? 'bottom-full left-1/2 -translate-x-1/2 translate-y-1/2'
                    : step.position === 'left'
                    ? 'left-full top-1/2 -translate-x-1/2 -translate-y-1/2'
                    : 'right-full top-1/2 translate-x-1/2 -translate-y-1/2'
                }`}
              />
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  );
}