
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Recipe } from '../types';
import { GEMINI_TEXT_MODEL, GEMINI_IMAGE_MODEL } from '../constants';

const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

if (!API_KEY) {
  console.error("API_KEY environment variable not found.");
  // In a real app, you might throw an error or handle this more gracefully
  // For this exercise, we'll let it proceed and fail at API call time if key is truly missing.
}

const ai = new GoogleGenAI({ apiKey: API_KEY || "MISSING_API_KEY" }); // Provide a fallback to prevent immediate crash if key is undefined

export async function generateRecipe(ingredients: string[]): Promise<Recipe> {
  if (!API_KEY) throw new Error("API Key is missing. Please set the API_KEY environment variable.");
  
  const prompt = `Generate a delicious and creative recipe using the following ingredients: ${ingredients.join(', ')}. If an ingredient seems unusual for a typical dish, try to incorporate it creatively. Provide a unique name for the dish. The response MUST be a JSON object with the exact following structure: { "recipeName": "string", "description": "string (a short, appetizing description of the dish, 2-3 sentences)", "prepTime": "string (e.g., '20 minutes')", "cookTime": "string (e.g., '30 minutes')", "servings": "string (e.g., '4 servings')", "ingredientsList": [{"item": "string (name of ingredient)", "quantity": "string (e.g., '2 cups', '100g', '1 medium')"}], "instructions": ["string (step-by-step cooking instructions, each step as a separate string in the array)"], "chefTips": ["string (optional helpful tips, each tip as a separate string in the array)"] }. Ensure all fields are present and correctly formatted. If input ingredients lack quantities, suggest reasonable ones. Do not include any text outside of this JSON object, including markdown fences.`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_TEXT_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.7, // Add some creativity
      },
    });

    let jsonStr = response.text.trim();
    // More robust regex for potential markdown fences, just in case
    const fenceRegex = /^```(?:json)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[1]) {
      jsonStr = match[1].trim();
    }
    
    try {
      const parsedData = JSON.parse(jsonStr);
      // Basic validation for the presence of key fields
      if (!parsedData.recipeName || !parsedData.ingredientsList || !parsedData.instructions) {
        console.error("Parsed JSON is missing essential recipe fields:", parsedData);
        throw new Error("AI returned an incomplete recipe structure.");
      }
      return parsedData as Recipe;
    } catch (e) {
      console.error("Failed to parse JSON response from Gemini:", jsonStr, e);
      throw new Error("The AI returned an unexpected recipe format. Please try again or adjust your ingredients.");
    }
  } catch (error) {
    console.error("Error generating recipe:", error);
    if (error instanceof Error) {
         throw new Error(`Failed to generate recipe: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating the recipe.");
  }
}

export async function generateRecipeImage(recipeName: string, ingredientsSummary: string): Promise<string> {
  if (!API_KEY) throw new Error("API Key is missing. Please set the API_KEY environment variable.");

  const prompt = `Create a highly realistic and appetizing photograph of a dish named '${recipeName}'. This dish features ingredients such as ${ingredientsSummary}. Style: culinary photography, bright lighting, high detail, food magazine quality. Focus on the texture and colors of the food. Ensure the image looks delicious and inviting.`;
  
  try {
    const response = await ai.models.generateImages({
      model: GEMINI_IMAGE_MODEL,
      prompt: prompt,
      config: { numberOfImages: 1, outputMimeType: 'image/jpeg' },
    });

    if (response.generatedImages && response.generatedImages.length > 0 && response.generatedImages[0].image.imageBytes) {
      const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
      return `data:image/jpeg;base64,${base64ImageBytes}`;
    } else {
      throw new Error("No image data received from Gemini.");
    }
  } catch (error) {
    console.error("Error generating recipe image:", error);
     if (error instanceof Error) {
         throw new Error(`Failed to generate image: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating the image.");
  }
}
    