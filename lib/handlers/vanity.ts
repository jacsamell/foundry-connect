import { ConnectContactFlowHandler } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

const dynamo = new DynamoDB.DocumentClient();

export const handler: ConnectContactFlowHandler = async (event) => {
    console.log('Received event', JSON.stringify(event, null, 4));

    const phoneNumber = event.Details.ContactData.CustomerEndpoint?.Address;
    if (!phoneNumber) {
        throw new Error("Can't find customer phone number");
    }

    const vanityNumbers = ['hello', 'world', phoneNumber];

    await dynamo.put({
        TableName: 'vanity-numbers',
        Item: { phoneNumber: phoneNumber, vanityNumbers: vanityNumbers }
    }).promise();

    return { message: `Your possible vanity numbers are: ${vanityNumbers.join(' or, ')}` };
}
