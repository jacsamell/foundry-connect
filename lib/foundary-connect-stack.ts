import * as cdk from '@aws-cdk/core';
import { NodejsFunction, SourceMapMode } from '@aws-cdk/aws-lambda-nodejs';
import { Table } from '@aws-cdk/aws-dynamodb';

export class FoundaryConnectStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        new NodejsFunction(this, 'vanity-lambda', {
            entry: './lib/handlers/vanity.ts',
            functionName: 'vanity-lambda',
            bundling: {
                sourceMap: true,
                sourceMapMode: SourceMapMode.DEFAULT,
            },
        })
    }
}
