import { Redis } from 'ioredis';
import { StateType, USSDRequest } from '../types.js';
import { getState, setState } from './ussd.state.js';

export const setClientState = async (
  redis: Redis,
  request: USSDRequest,
  current_menu: string,
  flow: string
) => {
  const data = {
    current_menu,
    data: request,
    flow,
  };
  
  await setState(StateType.client, redis, data, request);
};
export const updateFlow = async (
  redis: Redis,
  request: USSDRequest,
  current_menu: string,
  flow: string
) => {
  const data = {
    current_menu,
    data: request,
    flow,
  };
  await setState(StateType.client, redis, data, request);
};

export const getClientState = async (redis: Redis, request: USSDRequest) => {
  const state = await getState(StateType.client, redis, request);
  return state;
};

interface ClientState {
  current_menu: string;
  data: USSDRequest;
  flow: string;
}
