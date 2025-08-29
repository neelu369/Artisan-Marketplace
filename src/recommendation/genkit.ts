import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

// Configure Genkit with Gemini 1.5 Pro for better reasoning capabilities
export const recommendationAI = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-1.5-pro', // Using Pro for better recommendation reasoning
});

// Alternative configuration for faster responses (if needed)
export const fastRecommendationAI = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-1.5-flash', // Faster but less sophisticated
});
