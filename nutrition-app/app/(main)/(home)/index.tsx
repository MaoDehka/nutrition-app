import React from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useMealContext } from '../contexts/MealContext';

export default function Home() {
  const { recipes } = useMealContext();
  const router = useRouter();

  const handleAddRecipe = () => {
    router.push('/add'); 
  };

  const handleRecipeDetail = (recipeId: string) => {
    router.push(`/${recipeId}`);
  };

  const handleGoToProfile = () => {
    router.push('/profile');
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 10 }}>Liste des recettes</Text>

      <Button title="Ajouter une recette" onPress={handleAddRecipe} />
      <Button title="Mon Profil" onPress={handleGoToProfile} /> 

      {recipes.length === 0 ? (
        <Text>Aucune recette disponible.</Text>
      ) : (
        <FlatList
          data={recipes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleRecipeDetail(item.id)}>
              <View style={{ marginVertical: 10 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{item.id}</Text>
                <FlatList
                  data={item.ingredients}
                  keyExtractor={(ingredient) => ingredient.id}
                  renderItem={({ item: ingredient }) => (
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
                      <Image
                        source={{ uri: ingredient.image }}
                        style={{ width: 50, height: 50, marginRight: 10, borderRadius: 25 }}
                      />
                      <View>
                        <Text>{ingredient.label}</Text>
                        <Text>Calories: {ingredient.calories}</Text>
                      </View>
                    </View>
                  )}
                />
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}
