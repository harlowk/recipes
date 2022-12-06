import { DeleteItemCommand, DescribeTableCommand, DynamoDBClient, PutItemCommand, ScanCommand } from "@aws-sdk/client-dynamodb";
import { randomUUID } from "crypto";
import { builtRecipes } from "./data-generator";
// load aws credentials
process.env.AWS_SDK_LOAD_CONFIG = "true";

const REGION = "us-east-1";
export const TABLE_NAME = "recipes-table";
export const ddbClient = new DynamoDBClient({
    region: REGION,
    endpoint: process.env.DYNAMODB_ENDPOINT || "http://localhost:4566"
});

export const operations = {
    waitForTable: async () => {
        let ready = false
        while (!ready) {
            try {
                await ddbClient.send(new DescribeTableCommand({ TableName: TABLE_NAME }))
                ready = true
            } catch (e) {
                console.warn("Waiting for DynamoDB to be ready...")
                await new Promise(resolve => setTimeout(resolve, 1000))
            }
        }
        console.log("DynamoDB is ready")
    },
    clearTable: async () => {
        const response = await ddbClient.send(new ScanCommand({
            TableName: TABLE_NAME
        }));
        await Promise.all(response.Items.map(async (item) =>
            await ddbClient.send(new DeleteItemCommand({
                TableName: TABLE_NAME,
                Key: { id: { S: item.id.S } }
            }))));
        console.log("Table cleared");
    },

    seedTable: async () => {
        const items = builtRecipes;
        await Promise.all(items.map(async (item) =>
            await ddbClient.send(new PutItemCommand({
                TableName: TABLE_NAME,
                Item: {
                    id: { S: randomUUID() },
                    name: { S: item.name },
                    _name: { S: item.name.toLowerCase() },
                    instructions: { S: item.instructions },
                    ingredients: {
                        L: item.ingredients.map((ingredient) => {
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
        ));
        console.log("Table seeded");
    }
}