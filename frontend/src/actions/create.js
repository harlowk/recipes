

export const CREATE_RECIPE = "CREATE_RECIPE"
export const COMPLETED_RECIPE = "COMPLETED_RECIPE"
export const FAIL_RECIPE = "FAIL_RECIPE"

const action = {
    creatingRecipe: () => ({
        type: CREATE_RECIPE,
    }),
    createdRecipe: (payload) => ({
        type: COMPLETED_RECIPE,
        payload,
    }),
    failedRecipe: (payload) => ({
        type: FAIL_RECIPE,
        payload,
    }),
}

export const executeCreateRecipe = async (body) => {
    const response = await fetch(`/api/recipe`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    })
    const recipe = await response.json()
    return recipe
}

export const createRecipe = (body) => {
    return async (dispatch) => {
        dispatch(action.creatingRecipe())
        try {
            const recipe = await executeCreateRecipe(body)
            dispatch(action.createdRecipe(recipe))
        } catch (e) {
            dispatch(action.failedRecipe(e))
        }
    }
}
