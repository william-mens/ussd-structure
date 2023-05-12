import { Redis } from 'ioredis';
import { StateType, USSDRequest } from '../types.js';

export const setState = async (
  stateType: StateType,
  redis: Redis,
  data: {},
  request: USSDRequest
) => {
  const key = `${stateType}-${request.sessionId}-${request.msisdn}`;
  console.log("keyyyyyy",key);
  const response = await redis.get(key);
  const decodedResponse = JSON.parse(response as string);
  const newData = { ...decodedResponse, ...data };

 const max = await redis.set(key, JSON.stringify(newData),'EX','300');
 console.log("max",max)
};
export const getState = async (
  stateType: StateType,
  redis: Redis,
  request: USSDRequest
) => {
  const key = `${stateType}-${request.sessionId}-${request.msisdn}`;

  const response = await redis.get(key);
  console.log("response",response);
  const decodedResponse = JSON.parse(response as string);
  return decodedResponse;
};

export const clearState = async (redis: Redis, request: USSDRequest) => {
  const client: StateType = StateType.client;
  const user: StateType = StateType.user;
  const key1 = `${client}-${request.sessionId}-${request.msisdn}`;
  const key2 = `${user}-${request.sessionId}-${request.msisdn}`;
  await redis.del(key1);
  await redis.del(key2);
 
};
