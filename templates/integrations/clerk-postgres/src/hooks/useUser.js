import { useUser as useClerkUser } from '@clerk/clerk-react';
import { useState, useEffect } from 'react';
import { userApi } from '../lib/api';

export function useUser() {
  const { user: clerkUser, isSignedIn, isLoaded } = useClerkUser();
  const [dbUser, setDbUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function syncUser() {
      if (!isLoaded) return;
      
      setIsLoading(true);
      setError(null);

      try {
        if (isSignedIn && clerkUser) {
          // Sync Clerk user with database
          const syncedUser = await userApi.upsert(clerkUser);
          setDbUser(syncedUser);
        } else {
          setDbUser(null);
        }
      } catch (err) {
        console.error('Error syncing user:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    syncUser();
  }, [clerkUser, isSignedIn, isLoaded]);

  return {
    // Clerk user data
    clerkUser,
    isSignedIn,
    isLoaded,
    
    // Database user data
    dbUser,
    
    // Combined loading states
    isLoading: !isLoaded || isLoading,
    error,
    
    // Helper methods
    refreshUser: async () => {
      if (clerkUser) {
        const syncedUser = await userApi.upsert(clerkUser);
        setDbUser(syncedUser);
        return syncedUser;
      }
    },
    
    getUserStats: async () => {
      if (clerkUser) {
        return await userApi.getStats(clerkUser.id);
      }
      return null;
    }
  };
}