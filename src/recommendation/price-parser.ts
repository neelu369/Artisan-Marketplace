// Utility to extract price range from natural language queries like "under 6000 rupees"
export function extractPriceRange(query: string): { min?: number; max?: number } | null {
  // Regex to match phrases like "under 6000 rupees", "below ₹6000", "less than 6000 INR", etc.
  const regex = /(under|below|less than)\s*(₹|INR|rupees|rs\.?|ruppees)?\s*(\d{1,9})/i;
  const match = query.match(regex);
  if (match) {
    const max = parseInt(match[3], 10);
    return { min: 0, max };
  }
  // Regex for "between X and Y"
  const betweenRegex = /(between)\s*(₹|INR|rupees|rs\.?|ruppees)?\s*(\d{1,9})\s*(and|to)\s*(₹|INR|rupees|rs\.?|ruppees)?\s*(\d{1,9})/i;
  const betweenMatch = query.match(betweenRegex);
  if (betweenMatch) {
    const min = parseInt(betweenMatch[3], 10);
    const max = parseInt(betweenMatch[7], 10);
    return { min, max };
  }
  // Regex for "above X", "over X"
  const aboveRegex = /(above|over|more than)\s*(₹|INR|rupees|rs\.?|ruppees)?\s*(\d{1,9})/i;
  const aboveMatch = query.match(aboveRegex);
  if (aboveMatch) {
    const min = parseInt(aboveMatch[3], 10);
    return { min, max: undefined };
  }
  return null;
}
