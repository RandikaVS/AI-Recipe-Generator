
import React, { useContext, useEffect } from "react"
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { Link } from "react-router-dom"

import "../styles/Home.css"

import IngredientInput from "../components/IngredientInput"
import { MainContext } from "../context/main/main-context"
import { useLocalStorage } from "../hooks/use-local-storage"
import RecipeViewCard from "../components/RecipeViewCard"
import RecipeSearchModal from "../components/RecipeSearchModal";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: (theme.vars ?? theme).palette.text.secondary,
  ...theme.applyStyles('dark', {
    backgroundColor: '#1A2027',
  }),
}));

function Home() {

  const { getRecipeFromOpenAI, recipes, imagePrompt, generateRecipeImage, imageUrl, loading} = useContext(MainContext)

  const { state: recentRecipes, update: updateRecentRecipes } = useLocalStorage('recent_recipes', []);

  const [searchResult, setSearchResult] = React.useState([])
  const [selectedIngredients, setSelectedIngredients] = React.useState([])
  const [recipeImage, setRecipeImage] = React.useState(null)
  

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
      updateRecentRecipes('recent', recipes);
    }

  }, [recipes])

  useEffect(() => {
    
    if(imagePrompt && imagePrompt != "") {
      generateRecipeImage(imagePrompt)
    }

  }, [imagePrompt])

  useEffect(() => {
    if(imageUrl){
      
      setRecipeImage(imageUrl)
    }
  }, [imageUrl])
  
  

  return (
    <div>

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

          <RecipeSearchModal 
            selectedIngredients={selectedIngredients}
            setSelectedIngredients={setSelectedIngredients}
            handleSearch={handleSearch}
            searchResult={searchResult}
            imageUrl={recipeImage}
          />

          <div className="col text-center text-lg-end animate__animated animate__fadeInRight">
            <img
              src="./img/Rectangle-313.webp"
              alt="food"
              style={{ width: "55%" }}
            />
          </div>
        </div>
      </div>

     {recentRecipes?.recent?.length > 0 ? (
          <>
            <div
              className="container d-flex align-items-center mt-3 mb-5 animate__animated animate__flipInX"
              style={{ height: "80px" }}
            >
              <div
                className="vr"
                style={{ width: "15px", backgroundColor: "#efc81a", opacity: "100%" }}
              ></div>
              <p className="m-0 ms-3 fs-1 fw-semibold" style={{ color: "#3f3a3a" }}>
                Your Recent Searches
              </p>
            </div>

            <Box sx={{ flexGrow: 1 }} className="container px-4 py-5 mb-5 container-popular-recipe">
              <Grid container spacing={4}> 
                {recentRecipes.recent.map((item, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <RecipeViewCard recipe={item} imagePath={recipeImage} width={600}/>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </>
    ):(

      <>

        <div
          className="container d-flex align-items-center mt-3 mb-5 animate__animated animate__flipInX"
          style={{ height: "80px" }}
        >
          <div
            className="vr"
            style={{ width: "15px", backgroundColor: "#efc81a", opacity: "100%" }}
          ></div>
          <p className="m-0 ms-3 fs-1 fw-semibold" style={{ color: "#3f3a3a" }}>
            Popular For You!
          </p>
        </div>

        <div className="container" style={{ marginBottom: "100px" }}>
          <div className="row flex-column gap-5 flex-lg-row py-5">
            <div className="col text-center text-lg-start animate__animated animate__fadeInLeft">
              <img
                src="./img/kottu.jpg"
                alt="food"
                style={{ width: "80%" }}
              />
            </div>
            <div className="col-8 col-lg-4 d-flex flex-column d-lg-block justify-content-center align-self-center animate__animated animate__fadeInRight">
              <h2
                className="text-center text-lg-start fs-1"
                style={{ color: "#3f3a3a" }}
              >
                Kottu Roti – Sri Lanka’s Street Food Star
              </h2>
              <hr className="opacity-100" />
              <p
                style={{ color: "#3f3a3a" }}
                className="text-center text-lg-start"
              >
                Kottu Roti is Sri Lanka’s iconic street food — a sizzling blend of chopped godamba roti, vegetables, eggs, and your choice of meat, cooked on a hot griddle with bold spices. A must-try comfort food that's noisy, spicy, and deeply satisfying.
              </p>
             
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
            New Recipe
          </p>
        </div>

        <div className="left-layer animate__animated animate__fadeIn"></div>

        <div className="container" style={{ marginBottom: "150px" }}>
          <div className="row flex-column gap-5 flex-lg-row py-5">
            <div className="col text-center text-lg-start animate__animated animate__fadeInLeft">
              <img
                src='./img/Jackfruit-wrap-1.jpg'
                alt="food"
                onError={addDefaultSrc}
                style={{ width: "40vw", height:"80vh" }}
              />
            </div>
            <div className="col-8 col-lg-4 d-flex flex-column d-lg-block justify-content-center align-self-center animate__animated animate__fadeInRight">
              <h2
                className="text-center text-lg-start fs-1"
                style={{ color: "#3f3a3a" }}
              >
                Jackfruit Pulled Curry Wrap – Vegan Delight with a Local Twist
              </h2>
              <hr className="opacity-100" style={{ width: "25% !important" }} />
              <p
                style={{ color: "#3f3a3a" }}
                className="text-center text-lg-start"
              >
                Inspired by plant-based trends, this wrap features young jackfruit slow-cooked in creamy coconut and curry leaves, wrapped in flatbread for a healthy, delicious alternative to meat-based meals. Great for lunch or a light dinner.
              </p>
              
            </div>
          </div>
        </div>

       </>
    )}
  </div>
  )
}

export default Home
