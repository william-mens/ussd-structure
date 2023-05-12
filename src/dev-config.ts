import Redis from "ioredis";
import { Sequelize } from 'sequelize';


const configurationFromParamStore = () =>{
    return {
        redisPort:'6379',
        redisHost: '127.0.0.1',
        redisPassword: '',
        host:'',
        user:'',
        password:'',
        database: '',
        taxigoUrl:''
    } 
}

 const loadRedis = async () => {
   
 const {redisPort,redisHost} =  configurationFromParamStore();
  const redis = new Redis({
    port: Number(redisPort) as number,
    host:redisHost
  });
  return redis;
};

const loadDB = async () => {
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
    return db;
  };

export const loadConfig = async() =>{
   return {
      db:  await loadDB(),
      redis: await loadRedis(),
      credentials:  configurationFromParamStore()
   }
}