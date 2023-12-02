import { GraphQLClient } from 'graphql-request';
import { getSdk, ValidateConfiguraionQuery, WorkflowConfigurationValidation } from '../gql';
import getGqlHeaders from './gqlHeaders';
import { ErrorWithCustomMessage } from '../utils';

export type WorkflowValidationParams = {
  backendUrl: string;
  accessToken: string;
  offers: WorkflowConfigurationValidation;
};

export type ValidateResult = NonNullable<ValidateConfiguraionQuery['result']>;

export default async (params: WorkflowValidationParams): Promise<ValidateResult> => {
  const sdk = getSdk(new GraphQLClient(params.backendUrl));
  const headers = getGqlHeaders(params.accessToken);

  try {
    const { result } = await sdk.validateConfiguraion(
      {
        input: params.offers,
      },
      headers,
    );

    return result;
  } catch (error: any) {
    let message = 'Configuration validation error';
    if (error?.response?.errors[0]?.message) message += ': ' + error.response.errors[0].message;
    throw ErrorWithCustomMessage(message, error);
  }
};
