import 'source-map-support/register';
import { Connect } from 'aws-sdk';
import { vanityContactFlow } from './contact-flow';
import { CloudFormationCustomResourceEvent } from 'aws-lambda/trigger/cloudformation-custom-resource';

const connect = new Connect();

const contactFlowName = 'vanity-contact-flow';

const contactFlowContent = JSON.stringify(vanityContactFlow);

export const handler = async (event: CloudFormationCustomResourceEvent) => {
    const instances = await connect.listInstances().promise();
    const count = instances.InstanceSummaryList?.length;
    if (count !== 1) {
        throw new Error(`Expected a single connect instance but got ${count}`);
    }

    const instanceId = instances.InstanceSummaryList?.[0]?.Id;
    if (!instanceId) {
        throw new Error('InstanceId was not set');
    }

    const requestType = event.RequestType;
    console.log(`Running ${requestType} contact flow for instance ${instanceId}`);

    switch (requestType) {
        case 'Update':
            const contactFlows = await connect.listContactFlows({
                InstanceId: instanceId,
                ContactFlowTypes: ['CONTACT_FLOW']
            }).promise();
            const existingFlow = contactFlows.ContactFlowSummaryList?.find(flow => flow.Name === contactFlowName);
            if (!existingFlow?.Id) {
                throw new Error('Could not find existing contact flow');
            }

            await connect.updateContactFlowContent({
                InstanceId: instanceId,
                ContactFlowId: existingFlow.Id,
                Content: contactFlowContent
            }).promise();
            return { PhysicalResourceId: existingFlow.Id };
        case 'Create':
            const contactFlow = await connect.createContactFlow({
                InstanceId: instanceId,
                Type: 'CONTACT_FLOW',
                Name: contactFlowName,
                Content: contactFlowContent
            }).promise();
            return { PhysicalResourceId: contactFlow.ContactFlowId };
        case 'Delete':
            throw new Error('Cannot delete contact flows');
        default:
            throw new Error(`Unknown request type ${requestType}`);
    }
};
