import * as cdk from '@aws-cdk/core';
import { NodejsFunction, SourceMapMode } from '@aws-cdk/aws-lambda-nodejs';
import { Table, AttributeType } from '@aws-cdk/aws-dynamodb';
import { PriceClass } from '@aws-cdk/aws-cloudfront';
import { NextJSLambdaEdge } from '@sls-next/cdk-construct';
import { CustomResource, Duration } from '@aws-cdk/core';
import { PolicyStatement } from '@aws-cdk/aws-iam';
import { Provider } from '@aws-cdk/custom-resources';

export class FoundryConnectStack extends cdk.Stack {
    readonly table: Table;

    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const vanityLambda = new NodejsFunction(this, 'vanity-lambda', {
            entry: './lib/vanity-numbers/handler.ts',
            functionName: 'vanity-lambda',
            bundling: {
                sourceMap: true,
                sourceMapMode: SourceMapMode.DEFAULT,
            },
            timeout: Duration.minutes(1)
        });

        this.table = new Table(this, 'vanity-table', {
            partitionKey: { name: 'phoneNumber', type: AttributeType.STRING },
            tableName: 'vanity-numbers'
        });

        this.table.grantWriteData(vanityLambda);

        const customCfnContactFlowLambda = new NodejsFunction(this, 'custom-cfn-contact-flow-lambda', {
            entry: './lib/custom-cloudformation/handler.ts',
            functionName: 'custom-cfn-contact-flow-lambda',
            bundling: {
                sourceMap: true,
                sourceMapMode: SourceMapMode.DEFAULT,
            },
            environment: {
                VANITY_LAMBDA_ARN: vanityLambda.functionArn
            },
            timeout: Duration.minutes(1)
        });

        customCfnContactFlowLambda.addToRolePolicy(new PolicyStatement({
            actions: ['connect:ListInstances', 'connect:UpdateContactFlowContent', 'connect:CreateContactFlow', 'connect:ListContactFlows', 'ds:DescribeDirectories'],
            resources: ['*']
        }));

        const provider = new Provider(this, 'contact-flow-provider', {
            onEventHandler: customCfnContactFlowLambda,
        });

        new CustomResource(this, 'contact-flow', {
            serviceToken: provider.serviceToken, properties: {
                version: 3 // change the version to force an update
            }
        })
    }
}

export class FoundryConnectUiStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props: cdk.StackProps & { connectStack: FoundryConnectStack }) {
        super(scope, id, props);

        const defaultNextLambda = new NextJSLambdaEdge(this, "foundry-connect-ui", {
            serverlessBuildOutDir: "./build",
            cloudfrontProps: {
                priceClass: PriceClass.PRICE_CLASS_100,
            }
        }).defaultNextLambda;

        props.connectStack.table.grantReadData(defaultNextLambda)
    }
}
