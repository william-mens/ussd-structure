import { cancelMandateRequest, ChangeNextOfKinRequest, ChangePinRequest, CheckBalanceRequest, ClaimRequest, ConfigContainer, CreateDriverPinRequest, createPinResponse, lookupDriverResonse, PaymentCalculationRequest, ProductResponse, ResetDriverPinRequest, VoluntaryPaymentRequest, WithdrawalRequest } from "../types.js";
import { general } from '../helpers/general.js';
export class TaxigoApi  {
  private axiosRequests: general;
  private readonly taxigoDriverLookupKey:string;
  constructor() {
    this.axiosRequests = new general();
    this.taxigoDriverLookupKey = process.env.TAXIGO_DRIVER_LOOKUP_CACHE_KEY as string;
  }

  async lookupDriver(msisdn: string,container:ConfigContainer): Promise<lookupDriverResonse> {
    const baseUrl = container.credentials.taxigoUrl.concat(`/drivers/${msisdn}`);
     const retrieveLookUpDriverCache = await container.redis.get(this.taxigoDriverLookupKey.concat(`-${msisdn}`));
      if (retrieveLookUpDriverCache) {
        return JSON.parse(retrieveLookUpDriverCache);
      }
    const lookup = await this.axiosRequests.makeGetRequest(baseUrl,container.credentials.taxigoApiKey as string);
    if (Object.prototype.hasOwnProperty.call(lookup, "status")) {
      if (lookup.status == 200) {
        console.log(`got a success response from external api-lookup driver when performing lookup`, { data: lookup.data });
        await container.redis.set(this.taxigoDriverLookupKey.concat(`-${msisdn}`),JSON.stringify(lookup.data),'EX',process.env.TAXIGO_LOOK_UP_CACHE_EXPIRY as string);
        return lookup.data;
      }else if(lookup.status == 404){
        console.log(`failed to get a successful response from external api *create driver pin* when creating driver pin`, { error: lookup });
        return lookup.message;
      }
      console.log(`failed to get a success response from external api-lookup driver when performing lookup`, { error: lookup });
      return null!;
    } else {
        console.log(`failed to get a success response from external api-lookup driver when performing lookup`, { error: lookup });
        return null!;
    }
  }

  async createDriverPin(driverPin: CreateDriverPinRequest,container:ConfigContainer) {
    const baseUrl = container.credentials.taxigoUrl.concat(`/drivers/create-pin`);
    container.logger.info(`About to make API call to taxigo-ussd-api create-pin endpoints to create a pin  at ${new Date().toISOString().replace('T','').substring(0, 19)}`,{request:driverPin});
    const setupDriver = await this.axiosRequests.makePostRequest(baseUrl, container.credentials.taxigoApiKey as string, driverPin);
    if (Object.prototype.hasOwnProperty.call(setupDriver, "status")) {
      if (setupDriver.status == 200) {
        container.logger.info(`API call successfully made to the create-pin endpoints to create a pin  at ${new Date().toISOString().replace('T','').substring(0, 19)}`,{response:setupDriver});
        return setupDriver.data;
      }
      container.logger.info(`Error from the create-pin endpoints to create a pin  at ${new Date().toISOString().replace('T','').substring(0, 19)}`,{error:setupDriver});
      if (setupDriver.status == 409) {
        return setupDriver.message;
      }
    } else {
      container.logger.error(`Error from the create-pin endpoints to create a pin  at ${new Date().toISOString().replace('T','').substring(0, 19)}`,{error:setupDriver});
      return null!;
    }
  }

  async resetDriverPin(resetPin: ResetDriverPinRequest,container:ConfigContainer) {
    const baseUrl = container.credentials.taxigoUrl.concat(`/drivers/reset-pin`);
    const resetPinResponse = await this.axiosRequests.makePostRequest(baseUrl, container.credentials.taxigoApiKey as string, resetPin);
    if (Object.prototype.hasOwnProperty.call(resetPinResponse, "status")) {
      if (resetPinResponse.status == 200) {
        console.log(`successfully got response from external api *reset driver pin* when resetting driver pin`, { data: resetPinResponse });
        return resetPinResponse;
      }
      if (resetPinResponse.status == 404) {
        console.log(`failed to get a success response from external api *check balance* when checking balance`, { data: resetPinResponse });
        return resetPinResponse.message;
      }
    } else {
      console.log(`an error occurred when call external api *resetting driver pin*`, { error: resetPinResponse });
      return null!;
    }
  }

  async changePin(resetPin: ChangePinRequest,container:ConfigContainer) {
    const baseUrl = container.credentials.taxigoUrl.concat(`/drivers/change-pin`);
    const changePinResponse = await this.axiosRequests.makePutRequest(baseUrl, container.credentials.taxigoApiKey as string, resetPin);
    if (Object.prototype.hasOwnProperty.call(changePinResponse, "status")) {
      if (changePinResponse.status == 200) {
        console.log(`successfully got response from external api *change driver pin* when changing driver pin`, { data: changePinResponse });
        return changePinResponse;
      }
      if (changePinResponse.status == 400) {
        console.log(`failed to get a success response from external api *change driver pin* when changing driver pin`, { data: changePinResponse });
        return changePinResponse.message;
      }
      if (changePinResponse.status == 401) {
        console.log(`failed to get a success response from external api *change driver pin* when changing driver pin`, { data: changePinResponse });
        return changePinResponse.message;
      }
    } else {
      console.log(`an error occurred when call external api *change driver pin*`, { error: changePinResponse });
      return null!;
    }
  }

  async changeNextOfKin(nextKin: ChangeNextOfKinRequest,container:ConfigContainer) {
    console.log(`about to make a call to *update next of kin api* to updates driver next of kin information`, { data: nextKin });
    const baseUrl = container.credentials.taxigoUrl.concat(`/drivers/update-beneficiary`);
    const nextOfKinResponse = await this.axiosRequests.makePutRequest(baseUrl, container.credentials.taxigoApiKey as string, nextKin);
    if (Object.prototype.hasOwnProperty.call(nextOfKinResponse, "status")) {
      if (nextOfKinResponse.status == 200) {
        console.log(`successfully got response from external api *update next of kin* when updating next of kin`, { data: nextOfKinResponse });
        return nextOfKinResponse.data;
      }
      if (nextOfKinResponse.status == 404) {
        console.log(`failed to get a successful response from external api *update next of kin* when updating next of kin`, { data: nextOfKinResponse });
        return nextOfKinResponse.message;
      }
      if (nextOfKinResponse.status == 400) {
        console.log(`failed to get a successful response from external api *update next of kin* when updating next of kin`, { data: nextOfKinResponse });
        return nextOfKinResponse.message;
      }
      if (nextOfKinResponse.status == 401) {
        console.log(`failed to get a successful response from external api *update next of kin* when updating next of kin`, { data: nextOfKinResponse });
        return nextOfKinResponse.message;
      }
    } else {
      console.log(`an error occurred when call external api * updating next of kin*`, { error: nextOfKinResponse });
    }
  }
  
  async products(container:ConfigContainer): Promise<ProductResponse[]> {
    const baseUrl = container.credentials.taxigoUrl.concat(`/products`);
    container.logger.info(`About to make API call to taxigo-ussd-api products endpoint to get products  at ${new Date().toISOString().replace('T','').substring(0, 19)}`);
    const retrieveProductCache = await container.redis.get(process.env.TAXIGO_PRODUCT_CACHE_KEY as string);
    if (retrieveProductCache) {
       return JSON.parse(retrieveProductCache);
    }
    const productsResponse = await this.axiosRequests.makeGetRequest(baseUrl, container.credentials.taxigoApiKey as string);
    if (Object.prototype.hasOwnProperty.call(productsResponse, "status")) {
      if (productsResponse.status == 200) {
        console.log(`successfully got response from external api *products* when retrieving products`, { data: productsResponse });
        await container.redis.set(process.env.TAXIGO_PRODUCT_CACHE_KEY as string ,JSON.stringify(productsResponse.data),'EX',process.env.PRODUCT_CACHE_EXPIRY_TIME as string);
        return productsResponse.data;
      }
      if (productsResponse.status == 404) {
        console.log(`failed to get a success response from external api *products* when retrieving products`, { data: productsResponse });
        return [];
      }
      console.log(`an error occurred when call external api *products*`, { error: productsResponse });
    } 
      console.log(`an error occurred when call external api *products*`, { error: productsResponse });
      return null!;
  }

  async voluntaryProducts(container:ConfigContainer): Promise<ProductResponse[]> {
    const baseUrl = container.credentials.taxigoUrl.concat(`/products/voluntary-payments`);
    container.logger.info(`About to make API call to taxigo-ussd-api product-voluntary-payments endpoint to get voluntary products  at ${new Date().toISOString().replace('T','').substring(0, 19)}`);

    const voluntaryProductCache = await container.redis.get(process.env.TAXIGO_VOLUNTARY_PRODUCT_CACHE_KEY as string);
    if (voluntaryProductCache) {
       return JSON.parse(voluntaryProductCache);
    }

    const voluntaryProductResponse = await this.axiosRequests.makeGetRequest(baseUrl, container.credentials.taxigoApiKey as string);
    if (Object.prototype.hasOwnProperty.call(voluntaryProductResponse, "status")) {
      if (voluntaryProductResponse.status == 200) {
        container.logger.info(`API call successfully made to the taxigo-ussd-api product-voluntary-payments endpoint to get voluntary products  at ${new Date().toISOString().replace('T','').substring(0, 19)}`,{response:voluntaryProductResponse});
        await container.redis.set(process.env.TAXIGO_VOLUNTARY_PRODUCT_CACHE_KEY as string ,JSON.stringify(voluntaryProductResponse.data),'EX',process.env.PRODUCT_CACHE_EXPIRY_TIME as string);
        return voluntaryProductResponse.data;
      }
        container.logger.info(`Error from the taxigo-ussd-api product-voluntary-payments endpoint to get voluntary products at ${new Date().toISOString().replace('T','').substring(0, 19)}`,{error:voluntaryProductResponse});
      if (voluntaryProductResponse.status == 404) {
        return [];
      }
    } 
      container.logger.error(`Error from the taxigo-ussd-api product-voluntary-payments endpoint to get voluntary products at ${new Date().toISOString().replace('T','').substring(0, 19)}`,{error:voluntaryProductResponse});
      return null!;
  }

  async productClaims(container:ConfigContainer): Promise<ProductResponse[]> {
    const baseUrl = container.credentials.taxigoUrl.concat(`/products/claims`);
    container.logger.info(`About to make API call to taxigo-ussd-api product-claims endpoint to get products claim at ${new Date().toISOString().replace('T','').substring(0, 19)}`);
    const claimProductCache = await container.redis.get(process.env.TAXIGO_CLAIM_PRODUCT_CACHE_KEY as string);
    if (claimProductCache) {
       return JSON.parse(claimProductCache);
    }
    
    const claimProductResponse = await this.axiosRequests.makeGetRequest(baseUrl, container.credentials.taxigoApiKey as string);
    if (Object.prototype.hasOwnProperty.call(claimProductResponse, "status")) {
      if (claimProductResponse.status == 200) {
        container.logger.info(`API call successfully made to the taxigo-ussd-api product-claims endpoint to get products claims  at ${new Date().toISOString().replace('T','').substring(0, 19)}`,{response:claimProductResponse});
        await container.redis.set(process.env.TAXIGO_VOLUNTARY_PRODUCT_CACHE_KEY as string ,JSON.stringify(claimProductResponse.data),'EX',process.env.PRODUCT_CACHE_EXPIRY_TIME as string);
        return claimProductResponse.data;
      }
      container.logger.info(`Error from the taxigo-ussd-api product-claims  endpoint to get products claims at ${new Date().toISOString().replace('T','').substring(0, 19)}`,{error:claimProductResponse});
      if (claimProductResponse.status == 404) {
        console.log(`failed to get a success response from external api *products-claims* when retrieving  product claims`, { data: claimProductResponse });
        return [];
      }
    } 
     container.logger.info(`Error from the taxigo-ussd-api product-claims  endpoint to get products claims at ${new Date().toISOString().replace('T','').substring(0, 19)}`,{error:claimProductResponse});
      return null!;
  }

  async checkBalance(balance: CheckBalanceRequest,container:ConfigContainer) {
    const baseUrl = container.credentials.taxigoUrl.concat(`/check-balance`);
    container.logger.info(`About to make API call to taxigo-ussd-api check-balance endpoint to get driver's balance at ${new Date().toISOString().replace('T','').substring(0, 19)}`,{requests:balance});
    const checkBalanceResponse = await this.axiosRequests.makePostRequest(baseUrl, container.credentials.taxigoApiKey as string, balance);
    if (Object.prototype.hasOwnProperty.call(checkBalanceResponse, "status")) {
      if (checkBalanceResponse.status == 200) {
        container.logger.info(`API call successfully made to the taxigo-ussd-api check-balance endpoint to get driver's balance at ${new Date().toISOString().replace('T','').substring(0, 19)}`,{response:checkBalanceResponse});
        return checkBalanceResponse.data;
      }
       container.logger.info(`Error from the taxigo-ussd-api check-balance endpoint to get driver's balance  at ${new Date().toISOString().replace('T','').substring(0, 19)}`,{error:checkBalanceResponse});
      if (checkBalanceResponse.status == 401) {
        return checkBalanceResponse.message;
      }
    } else {
      container.logger.error(`Error from the taxigo-ussd-api check-balance endpoint to get driver's balance  at ${new Date().toISOString().replace('T','').substring(0, 19)}`,{error:checkBalanceResponse});
      return null!;
    }
  }

  async voluntaryPayments(payments: VoluntaryPaymentRequest,container:ConfigContainer) {
    const baseUrl = container.credentials.taxigoUrl.concat(`/payments/voluntary`);
    container.logger.info(`About to make API call to taxigo-ussd-api payments-voluntary endpoint to make payments  at ${new Date().toISOString().replace('T','').substring(0, 19)}`,{requests:payments});
    const voluntaryPaymentResponse = await this.axiosRequests.makePostRequest(baseUrl, container.credentials.taxigoApiKey as string, payments);
    if (Object.prototype.hasOwnProperty.call(voluntaryPaymentResponse, "status")) {
      if (voluntaryPaymentResponse.status == 200) {
        console.log(`successfully got response from external api *voluntary payments* when making voluntary payments`, { data: voluntaryPaymentResponse });
        container.logger.info(`API call successfully made to the taxigo-ussd-api payments-voluntary endpoint to make payments at ${new Date().toISOString().replace('T','').substring(0, 19)}`,{response:voluntaryPaymentResponse});
        return voluntaryPaymentResponse.data;
      }
      container.logger.info(`Error from the taxigo-ussd-api payments-voluntary endpoint to make payments at ${new Date().toISOString().replace('T','').substring(0, 19)}`,{error:voluntaryPaymentResponse});
      if (voluntaryPaymentResponse.status == 401) {
        return voluntaryPaymentResponse.message;
      }
    } else {
      container.logger.error(`Error from the taxigo-ussd-api payments-voluntary endpoint to make payments at ${new Date().toISOString().replace('T','').substring(0, 19)}`,{error:voluntaryPaymentResponse});
      return null!;
    }
  }

  async cancelMandate(payments: cancelMandateRequest,container:ConfigContainer) {
    const baseUrl = container.credentials.taxigoUrl.concat(`/cancel-mandate`);
    const cancelMandateResponse = await this.axiosRequests.makePostRequest(baseUrl, container.credentials.taxigoApiKey as string, payments);
    if (Object.prototype.hasOwnProperty.call(cancelMandateResponse, "status")) {
      if (cancelMandateResponse.status == 200) {
        console.log(`successfully got response from external api *create driver pin* when creating driver pin`, { data: cancelMandateResponse });
        return cancelMandateResponse;
      }
      if (cancelMandateResponse.status == 401) {
        console.log(`failed to get a success response from external api *withdrawals* when driver is making a withdrawal`, { data: cancelMandateResponse.message });
        return cancelMandateResponse.message;
      }
      console.log(`an error occurred when call external api *cancel manadate*`, { error: cancelMandateResponse });
    } else {
      console.log(`an error occurred when call external api *cancel manadate*`, { error: cancelMandateResponse });
      return null!;
    }
  }

  async paymentsCalculation(payments: PaymentCalculationRequest,container:ConfigContainer) {
    container.logger.info(`About to make API call to taxigo-ussd-api product-voluntary-calculation endpoint to get voluntary product breakdown  at ${new Date().toISOString().replace('T','').substring(0, 19)}`,{requests:payments}); 
    const baseUrl = container.credentials.taxigoUrl.concat(`/payments/voluntary/calculation`);
    const voluntaryPaymentCalculationResponse = await this.axiosRequests.makePostRequest(baseUrl, container.credentials.taxigoApiKey as string, payments);
    if (Object.prototype.hasOwnProperty.call(voluntaryPaymentCalculationResponse, "status")) {
      if (voluntaryPaymentCalculationResponse.status == 200) {
        console.log(`successfully got response from external api *payment voluntary calculation* when displaying driver voluntary calculation`, { data: voluntaryPaymentCalculationResponse });
        container.logger.info(`API call successfully made to the taxigo-ussd-api product-voluntary-calculation endpoint to get voluntary products breakdown at ${new Date().toISOString().replace('T','').substring(0, 19)}`,{response:voluntaryPaymentCalculationResponse});
        return voluntaryPaymentCalculationResponse.data;
      }
      container.logger.info(`Error from the taxigo-ussd-api product-voluntary-calculation endpoint to get voluntary products at ${new Date().toISOString().replace('T','').substring(0, 19)}`,{error:voluntaryPaymentCalculationResponse});
    } else {
      container.logger.error(`Error from the taxigo-ussd-api product-voluntary-calculationt endpoint to get voluntary products at ${new Date().toISOString().replace('T','').substring(0, 19)}`,{error:voluntaryPaymentCalculationResponse});
      return null!;
    }
  }

  async withdrawals(payments: WithdrawalRequest,container:ConfigContainer) {
    const baseUrl = container.credentials.taxigoUrl.concat(`/withdrawals`);
    container.logger.info(`About to make API call to taxigo-ussd-api withdrawals endpoint to make a withdrawal at ${new Date().toISOString().replace('T','').substring(0, 19)}`,{requests:payments});
    const withdrawalResponse = await this.axiosRequests.makePostRequest(baseUrl, container.credentials.taxigoApiKey as string, payments);
    if (Object.prototype.hasOwnProperty.call(withdrawalResponse, "status")) {
      if (withdrawalResponse.status == 200) {
        container.logger.info(`API call successfully made to the taxigo-ussd-api withdrawals endpoint at ${new Date().toISOString().replace('T','').substring(0, 19)}`,{response:withdrawalResponse});
        return withdrawalResponse.data;
      }
      container.logger.info(`Error from the taxigo-ussd-api withdrawals endpoint to make withdrawals at ${new Date().toISOString().replace('T','').substring(0, 19)}`,{error:withdrawalResponse});
      if (withdrawalResponse.status == 401) {
        return withdrawalResponse.message;
      }
    } else {
      container.logger.error(`Error from the taxigo-ussd-api withdrawals endpoint to get withdrawals at ${new Date().toISOString().replace('T','').substring(0, 19)}`,{error:withdrawalResponse});
      return null!;
    }
  }
  //make claims
 async claims(claims:ClaimRequest,container:ConfigContainer){
  const baseUrl = container.credentials.taxigoUrl.concat(`/claims`);
  container.logger.info(`About to make API call to taxigo-ussd-api claim endpoint to submit claims at ${new Date().toISOString().replace('T','').substring(0, 19)}`,{requests:claims});
  const claimResponse = await this.axiosRequests.makePostRequest(baseUrl, container.credentials.taxigoApiKey as string, claims);
  if (Object.prototype.hasOwnProperty.call(claimResponse, "status")) {
    if (claimResponse.status == 200) {
      container.logger.info(`API call successfully made to the taxigo-ussd-api claims endpoint to submit claims at ${new Date().toISOString().replace('T','').substring(0, 19)}`,{response:claimResponse});
      return claimResponse.data;
    }
    container.logger.info(`Error from the taxigo-ussd-api claims endpoint to submit claims at ${new Date().toISOString().replace('T','').substring(0, 19)}`,{error:claimResponse});
    if (claimResponse.status == 401) {
      console.log(`failed to get a success response from external api *claims* when driver made a claim`, { data: claimResponse.message });
      return claimResponse.message;
     }
  } else {
    container.logger.error(`Error from the taxigo-ussd-api claims endpoint to submit claims at ${new Date().toISOString().replace('T','').substring(0, 19)}`,{error:claimResponse});
    return null!;
  }
}


}
