#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { FoundaryConnectStack, ConnectUiStack } from '../lib/foundary-connect-stack';

import { Builder } from "@sls-next/lambda-at-edge";

const app = new cdk.App();

const foundaryConnectStack = new FoundaryConnectStack(app, 'FoundaryConnectStack', {
    env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
});

const builder = new Builder("./lib/connect-ui", "./build", { args: ["build", "./lib/connect-ui"] });
builder
    .build()
    .then(() => {
        new ConnectUiStack(app, 'ConnectUiStack', {
            env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: 'us-east-1' },
            connectStack: foundaryConnectStack
        });
    })
    .catch((e) => {
        console.log(e);
        process.exit(1);
    });
