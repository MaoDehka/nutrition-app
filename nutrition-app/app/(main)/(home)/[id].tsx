import React from 'react';
import { View, Text, Button, FlatList, Image, StyleSheet } from 'react-native';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { useMealContext } from '../contexts/MealContext';
import { MaterialIcons } from '@expo/vector-icons';

export default function RecipeDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { recipes, removeRecipe } = useMealContext();

  const recipe = recipes.find((recipe) => recipe.id === id);

  const handleDeleteRecipe = () => {
    if (recipe) {
      removeRecipe(recipe.id);
      router.push('/');
    }
  };

  if (!recipe) {
    return <Text>Recette non trouvée</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Détail de la recette</Text>

      <Stack.Screen
        options={{
          title: "Détail de la recette",
          headerRight: () => (
            <View style={{ flexDirection: 'row', gap: 5 }}>
              <MaterialIcons
                onPress={handleDeleteRecipe}
                name="delete"
                size={26}
                color="crimson"
              />
            </View>
          ),
        }}
      />

      <FlatList
        data={recipe.ingredients}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.mealItem}>
            <Image source={{ uri: item.image }} style={styles.mealImage} />
            <View>
              <Text>{item.label}</Text>
              <Text>Calories: {item.calories}</Text>
            </View>
          </View>
        )}
      />

      <Button title="Supprimer cette recette" onPress={handleDeleteRecipe} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  mealItem: { flexDirection: 'row', marginVertical: 10, alignItems: 'center' },
  mealImage: { width: 50, height: 50, borderRadius: 25, marginRight: 10 },
});
