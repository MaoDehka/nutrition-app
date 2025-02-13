import { ClerkProvider, ClerkLoaded, useUser } from '@clerk/clerk-expo';
import { Slot, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { MealProvider } from './(main)/contexts/MealContext';

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error('Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env');
}

export default function RootLayoutNav() {
  return (
    <ClerkProvider publishableKey={publishableKey}>
      <ClerkLoaded>
        <MealProvider>
          <RootLayout />
        </MealProvider>
      </ClerkLoaded>
    </ClerkProvider>
  );
}

function RootLayout() {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace('/(auth)/login');
    }
  }, [user]);

  return <Slot />;
}
