import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"

export interface MoodState {
  energy: number // 0-100
  success: number // 0-100
  activity: number // 0-100
  focus: number // 0-100
}

interface AmbientGradientMoodProps {
  mood: MoodState
  className?: string
  intensity?: 'subtle' | 'medium' | 'vibrant'
  children?: React.ReactNode
}

export function AmbientGradientMood({ 
  mood, 
  className = "", 
  intensity = 'medium',
  children 
}: AmbientGradientMoodProps) {
  const [gradientColors, setGradientColors] = useState<string[]>([])
  const [animationKey, setAnimationKey] = useState(0)

  useEffect(() => {
    const colors = generateMoodGradient(mood, intensity)
    setGradientColors(colors)
    setAnimationKey(prev => prev + 1)
  }, [mood, intensity])

  const generateMoodGradient = (mood: MoodState, intensity: 'subtle' | 'medium' | 'vibrant') => {
    const { energy, success, activity, focus } = mood
    
    // Base opacity based on intensity
    const opacityMap = {
      subtle: 0.05,
      medium: 0.1,
      vibrant: 0.2
    }
    const baseOpacity = opacityMap[intensity]

    // Energy determines warmth (red/orange vs blue/purple)
    const warmth = energy / 100
    
    // Success determines brightness and green tones
    const brightness = 20 + (success / 100) * 30
    
    // Activity determines color saturation
    const saturation = 10 + (activity / 100) * 40
    
    // Focus determines gradient complexity (more focus = cleaner gradients)
    const complexity = focus > 70 ? 'simple' : focus > 40 ? 'medium' : 'complex'

    let colors: string[] = []

    if (success > 80) {
      // High success: Green-blue prosperity gradients
      colors = [
        `hsla(155, ${saturation}%, ${brightness}%, ${baseOpacity})`,
        `hsla(180, ${saturation * 0.8}%, ${brightness + 10}%, ${baseOpacity * 0.7})`,
        `hsla(200, ${saturation * 0.6}%, ${brightness + 5}%, ${baseOpacity * 0.5})`
      ]
    } else if (energy > 70) {
      // High energy: Warm, dynamic gradients
      colors = [
        `hsla(${warmth * 60}, ${saturation}%, ${brightness}%, ${baseOpacity})`,
        `hsla(${warmth * 40 + 20}, ${saturation * 0.8}%, ${brightness + 8}%, ${baseOpacity * 0.8})`,
        `hsla(${warmth * 20 + 40}, ${saturation * 0.6}%, ${brightness + 15}%, ${baseOpacity * 0.4})`
      ]
    } else if (focus > 80) {
      // High focus: Cool, calm gradients
      colors = [
        `hsla(220, ${saturation * 0.7}%, ${brightness}%, ${baseOpacity})`,
        `hsla(240, ${saturation * 0.5}%, ${brightness + 10}%, ${baseOpacity * 0.6})`,
        `hsla(260, ${saturation * 0.3}%, ${brightness + 20}%, ${baseOpacity * 0.3})`
      ]
    } else if (activity > 60) {
      // High activity: Multi-hue dynamic gradients
      colors = [
        `hsla(${(energy * 3) % 360}, ${saturation}%, ${brightness}%, ${baseOpacity})`,
        `hsla(${(energy * 3 + 120) % 360}, ${saturation * 0.7}%, ${brightness + 5}%, ${baseOpacity * 0.7})`,
        `hsla(${(energy * 3 + 240) % 360}, ${saturation * 0.5}%, ${brightness + 10}%, ${baseOpacity * 0.5})`
      ]
    } else {
      // Low activity/neutral: Subtle grays and blues
      colors = [
        `hsla(210, ${saturation * 0.3}%, ${brightness + 10}%, ${baseOpacity})`,
        `hsla(220, ${saturation * 0.2}%, ${brightness + 20}%, ${baseOpacity * 0.6})`,
        `hsla(200, ${saturation * 0.1}%, ${brightness + 30}%, ${baseOpacity * 0.3})`
      ]
    }

    // Add complexity-based additional colors
    if (complexity === 'complex') {
      colors.push(
        `hsla(${(energy * 2 + 60) % 360}, ${saturation * 0.4}%, ${brightness + 25}%, ${baseOpacity * 0.2})`
      )
    }

    return colors
  }

  const gradientStyle = gradientColors.length > 0 ? {
    background: `radial-gradient(ellipse at top left, ${gradientColors[0]} 0%, transparent 50%), 
                 radial-gradient(ellipse at top right, ${gradientColors[1]} 0%, transparent 50%), 
                 radial-gradient(ellipse at bottom left, ${gradientColors[2]} 0%, transparent 50%)${
                   gradientColors[3] ? `, radial-gradient(ellipse at bottom right, ${gradientColors[3]} 0%, transparent 50%)` : ''
                 }`
  } : {}

  return (
    <div className={`relative ${className}`}>
      <motion.div
        key={animationKey}
        className="absolute inset-0 pointer-events-none"
        style={gradientStyle}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ 
          duration: 2.5, 
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          background: [
            `radial-gradient(circle at 20% 80%, ${gradientColors[0]} 0%, transparent 50%)`,
            `radial-gradient(circle at 80% 20%, ${gradientColors[1]} 0%, transparent 50%)`,
            `radial-gradient(circle at 40% 40%, ${gradientColors[2]} 0%, transparent 50%)`
          ]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "linear"
        }}
      />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}

// Hook to calculate mood from portal data
export function useMoodFromPortalData(data: {
  brandsCount: number
  isLoading: boolean
  hasErrors: boolean
  userActivity: number
  systemStatus: string[]
}) {
  const [mood, setMood] = useState<MoodState>({
    energy: 50,
    success: 50,
    activity: 50,
    focus: 50
  })

  useEffect(() => {
    const { brandsCount, isLoading, hasErrors, userActivity, systemStatus } = data
    
    // Calculate success based on data loading and system health
    const systemHealth = systemStatus.filter(s => s.includes('online')).length / Math.max(systemStatus.length, 1)
    const success = hasErrors ? 20 : (brandsCount > 1000 ? 90 : 50 + (brandsCount / 100) * 2)
    
    // Energy based on data richness and system activity
    const energy = isLoading ? 80 : (brandsCount > 2000 ? 85 : 60 + (systemHealth * 25))
    
    // Activity based on loading states and user interaction
    const activity = isLoading ? 90 : userActivity
    
    // Focus based on system stability (fewer errors = more focus)
    const focus = hasErrors ? 30 : (systemHealth > 0.8 ? 85 : 60)

    setMood({
      energy: Math.min(100, Math.max(0, energy)),
      success: Math.min(100, Math.max(0, success)),
      activity: Math.min(100, Math.max(0, activity)),
      focus: Math.min(100, Math.max(0, focus))
    })
  }, [data])

  return mood
}

// Preset mood configurations
export const MoodPresets = {
  startup: { energy: 75, success: 60, activity: 80, focus: 70 },
  loading: { energy: 90, success: 50, activity: 95, focus: 60 },
  success: { energy: 80, success: 95, activity: 70, focus: 85 },
  error: { energy: 30, success: 10, activity: 40, focus: 30 },
  focused: { energy: 60, success: 80, activity: 30, focus: 95 },
  energetic: { energy: 95, success: 70, activity: 90, focus: 60 },
  calm: { energy: 40, success: 70, activity: 20, focus: 90 },
  neutral: { energy: 50, success: 50, activity: 50, focus: 50 }
}