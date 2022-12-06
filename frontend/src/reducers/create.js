/*
  TODO: Create reducer and state updates here for recipe
*/
import { CREATE_RECIPE, COMPLETED_RECIPE, FAIL_RECIPE } from "../actions"

const initialState = {
    recipe: null,
    isLoading: false,
    error: null,
}

const recipeCreating = (state) => {
    return { ...state, isLoading: true }
}

const recipeCompleted = (state, payload) => {
    return { ...state, isLoading: false, recipe: payload }
}

const recipeFailed = (state, payload) => {
    return { ...state, isLoading: false, error: payload }
}

export default (state = initialState, { type, payload }) => {
    switch (type) {
        case CREATE_RECIPE:
            return recipeCreating()
        case COMPLETED_RECIPE:
            return recipeCompleted(state, payload)
        case FAIL_RECIPE:
            return recipeFailed(state, payload)
        default:
            return state
    }
}
