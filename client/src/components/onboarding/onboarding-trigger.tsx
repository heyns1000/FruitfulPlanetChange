import React from 'react';
import { Button } from '@/components/ui/button';
import { HelpCircle, RotateCcw } from 'lucide-react';
import { useOnboarding } from './onboarding-provider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function OnboardingTrigger() {
  const { startTour, resetOnboarding, isOnboardingComplete } = useOnboarding();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <HelpCircle className="w-4 h-4" />
          Help
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={startTour}>
          <HelpCircle className="w-4 h-4 mr-2" />
          Take Tour
        </DropdownMenuItem>
        {isOnboardingComplete && (
          <DropdownMenuItem onClick={resetOnboarding}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset Onboarding
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}