import { Redis } from 'ioredis';
import { Sequelize } from 'sequelize';

export type APIGatewayEventBody = string | null;
export interface ResponseType {
  statusCode: number;
  body: string;
}
export interface ResponseTypeDeprecated {
  responseCode: string;
  responseMessage: string;
  data: any;
}
export interface lookupDriverResonse {
  driver_id:string,
  msisdn?: string,
  drivers_license?: string,
  last_name?:string,
  other_names?: string,
  photo_url?:string,
  station_master_id?:string,
  pin?:string,
  using_temporal_pin?:string,
  beneficiary_last_name?:string,
  beneficiary_other_names?:string,
  beneficiary_contact?:string,
  status?:string,
  created?:string,
  updated?:string
}
export interface createPinResponse {
  driver_id: string,
  pin:string,
  using_temporal_pin:string,
  created:string,
  updated:string
}
export interface Configs {
  host: string;
  user: string;
  password: string;
  database: string;
  redisPort: string;
  redisHost: string;
  redisPassword:string;
  taxigoUrl:string;
  taxigoApiKey?:string;
}
export interface ConfigContainer {
  redis: Redis;
  services?: ServiceInterface;
  credentials: Configs;
  logger?:any
}
export type ExternalService = {
  url: string;
  apikey: string;
};
export type VoluntaryPaymentRequest = {
  product_code:string,
  driver_id:string,
  network:string,
  amount:number
}
export interface CheckBalanceRequest {
  driver_id:string,
  pin:string
}
export interface ChangeNextOfKinRequest {
  driver_id: string,
  beneficiary_other_names: string
  beneficiary_last_name: string
  beneficiary_contact:string
}
export interface ChangePinRequest {
  driver_id: string,
   pin: string, 
   new_pin: string 
}
export interface ResetDriverPinRequest {
  driver_id: string,
   drivers_license: string
}
export interface CreateDriverPinRequest {
  driver_id: string,
   pin: string
}
export interface cancelMandateRequest {
  driver_id: string,
  pin: string
}
export interface PaymentCalculationRequest {
  product_code:string,
  driver_id:string,
  network:string,
  amount:number

}
export interface ClaimRequest {
  driver_id:string,
  amount:number,
  claim_type:string
}

export interface ProductResponse {
  product_code: string,
  product_name: string,
  product_description: string
}
export interface WithdrawalRequest {
    driver_id: string,
    network: string,
    amount: number,
    pin: string

}
export interface ServiceInterface {
  merchantCatalogService: ExternalService;
}

export type SQSResponse = { batchItemFailures: { itemIdentifier: string }[] };

export interface CallbackResponseType {
  SUCCESS: Callback;
  DUPLICATE: Callback;
  ERROR: Callback;
}
export type Callback = {
  response_code: string;
  message: string;
};

export interface USSDRequest {
  sessionId?: string;
  userInput?: string;
  msisdn?: string;
  requestType?: string;
  currentMenu?: string;
  operator?: string;
  shortCode?: string;
}

export enum StateType {
  client = 'client',
  user = 'user',
}

export interface USSDState {
  current_menu: string;
  data: USSDRequest;
  flow: string;
  action: string;
}
export interface USSDFlows {
  main_menu: {};
}
export interface UserState {
  eligibilty?: boolean;
}
export interface Customer {
  eligibility: boolean;
  msisdn: string;
  pin: boolean;
  active: boolean;
}

export interface MenuProperties {
  class?: any;
  next?: string;
  customMessage?: string;
}

export interface Region {
  number?: number;
  region: { name: string; id: number };
}
