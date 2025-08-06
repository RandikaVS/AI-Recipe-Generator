import React from "react"
import "../styles/RecipeCard.css"

const RecipeCard = ({ recipe }) => {

  const {
    title,
    image,
    ingredients,
    instructions,
    usedIngredients,
    missingIngredients,
    substitutions,
    dietaryModifications,
    scaling,
  } = recipe

  return (
    <div className="card p-4 shadow-sm mb-4 recipe-card">
      {image && (
        <img
          src={image}
          alt={title}
          className="card-img-top mb-3"
          onError={(e) => (e.target.src = "./img/Group-697.webp")}
        />
      )}

      <h3 className="text-primary mb-3">{title}</h3>

      <div>
        <h5>🧂 Ingredients:</h5>
        <ul>
          {ingredients?.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      <div>
        <h5>✅ Used Ingredients:</h5>
        <ul>
          {usedIngredients?.map((item, index) => (
            <li key={index} className="text-success font-weight-bold">
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h5>❌ Missing Ingredients:</h5>
        <ul>
          {missingIngredients?.map((item, index) => (
            <li key={index} className="text-danger font-weight-bold">
              {item}
            </li>
          ))}
        </ul>
      </div>

      {substitutions && (
        <div>
          <h5>🔁 Substitutions:</h5>
          <ul>
            {Object.entries(substitutions).map(([original, substitute], index) => (
              <li key={index}>
                <span className="highlight-sub">
                  {original} ➜ {substitute}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {instructions && (
        <div>
          <h5>👨‍🍳 Instructions:</h5>
          <ol>
            {instructions
              .split(/(?=\d\.)/)
              .filter((step) => step.trim())
              .map((step, index) => (
                <li key={index}>{step.trim()}</li>
              ))}
          </ol>
        </div>
      )}

      {dietaryModifications && (
        <div>
          <h5>🌱 Dietary Modifications:</h5>
          <ul>
            {Object.entries(dietaryModifications).map(([type, note], index) => (
              <li key={index}>
                <strong>{type}:</strong> {note}
              </li>
            ))}
          </ul>
        </div>
      )}

      {scaling && (
        <div>
          <h5>📏 Scaling Options:</h5>
          <ul>
            <li>
              <strong>2 servings:</strong> {scaling["2_servings"]}
            </li>
            <li>
              <strong>4 servings:</strong> {scaling["4_servings"]}
            </li>
          </ul>
        </div>
      )}
    </div>
  )
}

export default RecipeCard
