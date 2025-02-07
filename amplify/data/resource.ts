import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

/**
 * Define the askBedrock query that takes an array of strings called ingredients and returns a 
 * BedrockResponse
 */
const schema = a.schema({
  BedrockResponse: a.customType({
    body: a.string(),
    error: a.string(),
  }),

  askBedrock: a
    .query()
    .arguments({ ingredients: a.string().array() })
    .returns(a.ref("BedrockResponse"))
    .authorization((allow) => [allow.authenticated()])
    // Use the custom handler to call the Bedrock API using bedrockDS as its data source
    .handler(
      a.handler.custom({ entry: "./bedrock.js", dataSource: "bedrockDS" })
    ),
});

export type Schema = ClientSchema<typeof schema>;

/**
 * Define the data for the app
 */
export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});