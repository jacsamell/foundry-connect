import { ConnectContactFlowHandler } from 'aws-lambda';

export const handler: ConnectContactFlowHandler = async (event) => {
    console.log('Received event', JSON.stringify(event, null, 4));

    const phoneNumber = event.Details.ContactData.CustomerEndpoint?.Address;
    if (!phoneNumber) throw new Error("Can't find customer phone number");

    return { hello: phoneNumber };
}
