import React, { useState, useRef, useEffect, useContext } from 'react'
import '../styles/IngredientInput.css'
import { commonIngredients } from '../assets'
import { MainContext } from '../context/main/main-context'

const IngredientInput = ({ ingredients, setIngredients, placeholder = "Add ingredients..." }) => {
  
  const [inputValue, setInputValue] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef(null)
  const suggestionRefs = useRef([])



  useEffect(() => {
    if (inputValue.trim()) {
      const filtered = commonIngredients.filter(ingredient =>
        ingredient.toLowerCase().includes(inputValue.toLowerCase()) &&
        !ingredients.some(existingIngredient => 
          existingIngredient.toLowerCase() === ingredient.toLowerCase()
        )
      )
      setSuggestions(filtered.slice(0, 8))
      setShowSuggestions(filtered.length > 0)
      setSelectedIndex(-1)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }, [inputValue, ingredients])

  const addIngredient = (ingredient) => {
    const trimmedIngredient = ingredient.trim()
    if (trimmedIngredient && !ingredients.some(ing => 
      ing.toLowerCase() === trimmedIngredient.toLowerCase()
    )) {
      setIngredients([...ingredients, trimmedIngredient])
    }
    setInputValue('')
    setShowSuggestions(false)
    setSelectedIndex(-1)
    inputRef.current?.focus()
  }

  const removeIngredient = (indexToRemove) => {
    setIngredients(ingredients.filter((_, index) => index !== indexToRemove))
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        addIngredient(suggestions[selectedIndex])
      } else if (inputValue.trim()) {
        addIngredient(inputValue)
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      )
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
      setSelectedIndex(-1)
    } else if (e.key === 'Backspace' && !inputValue && ingredients.length > 0) {
      removeIngredient(ingredients.length - 1)
    }
  }

  const handleSuggestionClick = (ingredient) => {
    addIngredient(ingredient)
  }

  useEffect(() => {
    if (selectedIndex >= 0 && suggestionRefs.current[selectedIndex]) {
      suggestionRefs.current[selectedIndex].scrollIntoView({
        block: 'nearest',
        behavior: 'smooth'
      })
    }
  }, [selectedIndex])

  return (
    <div className="ingredient-input-container">
      <div className="ingredient-input-wrapper">
        <div className="ingredient-tags">
          {ingredients.map((ingredient, index) => (
            <span key={index} className="ingredient-tag">
              {ingredient}
              <button
                type="button"
                className="ingredient-tag-remove"
                onClick={() => removeIngredient(index)}
                aria-label={`Remove ${ingredient}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <input
          ref={inputRef}
          type="text"
          className="ingredient-input"
          placeholder={ingredients.length === 0 ? placeholder : "Add more..."}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0) {
              setShowSuggestions(true)
            }
          }}
          onBlur={() => {
            // Delay hiding suggestions to allow clicks
            setTimeout(() => setShowSuggestions(false), 200)
          }}
        />
      </div>
      
      {showSuggestions && suggestions.length > 0 && (
        <div className="ingredient-suggestions">
          {suggestions.map((suggestion, index) => (
            <div
              key={suggestion}
              ref={el => suggestionRefs.current[index] = el}
              className={`ingredient-suggestion ${selectedIndex === index ? 'selected' : ''}`}
              onClick={() => handleSuggestionClick(suggestion)}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
      
      {ingredients.length > 0 && (
        <div className="ingredient-actions">
          <button
            type="button"
            className="clear-all-btn"
            onClick={() => setIngredients([])}
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  )
}

export default IngredientInput