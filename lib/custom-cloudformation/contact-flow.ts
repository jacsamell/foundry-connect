export const vanityContactFlow = {
    Version: "2019-10-30",
    StartAction: "bd67aad5-0d99-48f0-b290-12d5a0fa5cdc",
    Actions: [
        {
            Identifier: "bd67aad5-0d99-48f0-b290-12d5a0fa5cdc",
            Type: "UpdateFlowLoggingBehavior",
            Transitions: {
                NextAction: "b582d384-f333-4c80-af46-ac85757a090e",
            },
            Parameters: { FlowLoggingBehavior: "Enabled" },
        },
        {
            Identifier: "b9d8bbbd-520e-4b67-b1aa-184b6d6871d5",
            Type: "MessageParticipant",
            Transitions: {
                NextAction: "ab21a188-24f2-4ef0-a630-11d957f2e7cb",
            },
            Parameters: { Text: "An error has occurred, please try again later" },
        },
        {
            Identifier: "ab21a188-24f2-4ef0-a630-11d957f2e7cb",
            Type: "DisconnectParticipant",
        },
        {
            Identifier: "b582d384-f333-4c80-af46-ac85757a090e",
            Type: "InvokeLambdaFunction",
            Transitions: {
                NextAction: "0f906d6d-5a36-422e-b122-dd4b4aadb7b5",
                Errors: [
                    {
                        NextAction: "b9d8bbbd-520e-4b67-b1aa-184b6d6871d5",
                        ErrorType: "NoMatchingError",
                    },
                ],
            },
            Parameters: {
                LambdaFunctionARN: process.env.VANITY_LAMBDA_ARN,
                InvocationTimeLimitSeconds: 5,
            },
        },
        {
            Identifier: "0f906d6d-5a36-422e-b122-dd4b4aadb7b5",
            Type: "MessageParticipant",
            Transitions: {
                NextAction: "ab21a188-24f2-4ef0-a630-11d957f2e7cb",
            },
            Parameters: { Text: "$.External.message" },
        },
    ],
};
