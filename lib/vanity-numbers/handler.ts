import "source-map-support/register";
import { ConnectContactFlowHandler } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import { generateVanityNumbers } from "./vanity-generator";

const dynamo = new DynamoDB.DocumentClient();

// It may make more sense for these numbers to be the same - I would check these requirements with the client
const numbersToRead = 3;
const numbersToSave = 5;

export const handler: ConnectContactFlowHandler = async (event) => {
    const phoneNumber = event.Details.ContactData.CustomerEndpoint?.Address;

    console.log("Received event for phone number", phoneNumber);

    if (!phoneNumber) {
        throw new Error("Cannot find customer phone number");
    }

    const vanityNumbers = generateVanityNumbers(phoneNumber, numbersToSave);

    await dynamo
        .put({
            TableName: "vanity-numbers",
            Item: {
                phoneNumber: phoneNumber,
                vanityNumbers: vanityNumbers,
                insertTime: new Date().valueOf(),
            },
        })
        .promise();

    return {
        message: `<speak>Your possible vanity numbers are: ${
            // First 3 vanity numbers to be read to the caller
            vanityNumbers
                .slice(0, numbersToRead)
                .map((vanityNo) => `<say-as interpret-as="telephone">${vanityNo}</say-as>`)
                .join(" or, ")
        }</speak>`,
    };
};
