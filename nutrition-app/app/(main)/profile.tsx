import React from 'react';
import { useUser, useAuth } from '@clerk/clerk-expo';
import { View, Text, Button } from 'react-native';

export default function ProfileScreen() {
  const { signOut } = useAuth();
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return <Text>Loading...</Text>;
  }

  return (
    <View>
      <Text>Profil</Text>
      {user && <Text>Email: {user.primaryEmailAddress?.emailAddress}</Text>}
      <Button title="Se déconnecter" onPress={() => signOut()} />
    </View>
  );
}
