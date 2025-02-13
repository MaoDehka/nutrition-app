import React, { createContext, useState, ReactNode } from 'react';

type Meal = {
  id: string;
  label: string;
  calories: number;
  image: string;
};

type Recipe = {
  id: string;
  ingredients: Meal[]; 
};

type MealContextType = {
  recipes: Recipe[]; 
  addRecipe: (recipe: Recipe) => void; 
  removeRecipe: (recipeId: string) => void; 
};

const MealContext = createContext<MealContextType | undefined>(undefined);

export const MealProvider = ({ children }: { children: ReactNode }) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  const addRecipe = (recipe: Recipe) => {
    setRecipes((prevRecipes) => [...prevRecipes, recipe]);
  };

  const removeRecipe = (recipeId: string) => {
    setRecipes((prevRecipes) => prevRecipes.filter((recipe) => recipe.id !== recipeId));
  };

  return (
    <MealContext.Provider value={{ recipes, addRecipe, removeRecipe }}>
      {children}
    </MealContext.Provider>
  );
};

export const useMealContext = () => {
  const context = React.useContext(MealContext);
  if (!context) {
    throw new Error('useMealContext must be used within a MealProvider');
  }
  return context;
};
