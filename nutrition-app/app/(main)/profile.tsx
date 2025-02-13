import React from 'react';
import { useUser, useAuth } from '@clerk/clerk-expo';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function ProfileScreen() {
  const { signOut } = useAuth();
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profil</Text>
      {user ? (
        <View style={styles.profileInfo}>
          <Text style={styles.email}>Email: {user.primaryEmailAddress?.emailAddress}</Text>
          <Button title="Se déconnecter" onPress={() => signOut()} />
        </View>
      ) : (
        <Text>Aucun utilisateur connecté</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  profileInfo: {
    alignItems: 'center',
  },
  email: {
    fontSize: 18,
    marginBottom: 20,
  },
});
