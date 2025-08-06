import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export function useAccessAuth() {
  const queryClient = useQueryClient();
  const { data: accessUser, isLoading } = useQuery({
    queryKey: ["/api/access-portal/user"],
    retry: false,
  });

  const register = async (type: string, formData: any) => {
    try {
      const response = await fetch('/api/access-portal/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, formData }),
      });

      const result = await response.json();
      
      if (response.ok) {
        return { success: true, ...result };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  };

  const login = async (type: string, email: string, password?: string) => {
    try {
      const response = await fetch('/api/access-portal/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, email, password }),
      });

      const result = await response.json();
      
      if (response.ok) {
        // Invalidate and refetch user data
        queryClient.invalidateQueries({ queryKey: ["/api/access-portal/user"] });
        return { success: true, ...result };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  };

  return {
    accessUser,
    isLoading,
    isAccessAuthenticated: !!accessUser,
    register,
    login,
  };
}

export async function loginToAccessPortal(type: string, email: string, password?: string) {
  const response = await fetch('/api/access-portal/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, email, password })
  });
  
  if (!response.ok) {
    throw new Error('Login failed');
  }
  
  return await response.json();
}

export async function logoutFromAccessPortal() {
  const response = await fetch('/api/access-portal/logout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
  
  if (!response.ok) {
    throw new Error('Logout failed');
  }
  
  return await response.json();
}