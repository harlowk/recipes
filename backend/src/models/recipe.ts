import { Document, Schema, Model, model } from "mongoose"
import { Ingredient, IngredientSchema } from "./ingredient"

export type RecipeTag = Pick<Recipe, "id" | "name">;
export type RecipeDetail = Pick<Recipe, "name" | "instructions" | "ingredients">;
export type Recipe = Document & {
  id: string
  name: string
  instructions: string
  ingredients: Ingredient[]
  toTag: () => RecipeTag
  toDetail: () => RecipeDetail
}

const RecipeSchema: Schema<Recipe> = new Schema({
  name: { type: String, required: true, unique: true, },
  instructions: { type: String, required: true, },
  ingredients: [IngredientSchema],
}, {
  id: true
});

RecipeSchema.methods.toTag = function () {
  return { id: this.id, name: this.name }
}

RecipeSchema.methods.toDetail = function () {
  return { name: this.name, instructions: this.instructions, ingredients: this.ingredients }
}

export const RecipeModel = model<Recipe, Model<Recipe>>("Recipe", RecipeSchema);