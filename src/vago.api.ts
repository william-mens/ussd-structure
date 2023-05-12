import axios from 'axios';
import { ConfigContainer, Customer } from './types';

export const lookupCustomer = async (
  msisdn: string
): Promise<Customer | false> => {
  const url = 'http://google.com';
  try {
    // const response = await axios.get(`${url}`);
  } catch (error) {
    console.log('An error occured with customer lookup', { error, msisdn });
  }
  return {
    eligibility: true,
    pin: true,
    msisdn,
    active: true,
  };
};

export const fetchRegions = async (container: ConfigContainer) => {
  let regions;
  regions = await container.redis.get('regions');
  if (regions) {
    return JSON.parse(regions as string);
  }
  regions = [
    { name: 'Greater Accra', id: 1 },
    { name: 'Brong Ahafo Region', id: 2 },
    { name: 'Ashanti Region', id: 3 },
    { name: 'Western Region', id: 4 },
    { name: 'Volta Region', id: 5 },
    { name: 'Eastern Region', id: 6 },
    { name: 'Northern Region', id: 7 },
  ];
  container.redis.set('regions', JSON.stringify(regions));
  return regions;
};

export const createUser = (user: {}) => {
  return { response_code: 200, data: user };
};
export const calculateInterest = (
  amount: number
): { interest: number; amount: number } | false => {
  return { interest: 1, amount };
};
export const authorizePin = (pin: string): boolean | string => {
  return pin;
};
export const requestLoan = async (payload: {}): Promise<boolean> => {
  const url = 'http://google.com';
  try {
    // const response = await axios.get(`${url}`);
    return true;
  } catch (error) {
    console.log('An error occured with customer lookup', { error, payload });
    return false;
  }
};
