import Redis from 'ioredis';
import { Sequelize } from 'sequelize';
import { ssm } from './ssm.js';
import { Configs, ExternalService, ServiceInterface } from './types.js';
const environment = process.env.NODE_ENV || 'development';
import { getParamsFromStore } from './ssms.js';
console.log({ environment });
let cachedParamStore: any, config = {} as Configs, params: string[],redisConnection:any,dbConnection:any;
const configurationFromParamStore = async () => {
  params = [
    process.env.DB_HOST  as string,
    process.env.DB_PASSWORD  as string,
    process.env.DB_USER  as string,
    process.env.DB  as string,
    process.env.REDIS_PORT as string,
    process.env.REDIS_HOST as string,
    process.env.TAXIGO_API_URL as string,
    process.env.TAXIGO_API_KEY as string,
    process.env.REDIS_PASSWORD as string
  ];
  if (cachedParamStore) {
    return cachedParamStore;
  }
  const data = await getParamsFromStore(params);
  const results =  data.Parameters; //data.Parameters dont forget
     console.log('successfully retrieved records for parameter store', results);
    if (Array.isArray(results) && results.length > 0) {
      for (const iterator of results) {
        // console.log('successfully true condition ', iterator);
        switch (iterator.Name) {
          case process.env.DB_HOST as string:
            config.host = iterator.Value as string;
            break;
          case process.env.DB_PASSWORD as string:
            config.password = iterator.Value as string;
            break;
          case process.env.DB_USER as string:
            config.user = iterator.Value as string;
            break;
          case process.env.DB as string:
            config.database = iterator.Value as string;
            break;
          case process.env.REDIS_PORT  as string:
            config.redisPort = iterator.Value as string;
            break;
          case process.env.REDIS_HOST  as string:
            config.redisHost = iterator.Value as string;
            break;
            case process.env.REDIS_PASSWORD as string:
              config.redisPassword = iterator.Value as string;
              break;
          case process.env.TAXIGO_API_URL as string:
              config.taxigoUrl = iterator.Value as string;
              break;
          case process.env.TAXIGO_API_KEY  as string:
              config.taxigoApiKey = iterator.Value as string;
              break;
        }
      }
       console.log('successfully retrieved records for config', config);
      cachedParamStore = config;
      return config;
    } else{
        console.error('no data retreived from param store returned empty',results);
        return;
    }
  
}

const loadRedis = async () => {
    if (redisConnection) {
      console.log('cached redis connection instance');
      return redisConnection;
    }
 const {redisPort,redisHost,redisPassword} = await configurationFromParamStore();
  const redis = new Redis({
    port: redisPort,
    host:redisHost,
    username: process.env.REDIS_USERNAME,
    password:redisPassword
  });
  redisConnection = redis;
  return redis;
};
const loadDB = async () => {
  if (dbConnection) {
    console.log('cached connection instance');
    return dbConnection;
  }
  const {host,user,password,database} =  await configurationFromParamStore();
  const db = new Sequelize('', '', '', {
    dialect: 'mysql',
    logging: false,
    define: {
      timestamps: false,
    },
    hooks: {
      beforeConnect: async (config) => {
        config.database = database;
        config.host = host;
        config.username = user;
        config.password = password;
      },
    },
  });
  dbConnection = db;
  return db;
};
export const loadConfig = async() =>{
   return {
      db:  await loadDB(),
      redis: await loadRedis(),
      credentials: await configurationFromParamStore()
   }
}