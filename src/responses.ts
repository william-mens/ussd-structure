import { clearState } from './states/ussd.state.js';
import { CallbackResponseType, ConfigContainer, USSDRequest } from './types.js';
export const response = (
  responseCode: string,
  responseMessage: string = '',
  data: any
) => {
  const res = { responseCode, responseMessage, data };
  return {
    statusCode: 200,
    body: JSON.stringify(res),
  };
};

export const responseSuccess = (
  data: any,
  responseMessage: string = 'Success',
  responseCode: string = '200'
) => {
  return response(responseCode, responseMessage, data);
};
export const ussdResponse = (
  request: USSDRequest,
  menuContent: string,
  currentMenu: string = 'ROOT',
  requestType: string = 'EXISTING'
) => {
  const { msisdn, sessionId } = request;
  return {
    statusCode: 200,
    body: JSON.stringify({
      msisdn,
      menuContent,
      requestType,
      sessionId,
      currentMenu,
    }),
  };
};

export const endSession = async (
  container: ConfigContainer,
  request: USSDRequest,
  menuContent: string = 'Operation Ended',
  currentMenu: string = 'ROOT',
  requestType: string = 'CLEANUP'
) => {
  console.log('End session', { request });
  await clearState(container.redis, request);
  const { msisdn, sessionId } = request;
  return {
    statusCode: 200,
    body: JSON.stringify({
      msisdn,
      menuContent,
      requestType,
      sessionId,
      currentMenu,
    }),
  };
};
export const responseValidationFailed = (
  data: [] = [],
  responseMessage: string = 'Validation failed',
  responseCode: string = '400'
) => {
  return response(responseCode, responseMessage, data);
};

export const responseError = (
  data: [] = [],
  responseMessage: string = 'An unexpected error occured. Please try again later',
  responseCode: string = '500'
) => {
  return response(responseCode, responseMessage, data);
};

export const unauthorized = (
  data: [] = [],
  responseMessage: string = 'Unauthorized',
  responseCode: string = '401'
) => {
  console.log(`${responseMessage}`);
  return response(responseCode, responseMessage, data);
};

export const CallbackResponse: CallbackResponseType = {
  SUCCESS: { response_code: '200', message: 'Operation successful' },
  DUPLICATE: { response_code: '100', message: 'Transaction already exists' },
  ERROR: { response_code: '500', message: 'General error' },
};
