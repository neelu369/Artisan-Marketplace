// Types
export type * from './types';

// Services
export { RecommendationService } from './service';
export { RecommendationAPIClient } from './api-client';

// Components
export { RecommendationSearch } from './components/recommendation-search';

// Flows
export { personalizedRecommendationFlow } from './flows/personalized-recommendation';

// AI Configuration
export { recommendationAI, fastRecommendationAI } from './genkit';
