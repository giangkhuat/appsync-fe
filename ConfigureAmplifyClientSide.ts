"use client";

import { Amplify } from "aws-amplify";
import { ResourcesConfig } from "@aws-amplify/core";

export const config: ResourcesConfig = {
  API: {
    GraphQL: {
      endpoint: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT as string,
      region: process.env.NEXT_PUBLIC_REGION as string,
      defaultAuthMode: "userPool",
    },
    // REST: {
    //   TodoHttpAPI: {
    //     endpoint: process.env.NEXT_PUBLIC_APIGATEWAY_ENDPOINT as string,
    //     region: process.env.NEXT_PUBLIC_REGION as string,
    //   },
    // },
    Events: {
      endpoint:
        "https://q3w7bmrc6raodoujk2gmqfffee.appsync-api.us-east-1.amazonaws.com/event",
      region: "us-east-1",
      defaultAuthMode: "userPool",
    },
  },
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID as string,
      userPoolClientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID as string,
      signUpVerificationMethod: "code",
    },
  },
};

Amplify.configure(config, {
  ssr: true,
});
export default function ConfigureAmplifyClientSide() {
  return null;
}
