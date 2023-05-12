import * as router from 'aws-lambda-router';
import { ConfigContainer } from './types.js';
import {loadConfig} from './config.js';
import IndexController from './controllers/IndexController.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { Logger } = require('@aws-lambda-powertools/logger');
const logger = new Logger({ serviceName: process.env.TAXIGO_SERVICE_LOGS as string});
let container: ConfigContainer;
container  =  await loadConfig();
const IndexMethod = new IndexController();

export const handler:any = router.handler({
  proxyIntegration: {
    routes: [
      {
        path: '/ussd/main',
        method: 'POST',
        action: async (event: any,context:any) => {
          logger.addContext(context);
          container.logger = logger;
          const response = await IndexMethod.index(container, event.body);
          return response;
        },
      },
    ],
    debug: false,
    errorMapping: {
      NotFound: 404,
      MyCustomError: 429,
      ServerError: 500,
    },
  },
});
