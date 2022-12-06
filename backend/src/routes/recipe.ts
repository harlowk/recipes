import { Request, Response } from "express";
import { RecipeModel } from "../database/models/recipie";


/* 
  Get a recipe by id
  GET: /api/recipe/:id  => RecipeDetail | null
*/
export const recipeMiddleware = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params
  try {
    const recipe = await RecipeModel.getRecipe(id);
    res.send(recipe?.toDetail() ?? null);
  } catch (err) {
    console.error(err)
    res.status(500).send({
      message: "An error occurred while retrieving the recipe",
      error: err
    });
  }
}
