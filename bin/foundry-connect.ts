#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import { FoundryConnectStack, FoundryConnectUiStack } from "../lib/foundry-connect-stack";
import { Builder } from "@sls-next/lambda-at-edge";

const app = new cdk.App();

const foundryConnectStack = new FoundryConnectStack(app, "FoundryConnectStack", {
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: "eu-west-2",
    },
});

// Build the next.js app and then create the stack
new Builder("./lib/connect-ui", "./build", {
    args: ["build", "./lib/connect-ui"],
})
    .build()
    .then(() => {
        new FoundryConnectUiStack(app, "FoundryConnectUiStack", {
            env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: "us-east-1" }, // us-east-1 due to Lambda@Edge
            connectStack: foundryConnectStack,
        });
    })
    .catch((e) => {
        console.log(e);
        process.exit(1);
    });
