import { ClerkLoaded, SignedIn, SignedOut } from '@clerk/clerk-expo';
import { Slot, Redirect } from 'expo-router';

export default function AddLayout() {
  return (
    <ClerkLoaded>
      <SignedIn>
        <Slot />
      </SignedIn>
      <SignedOut>
        <Redirect href="/(auth)/login" />
      </SignedOut>
    </ClerkLoaded>
  );
}
