
export interface RecipeIngredient {
  item: string;
  quantity: string;
}

export interface Recipe {
  recipeName: string;
  description: string;
  prepTime: string;
  cookTime: string;
  servings: string;
  ingredientsList: RecipeIngredient[];
  instructions: string[];
  chefTips?: string[];
}
    