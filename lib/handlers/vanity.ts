import { ConnectContactFlowHandler } from 'aws-lambda';

export const handler: ConnectContactFlowHandler = async (event) => {
    console.log('Received event', event);

    return { hello: 'world' };
}
