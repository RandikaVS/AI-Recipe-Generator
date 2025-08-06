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
  return state;

};

// ----------------------------------------------------------------------

export function MainContextProvider({children}) {

  const [state, dispatch] = useReducer(reducer, initialState);

  const initialize = useCallback(async () => {

    dispatch({
      type: 'INITIAL',
      payload: {...initialState}
    });

  },[]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const setLoadingStart = () => dispatch({ type: 'LOADING_START' });

  const setLoadingEnd = () => dispatch({ type: 'LOADING_END' });


  const getRecipeFromOpenAI = useCallback(async (ingredients) => {

      if (!ingredients || ingredients.length === 0) {
        console.error('No ingredients provided');
        return;
      }

      setLoadingStart();

      try {

        const client = new OpenAI({
          apiKey: OPENAI_API_KEY,
          baseURL: OPENAI_BASE_URL,
          dangerouslyAllowBrowser: true,
        });

        const prompt = generateRecipePrompt(ingredients);

        const response = await client.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
        });

        const rawContent = response.choices[0]?.message?.content || '';
        const cleanedContent = rawContent.replace(/```json|```/g, '').trim();
       
        const content = JSON.parse(cleanedContent);
       
        dispatch({
          type: 'SET_SEARCH_RESULT',
          payload: {
            recipes: content
          }
        });


      } catch (error) {
        console.error('OpenAI Error:', error);
      } finally {
        setLoadingEnd();
      }
  }, []);

  // ----------------------------------------------------------------------


  const memoizedValue = useMemo(
    () => ({
      loading: state.loading,
      recipes: state.recipes,

      getRecipeFromOpenAI,
     
    }), [
          getRecipeFromOpenAI,

          state.loading,
          state.recipes,
          state
        ]);

  return <MainContext.Provider value={memoizedValue}>{children}</MainContext.Provider>;
}

MainContextProvider.propTypes = {
  children: PropTypes.node,
};
