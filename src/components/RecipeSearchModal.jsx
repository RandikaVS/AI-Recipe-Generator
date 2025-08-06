import React, { useContext } from 'react'
import RecipeViewCard from './RecipeViewCard'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import IngredientInput from './IngredientInput'
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'
import { MainContext } from '../context/main/main-context'

function RecipeSearchModal({selectedIngredients,setSelectedIngredients,handleSearch,searchResult,imageUrl}) {

    const {loading} = useContext(MainContext);

  return (
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

                  {searchResult && searchResult.length > 0 ?(

                    <Box sx={{ flexGrow: 1 }} className="container px-4 py-5 mb-5 container-popular-recipe">
                      <Grid container spacing={4}> 
                        {searchResult.map((item, index) => (
                          <Grid item xs={12} sm={6} key={index}>
                            <RecipeViewCard recipe={item} imagePath={imageUrl} width={500}/>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>

                  ):(
                    selectedIngredients.length > 0 ?(
                        loading?(
                            <Backdrop
                                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                                open={loading}
                            >
                                
                                <CircularProgress color="inherit" />
                            </Backdrop>
                        ):(

                            <div className="text-center text-muted py-4">
                                <p>Click "Search Recipes" to find recipes with your selected ingredients!</p>
                            </div>

                        )

                      
                    ):(
                      <div className="text-center text-muted py-4">
                            <p>Add some ingredients above to start searching for recipes</p>
                      </div>
                    )

                  )}

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
  )
}

export default RecipeSearchModal