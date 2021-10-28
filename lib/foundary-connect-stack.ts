import * as cdk from '@aws-cdk/core';
import { NodejsFunction, SourceMapMode } from '@aws-cdk/aws-lambda-nodejs';
import { Table, AttributeType } from '@aws-cdk/aws-dynamodb';

export class FoundaryConnectStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const vanityLambda = new NodejsFunction(this, 'vanity-lambda', {
            entry: './lib/handlers/vanity.ts',
            functionName: 'vanity-lambda',
            bundling: {
                sourceMap: true,
                sourceMapMode: SourceMapMode.DEFAULT,
            },
        });

        new Table(this, 'vanity-table', {
            partitionKey: { name: 'phoneNumber', type: AttributeType.STRING },
            tableName: 'vanity-numbers'
        }).grantWriteData(vanityLambda);
    }
}
