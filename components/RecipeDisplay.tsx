
import React from 'react';
import { Recipe } from '../types';

interface RecipeDisplayProps {
  recipe: Recipe;
  imageUrl: string | null;
}

const RecipeDisplay: React.FC<RecipeDisplayProps> = ({ recipe, imageUrl }) => {
  return (
    <div className="mt-8 p-6 bg-white shadow-xl rounded-lg animate-fadeIn">
      <h2 className="text-3xl font-bold text-sky-700 mb-4 text-center">{recipe.recipeName}</h2>
      
      {imageUrl && (
        <img 
          src={imageUrl} 
          alt={recipe.recipeName} 
          className="w-full h-72 sm:h-96 object-cover rounded-lg shadow-lg mb-6 border-4 border-white" 
        />
      )}

      <p className="text-slate-600 mb-6 text-center italic">{recipe.description}</p>

      <div className="grid md:grid-cols-3 gap-4 mb-6 text-center">
        <div className="bg-sky-50 p-4 rounded-lg shadow">
          <h4 className="font-semibold text-sky-600">Prep Time</h4>
          <p className="text-slate-700">{recipe.prepTime}</p>
        </div>
        <div className="bg-sky-50 p-4 rounded-lg shadow">
          <h4 className="font-semibold text-sky-600">Cook Time</h4>
          <p className="text-slate-700">{recipe.cookTime}</p>
        </div>
        <div className="bg-sky-50 p-4 rounded-lg shadow">
          <h4 className="font-semibold text-sky-600">Servings</h4>
          <p className="text-slate-700">{recipe.servings}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-6">
        <div>
          <h3 className="text-xl font-semibold text-sky-600 mb-3 border-b-2 border-sky-200 pb-1">Ingredients</h3>
          <ul className="list-disc list-inside space-y-1 text-slate-700">
            {recipe.ingredientsList.map((ing, index) => (
              <li key={index}>
                <span className="font-medium">{ing.quantity}</span> {ing.item}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-sky-600 mb-3 border-b-2 border-sky-200 pb-1">Instructions</h3>
          <ol className="list-decimal list-inside space-y-2 text-slate-700">
            {recipe.instructions.map((step, index) => (
              <li key={index} className="leading-relaxed">{step}</li>
            ))}
          </ol>
        </div>
      </div>

      {recipe.chefTips && recipe.chefTips.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-sky-600 mb-3 border-b-2 border-sky-200 pb-1">Chef's Tips</h3>
          <ul className="list-disc list-inside space-y-1 text-slate-700 bg-amber-50 p-4 rounded-lg shadow">
            {recipe.chefTips.map((tip, index) => (
              <li key={index} className="leading-relaxed">{tip}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default RecipeDisplay;

// Simple fadeIn animation for Tailwind (add to tailwind.config.js if using one, or just here for CDN)
// We cannot modify tailwind.config.js here, so this animation will be applied via style if needed.
// For now, relying on component mounting for perceived animation.
// A class like `animate-fadeIn` would need to be defined in global CSS or via Tailwind config.
// Since we cannot add CSS files, we'll skip explicit animation class and rely on natural rendering.
// Let's remove `animate-fadeIn` if it's not defined by default Tailwind or CDN.
// Tailwind CDN does not include custom animations by default.
// Let's ensure the component just appears.
    