

export const GET_RECIPE = "GET_RECIPE"
export const RECEIVE_RECIPE = "RECEIVE_RECIPE"
export const FAIL_RECIPE = "FAIL_RECIPE"

const action = {
  fetchingRecipe: () => ({
    type: GET_RECIPE,
  }),
  fetchedRecipe: (payload) => ({
    type: RECEIVE_RECIPE,
    payload,
  }),
  failedRecipe: (payload) => ({
    type: FAIL_RECIPE,
    payload,
  }),
}

export const executeRecipe = async (id) => {
  const response = await fetch(`/api/recipe/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
  const recipe = await response.json()
  return recipe
}

export const fetchRecipe = (id) => {
  return async (dispatch) => {
    dispatch(action.fetchingRecipe())
    try {
      const recipe = await executeRecipe(id)
      dispatch(action.fetchedRecipe(recipe))
    } catch (e) {
      dispatch(action.failedRecipe(e))
    }
  }
}
