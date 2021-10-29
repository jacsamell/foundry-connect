import * as cdk from '@aws-cdk/core';
import { NodejsFunction, SourceMapMode } from '@aws-cdk/aws-lambda-nodejs';
import { Table, AttributeType } from '@aws-cdk/aws-dynamodb';
import { NextJSServerless } from 'cdk-nextjs-serverless';
import { PriceClass } from '@aws-cdk/aws-cloudfront';
import { NextJSLambdaEdge } from '@sls-next/cdk-construct';

export class FoundaryConnectStack extends cdk.Stack {
    readonly table: Table;

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

        this.table = new Table(this, 'vanity-table', {
            partitionKey: { name: 'phoneNumber', type: AttributeType.STRING },
            tableName: 'vanity-numbers'
        });
        this.table.grantWriteData(vanityLambda);

        // const defaultNextLambda = new NextJSLambdaEdge(this, "connect-ui", {
        //     serverlessBuildOutDir: "./build",
        //     env: { region: 'us-east-1' } // edge lambda so must be deployed in default AWS region
        // }).defaultNextLambda;
        //
        // table.grantReadData(defaultNextLambda)

        // new NextJSServerless(this, 'connect-ui', {
        //     nextJSDir: './lib/connect-ui',
        //     cloudFrontDistributionProps: {
        //         priceClass: PriceClass.PRICE_CLASS_100
        //     }
        // }).promise().then(nextApp => nextApp.lambdaFunctionVersions.map(version => table.grantReadData(version))).catch(err => {
        //     console.error(err);
        //     process.exit(1);
        // })
    }
}

export class ConnectUiStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props: cdk.StackProps & { connectStack: FoundaryConnectStack }) {
        super(scope, id, props);

        // new NextJSServerless(this, 'connect-ui', {
        //     nextJSDir: './lib/connect-ui',
        //     cloudFrontDistributionProps: {
        //         priceClass: PriceClass.PRICE_CLASS_100
        //     }
        // }).promise()
        //     .then(nextApp => nextApp.lambdaFunctionVersions.map(version => props.connectStack.table.grantReadData(version)))
        //     .catch(err => {
        //         console.error(err);
        //         process.exit(1);
        //     })

        const defaultNextLambda = new NextJSLambdaEdge(this, "connect-ui", {
            serverlessBuildOutDir: "./build",
            cloudfrontProps: {
                priceClass: PriceClass.PRICE_CLASS_100,
            }
        }).defaultNextLambda;

        props.connectStack.table.grantReadData(defaultNextLambda)
    }
}
