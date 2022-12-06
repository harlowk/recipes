import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
// load aws credentials
process.env.AWS_SDK_LOAD_CONFIG = "true";

const REGION = "us-east-1";
export const TABLE_NAME = "recipes-table";
export const ddbClient = new DynamoDBClient({
    region: REGION,
    endpoint: process.env.DYNAMODB_ENDPOINT || "http://localhost:4566"
});
