import axios from "axios";
export class general {
  /**
   * @param {string}  url - The full url the request is going to
   * @param {object}  requestData - Extra request parameters.
   * @returns {Promise<any>} This is the result
   */
  async makeGetRequest(url: string, apiKey: string): Promise<object | any> {
    console.log(`Received request: url ${url}`);
    const config = {
      headers: {
        api_key: apiKey,
      },
    };
    try {
      const getResponse = await axios.get(url, config);
      console.log("HTTP GET RESPONSE", getResponse.data);
      return getResponse.data;
    } catch (error:any) {
      if (axios.isAxiosError(error)) {
        console.log("error message: ", error.response?.data);
        if (error && error.response?.status === 409) {
          return error.response?.data;
        }
        if (error && error.response?.status == 401) {
          return error.response?.data;
        }
        if (error && error.response?.status == 404) {
          return error.response?.data;
        }
        return {};
      } else if (error instanceof Error) {
        console.log("unexpected error: ", error.message);
        return { error: error.message };
      }
    }
    return false;
  }
  /**
   * @param {string}  url - The full url the request is going to
   * @param {object}  requestData - Extra request parameters.
   * @returns {Promise<object | undefined>} This is the result
   */
  async makePostRequest(
    url: string,
    apiKey: string,
    requestData?: object
  ): Promise<any> {
    console.log(`Received request: url ${url} `, requestData);
    const config = {
      headers: {
        api_key: apiKey,
      },
    };
    try {
      const postResponse = await axios.post(url, requestData, config);
      console.log("HTTP POST RESPONSE", postResponse.data);
      return postResponse.data;
    } catch (error:any) {
      if (axios.isAxiosError(error)) {
        console.log("error message: ", error);
        if (error && error.response?.status === 409) {
          return error.response?.data;
        }
        if (error && error.response?.status == 401) {
          return error.response?.data;
        }
        if (error && error.response?.status == 404) {
          return error.response?.data;
        }
        return {};
      } else if (error instanceof Error) {
        console.log("unexpected error: ", error.message);
        return { error: error.message };
      }
    }
    return {};
  }

  /**
   * @param {string}  url - The full url the request is going to
   * @param {object}  requestData - Extra request parameters.
   * @returns {Promise<object | undefined>} This is the result
   */
  async makePutRequest(
    url: string,
    apiKey: string,
    requestData?: object
  ): Promise<any> {
    console.log(`Received request: url ${url} `, requestData);
    const config = {
      headers: {
        api_key: apiKey,
      },
    };
    try {
      const postResponse = await axios.put(url, requestData, config);
      console.log("HTTP POST RESPONSE", postResponse.data);
      return postResponse.data;
    } catch (error:any) {
      if (axios.isAxiosError(error)) {
        console.log("error message: ", error);
        if (error && error.response?.status === 409) {
          return error.response?.data;
        }
        if (error && error.response?.status == 401) {
          return error.response?.data;
        }
        if (error && error.response?.status == 404) {
          return error.response?.data;
        }
        if (error && error.response?.status == 400) {
          return error.response?.data;
        }
        return {};
      } else if (error instanceof Error) {
        console.log("unexpected error: ", error.message);
        return { error: error.message };
      }
    }
    return {};
  }
}
