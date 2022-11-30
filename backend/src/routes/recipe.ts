import { Request, Response, NextFunction } from "express"
import { Recipe, RecipeModel } from "../models"

/* 
  Get a recipe by id
  GET: /api/recipe/:id  => RecipeDetail | null
*/
export const recipeMiddleware = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params
  let recipe: Recipe | null = null
  try {
    recipe = (await RecipeModel.findById(id).exec()) || null
  } catch (err) {
    console.log("Recipe Issue: ", err)
  }
  res.send(recipe?.toDetail())
}
