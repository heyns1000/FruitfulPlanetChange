import React, { createContext, useContext, useState, useEffect } from 'react';
import { OnboardingTour, TourStep } from './onboarding-tour';
import { useAuth } from '@/hooks/useAuth';

interface OnboardingContextType {
  startTour: () => void;
  skipTour: () => void;
  isOnboardingComplete: boolean;
  resetOnboarding: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | null>(null);

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within OnboardingProvider');
  }
  return context;
}

const tourSteps: TourStep[] = [
  {
    id: 'welcome',
    target: 'body',
    title: 'Welcome',
    content: 'Welcome to your Fruitful portal!',
    position: 'bottom'
  },
  {
    id: 'dashboard-stats',
    target: '[data-tour="dashboard-stats"]',
    title: 'Dashboard Overview',
    content: 'Here you can see your key metrics including total brands, sectors, and system status at a glance.',
    position: 'bottom',
    spotlight: true
  },
  {
    id: 'sectors-grid',
    target: '[data-tour="sectors-grid"]',
    title: 'Sector Navigation',
    content: 'Browse through different business sectors. Each card shows brand counts and leads to detailed dashboards.',
    position: 'top',
    spotlight: true
  },
  {
    id: 'sector-card',
    target: '[data-tour="sector-card"]:first-child',
    title: 'Sector Cards',
    content: 'Click any sector card to access its dedicated dashboard with analytics, legal hub, and management tools.',
    position: 'right',
    spotlight: true,
    action: () => {
      // Highlight the first sector card
      const firstCard = document.querySelector('[data-tour="sector-card"]');
      if (firstCard) {
        firstCard.classList.add('ring-4', 'ring-blue-500', 'ring-opacity-75');
        setTimeout(() => {
          firstCard.classList.remove('ring-4', 'ring-blue-500', 'ring-opacity-75');
        }, 2000);
      }
    }
  },
  {
    id: 'recent-activity',
    target: '[data-tour="recent-activity"]',
    title: 'Recent Activity',
    content: 'Track your latest actions and system updates in real-time.',
    position: 'left',
    spotlight: true
  },
  {
    id: 'system-status',
    target: '[data-tour="system-status"]',
    title: 'System Status',
    content: 'Monitor the health of all integrated services including VaultMesh™, Smart Toys, and API connections.',
    position: 'left',
    spotlight: true
  },
  {
    id: 'user-menu',
    target: '[data-tour="user-menu"]',
    title: 'User Menu',
    content: 'Access your profile, settings, and logout options here.',
    position: 'bottom',
    spotlight: true
  },
  {
    id: 'complete',
    target: 'body',
    title: 'Tour Complete!',
    content: 'You\'re all set! Start exploring your portal and managing your business ecosystem.',
    position: 'bottom'
  }
];

interface OnboardingProviderProps {
  children: React.ReactNode;
}

export function OnboardingProvider({ children }: OnboardingProviderProps) {
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    // Check if user has completed onboarding
    const userId = (user as any)?.id || 'anonymous';
    const completed = localStorage.getItem(`onboarding-complete-${userId}`);
    setIsOnboardingComplete(!!completed);

    // Auto-start tour for new users
    if (isAuthenticated && user && !completed) {
      const timer = setTimeout(() => {
        setIsTourOpen(true);
      }, 1500); // Delay to let the page load

      return () => clearTimeout(timer);
    }
  }, [user, isAuthenticated]);

  const startTour = () => {
    setIsTourOpen(true);
  };

  const skipTour = () => {
    setIsTourOpen(false);
  };

  const completeTour = () => {
    const userId = (user as any)?.id || 'anonymous';
    localStorage.setItem(`onboarding-complete-${userId}`, 'true');
    setIsOnboardingComplete(true);
    setIsTourOpen(false);
  };

  const resetOnboarding = () => {
    const userId = (user as any)?.id || 'anonymous';
    localStorage.removeItem(`onboarding-complete-${userId}`);
    setIsOnboardingComplete(false);
  };

  const getUserName = () => {
    const userData = user as any;
    if (userData?.firstName) {
      return userData.firstName;
    }
    if (userData?.email) {
      return userData.email.split('@')[0];
    }
    return 'there';
  };

  return (
    <OnboardingContext.Provider
      value={{
        startTour,
        skipTour,
        isOnboardingComplete,
        resetOnboarding,
      }}
    >
      {children}
      <OnboardingTour
        steps={tourSteps}
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
        onComplete={completeTour}
        userName={getUserName()}
      />
    </OnboardingContext.Provider>
  );
}