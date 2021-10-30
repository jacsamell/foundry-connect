import { expect as expectCDK, haveResource } from "@aws-cdk/assert";
import * as cdk from "@aws-cdk/core";
import { FoundryConnectUiStack, FoundryConnectStack } from "../lib/foundry-connect-stack";
import { Builder } from "@sls-next/lambda-at-edge";

describe("CDK Stack", () => {
    const app = new cdk.App();
    const stack = new FoundryConnectStack(app, "MyTestStack");

    it(" should build the Connect Stack successful and contain the custom resource and Dynamo table", () => {
        expectCDK(stack).to(
            haveResource("AWS::CloudFormation::CustomResource").and(haveResource("AWS::DynamoDB::Table"))
        );
    });

    it(" should build the UI Stack successful and contain the cloudfront distro and Lambda", async () => {
        await new Builder("./lib/connect-ui", "./build", {
            args: ["build", "./lib/connect-ui"],
        }).build();

        const uiStack = new FoundryConnectUiStack(app, "FoundryConnectUiStack", {
            connectStack: stack,
        });

        expectCDK(uiStack).to(haveResource("AWS::CloudFront::Distribution").and(haveResource("AWS::Lambda::Function")));
    }, 60000);
});
