import { Request, Response } from "express"
import { RecipeModel } from "../models"

const allIngredients = ["flour", "sugar", "salt", "butter", "milk"]

const escapeRegex = (text: string): string => {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")
}

export const searchMiddleware = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, ingredients } = req.body

  const recipes = await RecipeModel
    .find({ name: new RegExp(escapeRegex(name), "gi") })
    .find({ "ingredients.name": { $nin: allIngredients.filter((ing) => !ingredients.includes(ing)) } })
    .exec()

  res.send(recipes.map((r) => r.toTag()))
}