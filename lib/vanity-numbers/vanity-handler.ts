import 'source-map-support/register';
import { ConnectContactFlowHandler } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { generateVanityNumbers } from './vanity-generator';

const dynamo = new DynamoDB.DocumentClient();

export const handler: ConnectContactFlowHandler = async (event) => {
    console.log('Received event', JSON.stringify(event, null, 4));

    const phoneNumber = event.Details.ContactData.CustomerEndpoint?.Address;
    if (!phoneNumber) {
        throw new Error('Cannot find customer phone number');
    }

    const vanityNumbers = generateVanityNumbers(phoneNumber);

    await dynamo.put({
        TableName: 'vanity-numbers',
        Item: { phoneNumber: phoneNumber, vanityNumbers: vanityNumbers, insertTime: new Date().valueOf() }
    }).promise();

    return { message: `<speak>Your possible vanity numbers are: ${vanityNumbers.map(vanityNo => `<say-as interpret-as="telephone">${vanityNo}</say-as>`).join(' or, ')}</speak>` };
};
