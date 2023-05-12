import { Redis } from 'ioredis';
import { StateType, USSDRequest } from '../types.js';
import { getState, setState } from './ussd.state.js';

export const setUserState = async (
  redis: Redis,
  data: any,
  request: USSDRequest
) => {
  await setState(StateType.user, redis, data, request);
};

export const getUserState = async (redis: Redis, request: USSDRequest) => {
  const state = await getState(StateType.user, redis, request);
  return state;
};
export const getUserField = async (
  redis: Redis,
  request: USSDRequest,
  field = ''
) => {
  const data = await getUserState(redis, request);
  try {
    return data[field];
  } catch (error) {
    console.log('An error occured', { error });
    return false;
  }
};
