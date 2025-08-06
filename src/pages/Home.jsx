import React, { useContext, useEffect } from "react"
import { Link } from "react-router-dom"

import "../styles/Home.css"

import IngredientInput from "../components/IngredientInput"
import { MainContext } from "../context/main/main-context"
import RecipeCard from "../components/RecipeCard"

function Home() {

  const { getRecipeFromOpenAI, recipes } = useContext(MainContext)

  const [listRecipes, setListRecipes] = React.useState([])
  const [newRecipes, setNewRecipes] = React.useState([])
  const [keyword, setKeyword] = React.useState("")
  const [searchResult, setSearchResult] = React.useState([])
  const [selectedIngredients, setSelectedIngredients] = React.useState([])
  const [searchHistory, setSearchHistory] = React.useState([])

  // Function to save search to localStorage
  const saveSearchToHistory = (ingredients, recipes) => {
    if (!recipes || recipes.length === 0) return;
    
    const searchEntry = {
      id: Date.now(),
      ingredients: [...ingredients],
      recipes: recipes.slice(0, 3), // Save only first 3 recipes to avoid too much data
      timestamp: new Date().toISOString(),
      searchDate: new Date().toLocaleDateString()
    };

    const existingHistory = JSON.parse(localStorage.getItem('recipeSearchHistory') || '[]');
    const updatedHistory = [searchEntry, ...existingHistory].slice(0, 10); // Keep only last 10 searches
    
    localStorage.setItem('recipeSearchHistory', JSON.stringify(updatedHistory));
    setSearchHistory(updatedHistory);
  };

  // Function to load search history from localStorage
  const loadSearchHistory = () => {
    try {
      const history = JSON.parse(localStorage.getItem('recipeSearchHistory') || '[]');
      setSearchHistory(history);
    } catch (error) {
      console.error('Error loading search history:', error);
      setSearchHistory([]);
    }
  };

  // Function to clear search history
  const clearSearchHistory = () => {
    localStorage.removeItem('recipeSearchHistory');
    setSearchHistory([]);
  };

  const handleSearch = async() => {
    
    try {

      await getRecipeFromOpenAI?.(selectedIngredients)

    } catch (error) {
      console.error("Error fetching recipes:", error);
      
    }
  }

  function addDefaultSrc(ev) {
    ev.target.src = "./img/Group-697.webp"
    ev.target.style = { width: "50%" }
  }

  useEffect(() => {
    
    if(recipes && recipes.length > 0) {
      setSearchResult(recipes)
      // Save successful search to history
      if (selectedIngredients.length > 0) {
        saveSearchToHistory(selectedIngredients, recipes);
      }
    }

  }, [recipes, selectedIngredients])

  // Load search history on component mount
  useEffect(() => {
    loadSearchHistory();
  }, []);
  

  return (
    <div>
      {/* <Navbar /> */}

      <div className="right-layer animate__animated animate__fadeIn"></div>

      <div className="container mt-4" style={{ height: "600px" }}>
        <div className="row flex-column-reverse gap-5 flex-lg-row py-5">
          <div className="col-8 col-lg-4 align-self-center animate__animated animate__fadeInLeft">
            <h1
              className="text-center text-lg-start fw-bolder fs-1 mb-4"
              style={{ color: "#2e266f" }}
            >
              Discover Recipe & Delicious Food
            </h1>
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Search Food"
              data-bs-toggle="modal"
              data-bs-target="#search-recipe"
            />
          </div>

          <div
            className="modal fade"
            id="search-recipe"
            tabIndex={0}
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-xl">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5" id="exampleModalLabel">
                    Search Recipe by Ingredients
                  </h1>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-4">
                    <label className="form-label fw-semibold mb-3">
                      <span style={{ color: "#2e266f" }}>
                        🥗 Add ingredients you have available:
                      </span>
                    </label>
                    <IngredientInput
                      ingredients={selectedIngredients}
                      setIngredients={setSelectedIngredients}
                      placeholder="Start typing ingredients... (e.g., chicken, rice, tomatoes)"
                    />
                  </div>
                  
                  {selectedIngredients.length > 0 && (
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span className="text-muted">
                        {selectedIngredients.length} ingredient{selectedIngredients.length !== 1 ? 's' : ''} selected
                      </span>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleSearch}
                        style={{ backgroundColor: "#efc81a", borderColor: "#efc81a", color: "#2e266f" }}
                      >
                        🔍 Search Recipes
                      </button>
                    </div>
                  )}

                  <div className="row justify-content-center gap-1 gap-sm-2 gap-md-4 mt-4">
                    {searchResult.length > 0
                      ? searchResult.map((item,index) => {
                          return (
                            <RecipeCard recipe={item} key={index}/>
                          )
                        })
                      : selectedIngredients.length > 0 
                        ? <div className="text-center text-muted py-4">
                            <p>Click "Search Recipes" to find recipes with your selected ingredients!</p>
                          </div>
                        : <div className="text-center text-muted py-4">
                            <p>Add some ingredients above to start searching for recipes</p>
                          </div>
                    }
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="col text-center text-lg-end animate__animated animate__fadeInRight">
            <img
              src="./img/Rectangle-313.webp"
              alt="food"
              style={{ width: "55%" }}
            />
          </div>
        </div>
      </div>

      {/* Search History Section - Replaces Popular For You */}
      {searchHistory.length > 0 && (
        <>
          <div
            className="container d-flex align-items-center justify-content-between mt-3 mb-5 animate__animated animate__flipInX"
            style={{ height: "80px" }}
          >
            <div className="d-flex align-items-center">
              <div
                className="vr"
                style={{ width: "15px", backgroundColor: "#efc81a", opacity: "100%" }}
              ></div>
              <p className="m-0 ms-3 fs-1 fw-semibold" style={{ color: "#3f3a3a" }}>
                Recent Searches
              </p>
            </div>
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={clearSearchHistory}
              title="Clear search history"
            >
              Clear History
            </button>
          </div>

          <div className="container" style={{ marginBottom: "100px" }}>
            {searchHistory.slice(0, 3).map((search, searchIndex) => (
              <div key={search.id} className="mb-5">
                <div className="d-flex align-items-center mb-3">
                  <small className="text-muted me-3">
                    {search.searchDate} • Ingredients: {search.ingredients.join(', ')}
                  </small>
                </div>
                <div className="row justify-content-center gap-1 gap-sm-2 gap-md-4">
                  {search.recipes.map((recipe, recipeIndex) => (
                    <RecipeCard recipe={recipe} key={`${search.id}-${recipeIndex}`} />
                  ))}
                </div>
                {searchIndex < Math.min(searchHistory.length - 1, 2) && (
                  <hr className="my-4 opacity-25" />
                )}
              </div>
            ))}
          </div>
        </>
      )}

      <div
        className="container d-flex align-items-center my-5 animate__animated animate__flipInX"
        style={{ height: "80px" }}
      >
        <div
          className="vr"
          style={{ width: "15px", backgroundColor: "#efc81a", opacity: "100%" }}
        ></div>
        <p className="m-0 ms-3 fs-1 fw-semibold" style={{ color: "#3f3a3a" }}>
          New Recipe
        </p>
      </div>

      <div className="left-layer animate__animated animate__fadeIn"></div>

      <div className="container" style={{ marginBottom: "150px" }}>
        <div className="row flex-column gap-5 flex-lg-row py-5">
          <div className="col text-center text-lg-start animate__animated animate__fadeInLeft">
            <img
              src='./img/Rectangle-319.webp'
              alt="food"
              onError={addDefaultSrc}
              style={{ width: "80%" }}
            />
          </div>
          <div className="col-8 col-lg-4 d-flex flex-column d-lg-block justify-content-center align-self-center animate__animated animate__fadeInRight">
            <h2
              className="text-center text-lg-start fs-1"
              style={{ color: "#3f3a3a" }}
            >
              {newRecipes?.title}
            </h2>
            <hr className="opacity-100" style={{ width: "25% !important" }} />
            <p
              style={{ color: "#3f3a3a" }}
              className="text-center text-lg-start"
            >
              Resep Terbaru yang Dapat Anda coba untuk Keluarga Kesayangan
            </p>
            <Link
              to={`/detail-recipe/${newRecipes?.id}`}
              className="btn btn-lg"
              style={{ backgroundColor: "#efc81a", color: "#fff" }}
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>

      <div
        className="container d-flex align-items-center my-5 animate__animated animate__flipInX"
        style={{ height: "80px" }}
      >
        <div
          className="vr"
          style={{ width: "15px", backgroundColor: "#efc81a", opacity: "100%" }}
        ></div>
        <p className="m-0 ms-3 fs-1 fw-semibold" style={{ color: "#3f3a3a" }}>
          All Recipe
        </p>
      </div>

      <div
        className="container px-4 px-md-4 py-5 mb-5 container-popular-recipe"
        id="popular-recipe"
      >
        <div className="row justify-content-center gap-1 gap-sm-2 gap-md-4">
          {listRecipes.map((item, index) => {
            return (
              <RecipeCard
                title={item?.title}
                image={item?.recipePicture}
                id={item?.id}
                key={index}
              />
            )
          })}
        </div>
      </div>

      {/* <Footer /> */}
    </div>
  )
}

export default Home
