import { useQuery } from "@tanstack/react-query";

export function useAccessAuth() {
  const { data: accessUser, isLoading } = useQuery({
    queryKey: ["/api/access-portal/user"],
    retry: false,
  });

  return {
    accessUser,
    isLoading,
    isAccessAuthenticated: !!accessUser,
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