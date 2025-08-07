import PropTypes from 'prop-types';
import {useMemo, useReducer, useCallback, useEffect} from 'react';

import axios, {endpoints} from '../../utils/axios';

import {MainContext} from './main-context';
import { OPENAI_API_KEY, OPENAI_BASE_URL } from '../../config-global';
import OpenAI from 'openai';
import { generateRecipePrompt } from '../../utils/generatePrompt';


const initialState = {
  loading: false,
  recipes: [],
  imagePrompt:"",
  imageLoading:false,
  imageUrl:null

};

const reducer = (state, action) => {

  if (action.type === 'INITIAL') {
    return {
      ...initialState,
    };
  }
  if (action.type === 'LOADING_START') {
    return {
      ...state,
      loading: true,
    };
  }
  if (action.type === 'LOADING_END') {
    return {
      ...state,
      loading: false,
    };
  }
  if (action.type === 'SET_SEARCH_RESULT') {
    return {
      ...state,
      recipes: action.payload.recipes,
    };
  }
  if (action.type === 'SET_IMAGE_PROMPT') {
    return {
      ...state,
      imagePrompt: action.payload.imagePrompt,
    };
  }
  if (action.type === 'SET_RECIPE_IMAGE') {
    return {
      ...state,
      imageUrl: action.payload.imageUrl? action.payload.imageUrl: state.imageUrl,
    };
  }
  if (action.type === 'IMAGE_LOADING_START') {
    return {
      ...state,
      imageLoading: true,
    };
  }
  if (action.type === 'IMAGE_LOADING_END') {
    return {
      ...state,
      imageLoading: false,
    };
  }
  return state;

};

// ----------------------------------------------------------------------

export function MainContextProvider({children}) {

  const [state, dispatch] = useReducer(reducer, initialState);

  const initialize = useCallback(async () => {

    dispatch({
      type: 'INITIAL',
      payload: {}
    });

  },[]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const setLoadingStart = () => dispatch({ type: 'LOADING_START' });

  const setLoadingEnd = () => dispatch({ type: 'LOADING_END' });

  const clearRecipies = () =>{

    dispatch({ 
      type: 'SET_SEARCH_RESULT',
      payload: {
            recipes: []
        }
     });
  }
  
  const setImageLoadingStart = () => dispatch({ type: 'IMAGE_LOADING_START' });

  const setImageLoadingEnd = () => dispatch({ type: 'IMAGE_LOADING_END' });

  const getRecipeFromOpenAI = useCallback(async (ingredients) => {

      setLoadingStart();

      if (!ingredients || ingredients.length === 0) {
        console.error('No ingredients provided');
        return;
      }

      try {

        const client = new OpenAI({
          apiKey: OPENAI_API_KEY,
          baseURL: OPENAI_BASE_URL,
          dangerouslyAllowBrowser: true,
        });

        const prompt = generateRecipePrompt(ingredients);

        const response = await client.chat.completions.create({
          model: 'gpt-4.1',
          messages: [{ role: 'developer', content: prompt }],
          temperature: 0.7,
          
        });

        const rawContent = response.choices[0]?.message?.content || '';
        const cleanedContent = rawContent.replace(/```json|```/g, '').trim();
       
        const content = JSON.parse(cleanedContent);

        const parsedRecipe = content?.recipes || []
        const imagePromptDescription = content.imagePrompt || ""
        
         dispatch({
          type: 'SET_SEARCH_RESULT',
          payload: {
            recipes: parsedRecipe
          }
        });

         dispatch({
          type: 'SET_IMAGE_PROMPT',
          payload: {
            imagePrompt: imagePromptDescription
          }
        });
       
       
      } catch (error) {
        console.error('OpenAI Error:', error);
      } finally {
        setLoadingEnd();
      }
  }, []);

  const generateRecipeImage  = useCallback(async (imagePrompt) => {

    try {

      setImageLoadingStart()

      const client = new OpenAI({
          apiKey: OPENAI_API_KEY,
          dangerouslyAllowBrowser: true,
      });

      const response = await client.images.generate({
        prompt: imagePrompt,
        model: "dall-e-2", 
        n: 1,
        size: "1024x1024",
      });

      const imageUrl = response.data[0]?.url;

      

      if (imageUrl) {
        dispatch({
          type: 'SET_RECIPE_IMAGE',
          payload: {
            imageUrl: imageUrl
          }
        });
      } else {
        console.error("❌ No image URL returned");
      }
    } catch (error) {
      console.error("Image Generation Error:", error);
    }
    finally{
      setImageLoadingEnd()
    }
  }, []);

  // ----------------------------------------------------------------------


  const memoizedValue = useMemo(
    () => ({
      loading: state.loading,
      recipes: state.recipes,
      imagePrompt: state.imagePrompt,
      imageUrl: state.imageUrl,
      imageLoading: state.imageLoading,

      getRecipeFromOpenAI,
      generateRecipeImage,
      clearRecipies
     
    }), [
          getRecipeFromOpenAI,
          generateRecipeImage,
          clearRecipies,

          state.loading,
          state.recipes,
          state.imagePrompt,
          state.imageUrl,
          state.imageLoading,
          
        ]);

  return <MainContext.Provider value={memoizedValue}>{children}</MainContext.Provider>;
}

MainContextProvider.propTypes = {
  children: PropTypes.node,
};
