import React, { useState, useEffect } from 'react'; 
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useMealContext } from '../contexts/MealContext';

const API_ID = process.env.EXPO_PUBLIC_EDAMAM_APP_ID;
const API_KEY = process.env.EXPO_PUBLIC_EDAMAM_API_KEY;

export default function AddMeal() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [meals, setMeals] = useState<any[]>([]);
  const [selectedMeals, setSelectedMeals] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState<boolean>(true);
  const router = useRouter();
  const { addRecipe } = useMealContext();

  const { product } = useLocalSearchParams<{ product: string }>();

  useEffect(() => {
    if (product) {
      searchProductByBarcode(product); 
    }
  }, [product]);

  const searchMeals = async () => {
    if (!searchQuery) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.edamam.com/api/food-database/v2/parser?app_id=${API_ID}&app_key=${API_KEY}&ingr=${searchQuery}`
      );
      const data = await response.json();

      if (data && data.hints && Array.isArray(data.hints)) {
        const fetchedMeals = data.hints.map((meal: any, index: number) => ({
          id: `${meal.food.foodId}-${index}`,
          label: meal.food.label,
          calories: meal.food.nutrients.ENERC_KCAL,
          image: meal.food.image || 'https://via.placeholder.com/50',
        }));
        setMeals(fetchedMeals);
        setShowResults(true);
      } else {
        setError('Aucun aliment trouvé');
        setMeals([]);
      }
    } catch (error) {
      console.error('Erreur de récupération des aliments:', error);
      setError('Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const searchProductByBarcode = async (barcode: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.edamam.com/api/food-database/v2/parser?app_id=${API_ID}&app_key=${API_KEY}&ingr=${barcode}`
      );
      const data = await response.json();

      if (data && data.hints && Array.isArray(data.hints)) {
        const fetchedMeals = data.hints.map((meal: any, index: number) => ({
          id: `${meal.food.foodId}-${index}`,
          label: meal.food.label,
          calories: meal.food.nutrients.ENERC_KCAL,
          image: meal.food.image || 'https://via.placeholder.com/50',
        }));
        setMeals(fetchedMeals);
        setShowResults(true);
      } else {
        setError('Aucun aliment trouvé pour ce code-barres');
        setMeals([]);
      }
    } catch (error) {
      console.error('Erreur de récupération des aliments par code-barres:', error);
      setError('Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const addMealToSelected = (meal: any) => {
    setSelectedMeals([...selectedMeals, meal]);
    setShowResults(false);
  };

  const handleSaveMeals = () => {
    if (selectedMeals.length > 0) {
      const newRecipe = {
        id: `recipe-${Date.now()}`,
        ingredients: selectedMeals,
      };
      addRecipe(newRecipe);
      setSelectedMeals([]);
      router.push('/'); 
    }
  };

  const navigateToCamera = () => {
    router.push('/add/camera');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Créer une recette</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Rechercher un aliment"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <Button title="Rechercher" onPress={searchMeals} />

      {loading && <Text>Chargement...</Text>}
      {error && <Text style={styles.errorText}>{error}</Text>}

      {showResults && meals.length > 0 && (
        <FlatList
          data={meals}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => addMealToSelected(item)}>
              <View style={styles.mealItem}>
                <Image source={{ uri: item.image }} style={styles.mealImage} />
                <View>
                  <Text>{item.label}</Text>
                  <Text>Calories: {item.calories}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}

      {selectedMeals.length > 0 && (
        <View>
          <Text style={styles.subtitle}>Ingrédients sélectionnés :</Text>
          <FlatList
            data={selectedMeals}
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
        </View>
      )}

      <Button title="Scanner un Code-Barres" onPress={navigateToCamera} />
      <Button title="Sauvegarder la recette" onPress={handleSaveMeals} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  searchInput: { height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, paddingLeft: 8 },
  mealItem: { flexDirection: 'row', marginVertical: 10, alignItems: 'center' },
  mealImage: { width: 50, height: 50, borderRadius: 25, marginRight: 10 },
  errorText: { color: 'red' },
  subtitle: { fontSize: 18, fontWeight: 'bold', marginTop: 20 },
});
