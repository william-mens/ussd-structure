import { SSM } from '@aws-sdk/client-ssm'; // ES Modules import
export class ssm {
  protected ssmClient: any;

  constructor() {
    this.ssmClient = new SSM({
      apiVersion: 'latest',
      region: process.env.AWS_REGION || 'eu-west-1',
    });
  }

  /**
   * @param {string}  parameterKey - The key of the parameter to fetch.
   * @returns {Promise<any>} This is the result
   */
  async getValueOfParameter(parameterKey: string): Promise<any> {
    const params = {
      Name: parameterKey,
      WithDecryption: true,
    };
    try {
      let parameterValue = await this.ssmClient.getParameter(params);
      console.log('Response from Param store', parameterValue);
      if (parameterValue.Parameter?.Value === undefined) {
        return '';
      }
      return parameterValue.Parameter.Value;
    } catch (error) {
      console.error('unable to retrieve parameter', error);
      return false;
    }
  }
}
