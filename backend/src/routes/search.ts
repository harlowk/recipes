import { Request, Response } from "express"
import { RecipeModel } from "../database/models/recipie"

export const searchMiddleware = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, ingredients } = req.body

  try {
    const recipes = await RecipeModel.getRecipes({ name, ingredients })
    res.send(recipes.map(recipe => recipe.toTag()))
  } catch (err) {
    console.error(err)
    res.status(500).send({
      message: "An error occurred while retrieving the recipes",
      error: err
    })
  }
}