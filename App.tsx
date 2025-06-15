
import React, { useState, useCallback } from 'react';
import IngredientInput from './components/IngredientInput';
import RecipeDisplay from './components/RecipeDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorDisplay from './components/ErrorDisplay';
import { generateRecipe, generateRecipeImage } from './services/geminiService';
import { Recipe } from './types';

const App: React.FC = () => {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [generatedRecipe, setGeneratedRecipe] = useState<Recipe | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddIngredient = useCallback((ingredient: string) => {
    setIngredients(prev => [...prev, ingredient]);
  }, []);

  const handleRemoveIngredient = useCallback((index: number) => {
    setIngredients(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleSubmit = async () => {
    if (ingredients.length === 0) {
      setError("Please add at least one ingredient.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedRecipe(null);
    setGeneratedImageUrl(null);

    try {
      const recipe = await generateRecipe(ingredients);
      setGeneratedRecipe(recipe);

      // Create a summary of ingredients for the image prompt
      const imagePromptIngredients = ingredients.slice(0, 5).join(', '); // Use top 5 ingredients for brevity
      if (recipe && recipe.recipeName) {
        const imageUrl = await generateRecipeImage(recipe.recipeName, imagePromptIngredients);
        setGeneratedImageUrl(imageUrl);
      } else {
         // This case should ideally not happen if recipe generation is successful and returns valid structure
         console.warn("Recipe name was missing, cannot generate image.");
      }

    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-indigo-50 to-purple-100 text-slate-800 font-sans p-4 sm:p-8 flex flex-col items-center">
      <header className="text-center mb-10 mt-4 sm:mt-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-500 via-indigo-600 to-purple-700">
          AI Recipe Genius
        </h1>
        <p className="text-slate-600 mt-3 text-lg">Turn your pantry staples into culinary delights!</p>
      </header>

      <main className="w-full max-w-2xl bg-white shadow-2xl rounded-xl p-6 sm:p-10 ">
        <div className="mb-8">
          <IngredientInput
            ingredients={ingredients}
            onAddIngredient={handleAddIngredient}
            onRemoveIngredient={handleRemoveIngredient}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={isLoading || ingredients.length === 0}
          className="w-full bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isLoading ? 'Crafting Your Recipe...' : '✨ Generate Recipe ✨'}
        </button>

        {isLoading && <LoadingSpinner />}
        {error && <ErrorDisplay message={error} />}
        
        {generatedRecipe && (
          <RecipeDisplay recipe={generatedRecipe} imageUrl={generatedImageUrl} />
        )}
      </main>
      
      <footer className="text-center mt-12 mb-6 text-slate-500 text-sm">
        <p>Powered by Gemini API. Images and recipes are AI-generated.</p>
        <p>&copy; {new Date().getFullYear()} AI Recipe Genius. All rights reserved (not really).</p>
      </footer>
    </div>
  );
};

export default App;
    