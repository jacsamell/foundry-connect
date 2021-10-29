# Foundry Connect
An example implementation of a Amazon Connect Contact Flow for generating vanity numbers and UI to see the latest customer calls and numbers

## Prerequisites 
* Authenticate against AWS using access key and id in region eu-west-2
* Run `npx cdk bootstrap` in the regions eu-west-2 and us-east-1
* You will need exactly 1 Amazon connect instance in eu-west-2

## Deployment
1. To deploy the full application simply run `npm run deploy` and wait for CDK to deploy the CloudFormation stacks

2. After the stacks are deployed you will need to add the Lambda to the Connect instance to grant the IAM permission:

[Amazon Connect](https://eu-west-2.console.aws.amazon.com/connect/v2/app/instances) > Select Instance > Contact flows > AWS Lambda > Add Lambda Function

Alternatively give the Connect service IAM role sufficiently wide permissions to allow execution of the lambda

3. In the Amazon Connect portal for the instance, navigate to `Phone numbers` and select `vanity-contact-flow` as the contact flow for the desired phone number
4. To view the UI you can see what the CloudFront distribution URL is [here](https://console.aws.amazon.com/cloudfront/v3/home)

You can now call this number and see the results in the UI

## Architecture

The application uses CDK to deploy all services so the Frontend, Backend and Infrastructure can all be written in TypeScript reducing the overhead of learning different languages. Also CDK offers all of the benefits of real code for the infra.

The UI is deployed as a serverside rendered Next.js app to CloudFront using Lambda@Edge. This not only makes it very performant but it is also very easy to write and provision in CDK without the need for APIs called from the browser.

## Limitations

* The custom CFN template assumes exactly 1 instance of Amazon Connect already exists, it also cannot handle removal.
* The UI needs the Region hardcoding because Lambda@Edge doesn't support environment variables - this could be solved by using parameter store to store the Amazon Connect region 
* IAM policies could use tightening up
* Needs a proper CICD solution setting up e.g CircleCI or GitHub Actions
* The Instance of connect needs IAM permissions to execute the lambda function - theoretically the custom resource lambda could grant this permission to the existing instance but this doesn't seem ideal 
* Contact Flow won't automatically be deployed if you change the template

* Custom cfn functions timing out without error handling, was difficult to test, ended up deploying lots of different versions while they were clearing up
* Recreating the flow in Connect Flow Lanugage was difficult, why is export not the same format?
