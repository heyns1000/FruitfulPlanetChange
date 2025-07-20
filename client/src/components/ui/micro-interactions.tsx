import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2, Zap, Sparkles, ChevronRight } from "lucide-react";

// Floating Action Button with micro-interactions
export function FloatingActionButton({ 
  onClick, 
  icon: Icon = Zap, 
  label, 
  variant = "primary" 
}: {
  onClick: () => void;
  icon?: any;
  label: string;
  variant?: "primary" | "secondary" | "success";
}) {
  const [isPressed, setIsPressed] = useState(false);
  
  const variants = {
    primary: "bg-cyan-500 hover:bg-cyan-600",
    secondary: "bg-purple-500 hover:bg-purple-600", 
    success: "bg-green-500 hover:bg-green-600"
  };

  return (
    <motion.button
      className={`fixed bottom-6 right-6 w-14 h-14 rounded-full ${variants[variant]} text-white shadow-lg z-50 flex items-center justify-center group`}
      onClick={onClick}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      whileHover={{ scale: 1.1, boxShadow: "0 10px 25px rgba(0,0,0,0.3)" }}
      whileTap={{ scale: 0.95 }}
      animate={{
        scale: isPressed ? 0.9 : 1,
        rotate: [0, 5, -5, 0]
      }}
      transition={{ 
        rotate: { duration: 0.5, repeat: Infinity, repeatDelay: 3 },
        scale: { duration: 0.1 }
      }}
    >
      <Icon className="w-6 h-6" />
      
      {/* Tooltip */}
      <div className="absolute right-16 top-1/2 transform -translate-y-1/2 bg-black text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        {label}
        <div className="absolute left-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-l-black"></div>
      </div>
    </motion.button>
  );
}

// Animated Progress Ring
export function ProgressRing({ 
  progress, 
  size = 120, 
  strokeWidth = 8, 
  color = "#22d3ee" 
}: {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        className="transform -rotate-90"
        width={size}
        height={size}
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          animate={{
            strokeDashoffset: circumference - (progress / 100) * circumference
          }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />
      </svg>
      
      {/* Center text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.span 
          className="text-lg font-bold text-white"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
        >
          {Math.round(progress)}%
        </motion.span>
      </div>
    </div>
  );
}

// Pulse Animation for status indicators
export function PulseIndicator({ 
  active = false, 
  color = "bg-green-500", 
  size = "w-3 h-3" 
}: {
  active?: boolean;
  color?: string;
  size?: string;
}) {
  return (
    <div className={`relative ${size} rounded-full ${color} ${active ? 'animate-pulse' : ''}`}>
      {active && (
        <motion.div
          className={`absolute inset-0 rounded-full ${color} opacity-75`}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.75, 0, 0.75]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
    </div>
  );
}

// Morphing Button with state transitions
export function MorphingButton({ 
  states, 
  currentState, 
  onClick 
}: {
  states: Array<{ key: string; label: string; icon?: any; color: string }>;
  currentState: string;
  onClick: (state: string) => void;
}) {
  const current = states.find(s => s.key === currentState);
  const Icon = current?.icon;

  return (
    <motion.button
      className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 ${current?.color} text-white`}
      onClick={() => {
        const currentIndex = states.findIndex(s => s.key === currentState);
        const nextIndex = (currentIndex + 1) % states.length;
        onClick(states[nextIndex].key);
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      layout
    >
      <AnimatePresence mode="wait">
        {Icon && (
          <motion.div
            key={currentState}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Icon className="w-4 h-4" />
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.span
        key={current?.label}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -20, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {current?.label}
      </motion.span>
    </motion.button>
  );
}

// Sparkle Effect for celebrations
export function SparkleEffect({ 
  trigger, 
  children 
}: {
  trigger: boolean;
  children: React.ReactNode;
}) {
  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number }>>([]);

  useEffect(() => {
    if (trigger) {
      const newSparkles = Array.from({ length: 6 }, (_, i) => ({
        id: Date.now() + i,
        x: Math.random() * 200 - 100,
        y: Math.random() * 200 - 100
      }));
      setSparkles(newSparkles);
      
      const timer = setTimeout(() => setSparkles([]), 1000);
      return () => clearTimeout(timer);
    }
  }, [trigger]);

  return (
    <div className="relative">
      {children}
      <AnimatePresence>
        {sparkles.map((sparkle) => (
          <motion.div
            key={sparkle.id}
            className="absolute pointer-events-none"
            style={{
              left: '50%',
              top: '50%'
            }}
            initial={{
              x: 0,
              y: 0,
              scale: 0,
              opacity: 1
            }}
            animate={{
              x: sparkle.x,
              y: sparkle.y,
              scale: [0, 1, 0],
              opacity: [1, 1, 0]
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.8,
              ease: "easeOut"
            }}
          >
            <Sparkles className="w-4 h-4 text-yellow-400" />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// Typing Animation for text
export function TypingAnimation({ 
  text, 
  speed = 50 
}: {
  text: string;
  speed?: number;
}) {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, text, speed]);

  return (
    <span>
      {displayText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity }}
        className="inline-block"
      >
        |
      </motion.span>
    </span>
  );
}

// Loading Skeleton with shimmer effect
export function LoadingSkeleton({ 
  className = "", 
  lines = 1 
}: {
  className?: string;
  lines?: number;
}) {
  return (
    <div className={`animate-pulse ${className}`}>
      {Array.from({ length: lines }, (_, i) => (
        <motion.div
          key={i}
          className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-2 last:mb-0 relative overflow-hidden"
          style={{ width: `${85 + Math.random() * 15}%` }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{
              x: ['-100%', '100%']
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </motion.div>
      ))}
    </div>
  );
}

// Interactive Card with hover effects
export function InteractiveCard({ 
  children, 
  onClick, 
  className = "" 
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <motion.div
      className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 cursor-pointer ${className}`}
      onClick={onClick}
      whileHover={{ 
        scale: 1.02, 
        boxShadow: "0 10px 25px rgba(0,0,0,0.15)" 
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
}

// Success Checkmark Animation
export function SuccessCheckmark({ 
  show, 
  size = 24 
}: {
  show: boolean;
  size?: number;
}) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          transition={{ type: "spring", duration: 0.6 }}
          className="flex items-center justify-center"
        >
          <motion.div
            className="bg-green-500 rounded-full flex items-center justify-center text-white"
            style={{ width: size, height: size }}
            initial={{ rotate: -180 }}
            animate={{ rotate: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <Check className="w-1/2 h-1/2" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Ripple Effect for buttons
export function RippleEffect({ 
  children, 
  onClick 
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);

  const handleClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newRipple = { id: Date.now(), x, y };
    setRipples(prev => [...prev, newRipple]);
    
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 600);
    
    onClick?.();
  };

  return (
    <div 
      className="relative overflow-hidden cursor-pointer"
      onClick={handleClick}
    >
      {children}
      <AnimatePresence>
        {ripples.map(ripple => (
          <motion.div
            key={ripple.id}
            className="absolute pointer-events-none"
            style={{
              left: ripple.x,
              top: ripple.y
            }}
            initial={{
              scale: 0,
              opacity: 0.6
            }}
            animate={{
              scale: 4,
              opacity: 0
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-4 h-4 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2" />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}