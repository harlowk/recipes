import {
    DeleteItemCommand,
    GetItemCommand,
    PutItemCommand,

    ScanCommand
} from "@aws-sdk/client-dynamodb";
import { randomUUID } from "crypto";
import { ddbClient, TABLE_NAME } from "../client";

export interface Ingredient {
    name: string
    unit: string
    amount: number
}
export type RecipeTag = Pick<Recipe, "id" | "name">;
export type RecipeDetail = Pick<Recipe, "name" | "instructions" | "ingredients">;
export type Recipe = {
    id: string
    name: string
    instructions: string
    ingredients: Ingredient[]
}

export class RecipeModel {

    public id: string
    public name: string
    public instructions: string
    public ingredients: Ingredient[]

    constructor(recipe: Recipe) {
        this.id = recipe.id
        this.name = recipe.name
        this.instructions = recipe.instructions
        this.ingredients = recipe.ingredients
    }

    public toTag(): RecipeTag {
        return { id: this.id, name: this.name }
    }

    public toDetail(): RecipeDetail {
        return { name: this.name, instructions: this.instructions, ingredients: this.ingredients }
    }

    public static async getRecipes(options: {
        name: string
        ingredients: string[]
    }): Promise<RecipeModel[]> {
        const { name, ingredients } = options

        const recipes = await ddbClient.send(new ScanCommand({
            TableName: TABLE_NAME,
            FilterExpression: "contains(#name, :name)",
            ExpressionAttributeNames: {
                "#name": "_name"
            },
            ExpressionAttributeValues: {
                ":name": { S: name.toLowerCase() }
            }
        }));


        let items = recipes.Items || []
        // only return recipes that can be made with the ingredients
        items = items.filter((recipe) => {
            const recipeIngredients = recipe.ingredients.L || []
            const recipeIngredientNames = recipeIngredients.map((ingredient) => {
                return (ingredient.M?.name.S || "").toLowerCase()
            })

            return recipeIngredientNames.every((ingredientName) => {
                return ingredients.includes(ingredientName)
            })
        })

        return items.map((recipe) => {
            return new RecipeModel({
                id: recipe.id.S || "",
                name: recipe.name.S || "",
                instructions: recipe.instructions.S || "",
                ingredients: recipe.ingredients.L?.map((item) => {
                    return {
                        name: item.M?.name.S || "",
                        unit: item.M?.unit.S || "",
                        amount: item.M?.amount.N ? Number(item.M?.amount.N) : 0
                    }
                }) || []
            })
        })
    }

    public static async createRecipe(options: {
        id?: string
        name: string
        instructions: string
        ingredients: Ingredient[]
    }): Promise<RecipeModel> {
        const { name, instructions, ingredients } = options
        const recipe = new RecipeModel({
            id: options.id || randomUUID(),
            name,
            instructions,
            ingredients
        })
        await ddbClient.send(new PutItemCommand({
            TableName: TABLE_NAME,
            Item: {
                id: { S: recipe.id },
                name: { S: recipe.name },
                _name: { S: recipe.name.toLowerCase() },
                instructions: { S: recipe.instructions },
                ingredients: {
                    L: recipe.ingredients.map((ingredient) => {
                        return {
                            M: {
                                name: { S: ingredient.name },
                                unit: { S: ingredient.unit },
                                amount: { N: ingredient.amount.toString() }
                            }
                        }
                    })
                }
            }
        }))
        return recipe
    }

    public static async getRecipe(id: string): Promise<RecipeModel | null> {

        const res = await ddbClient.send(new GetItemCommand({
            TableName: TABLE_NAME,
            Key: {
                id: { S: id }
            }
        }));

        return res.Item ? new RecipeModel({
            id: res.Item.id.S,
            name: res.Item.name.S,
            instructions: res.Item.instructions.S,
            ingredients: res.Item.ingredients.L.map((ingredient) => {
                return {
                    name: ingredient.M.name.S,
                    unit: ingredient.M.unit.S,
                    amount: ingredient.M.amount.N ? parseInt(ingredient.M.amount.N) : 0
                }
            }) as Ingredient[]
        }) : null
    }

    public static async deleteAll(): Promise<void> {
        const recipes = await ddbClient.send(new ScanCommand({
            TableName: TABLE_NAME
        }));

        const items = recipes.Items || []
        for (const item of items) {
            await ddbClient.send(new DeleteItemCommand({
                TableName: TABLE_NAME,
                Key: {
                    id: { S: item.id.S }
                }
            }))
        }
    }
}


