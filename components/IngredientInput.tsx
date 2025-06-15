
import React, { useState } from 'react';
import { PlusIcon, TrashIcon } from '../constants';

interface IngredientInputProps {
  ingredients: string[];
  onAddIngredient: (ingredient: string) => void;
  onRemoveIngredient: (index: number) => void;
}

const IngredientInput: React.FC<IngredientInputProps> = ({ ingredients, onAddIngredient, onRemoveIngredient }) => {
  const [currentIngredient, setCurrentIngredient] = useState<string>('');

  const handleAdd = () => {
    if (currentIngredient.trim() !== '') {
      onAddIngredient(currentIngredient.trim());
      setCurrentIngredient('');
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleAdd();
    }
  };

  return (
    <div className="mb-6">
      <label htmlFor="ingredient-input" className="block text-sm font-medium text-slate-700 mb-1">
        Add Ingredients
      </label>
      <div className="flex space-x-2 mb-4">
        <input
          id="ingredient-input"
          type="text"
          value={currentIngredient}
          onChange={(e) => setCurrentIngredient(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="e.g., Chicken breast, tomatoes, pasta"
          className="flex-grow p-3 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition duration-150"
        />
        <button
          onClick={handleAdd}
          className="bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition duration-150 ease-in-out flex items-center"
          aria-label="Add ingredient"
        >
          {PlusIcon}
          <span className="ml-2 hidden sm:inline">Add</span>
        </button>
      </div>

      {ingredients.length > 0 && (
        <div>
          <h3 className="text-md font-semibold text-slate-600 mb-2">Your Ingredients:</h3>
          <ul className="space-y-2">
            {ingredients.map((ingredient, index) => (
              <li
                key={index}
                className="flex justify-between items-center bg-slate-50 p-3 rounded-lg shadow-sm border border-slate-200"
              >
                <span className="text-slate-700">{ingredient}</span>
                <button
                  onClick={() => onRemoveIngredient(index)}
                  className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 transition duration-150"
                  aria-label={`Remove ${ingredient}`}
                >
                  {TrashIcon}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default IngredientInput;
    