// Local Storage key for search history
const SEARCH_HISTORY_KEY = 'recipe_search_history'

// Maximum number of search results to keep in history
const MAX_HISTORY_ITEMS = 20

/**
 * Get search history from local storage
 * @returns {Array} Array of search history items
 */
export const getSearchHistory = () => {
  try {
    const history = localStorage.getItem(SEARCH_HISTORY_KEY)
    return history ? JSON.parse(history) : []
  } catch (error) {
    console.error('Error reading search history from localStorage:', error)
    return []
  }
}

/**
 * Save search results to local storage
 * @param {Array} ingredients - Array of ingredients used in search
 * @param {Array} recipes - Array of recipe results
 */
export const saveSearchToHistory = (ingredients, recipes) => {
  try {
    if (!ingredients || ingredients.length === 0 || !recipes || recipes.length === 0) {
      return
    }

    const searchEntry = {
      id: Date.now(), // Unique ID based on timestamp
      timestamp: new Date().toISOString(),
      ingredients: [...ingredients],
      recipes: recipes.map(recipe => ({
        id: recipe.id || Date.now() + Math.random(),
        title: recipe.title || recipe.name || 'Untitled Recipe',
        image: recipe.image || recipe.recipePicture || '',
        description: recipe.description || '',
        ingredients: recipe.ingredients || [],
        instructions: recipe.instructions || []
      })),
      searchQuery: ingredients.join(', ')
    }

    const currentHistory = getSearchHistory()
    
    // Remove any existing search with the same ingredients to avoid duplicates
    const filteredHistory = currentHistory.filter(item => 
      JSON.stringify(item.ingredients.sort()) !== JSON.stringify(ingredients.sort())
    )
    
    // Add new search to the beginning of the array
    const updatedHistory = [searchEntry, ...filteredHistory]
    
    // Keep only the most recent MAX_HISTORY_ITEMS
    const trimmedHistory = updatedHistory.slice(0, MAX_HISTORY_ITEMS)
    
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(trimmedHistory))
  } catch (error) {
    console.error('Error saving search history to localStorage:', error)
  }
}

/**
 * Clear all search history
 */
export const clearSearchHistory = () => {
  try {
    localStorage.removeItem(SEARCH_HISTORY_KEY)
  } catch (error) {
    console.error('Error clearing search history:', error)
  }
}

/**
 * Remove a specific search from history
 * @param {number} searchId - ID of the search to remove
 */
export const removeSearchFromHistory = (searchId) => {
  try {
    const currentHistory = getSearchHistory()
    const filteredHistory = currentHistory.filter(item => item.id !== searchId)
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(filteredHistory))
  } catch (error) {
    console.error('Error removing search from history:', error)
  }
}

/**
 * Get all unique recipes from search history (for displaying recent recipes)
 * @param {number} limit - Maximum number of recipes to return
 * @returns {Array} Array of unique recipes
 */
export const getRecentRecipesFromHistory = (limit = 10) => {
  try {
    const history = getSearchHistory()
    const allRecipes = []
    const seenRecipeIds = new Set()
    
    // Collect all recipes from history, avoiding duplicates
    for (const searchEntry of history) {
      for (const recipe of searchEntry.recipes) {
        const recipeKey = recipe.title.toLowerCase().trim()
        if (!seenRecipeIds.has(recipeKey)) {
          seenRecipeIds.add(recipeKey)
          allRecipes.push({
            ...recipe,
            searchTimestamp: searchEntry.timestamp,
            searchIngredients: searchEntry.ingredients
          })
          
          if (allRecipes.length >= limit) {
            return allRecipes
          }
        }
      }
    }
    
    return allRecipes
  } catch (error) {
    console.error('Error getting recent recipes from history:', error)
    return []
  }
}