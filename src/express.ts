import express from 'express';
import { ConfigContainer, USSDRequest } from './types.js';
import {loadConfig} from './dev-config.js';
import IndexController from './controllers/IndexController.js';
let container: ConfigContainer;
container  =  await loadConfig();
const IndexMethod = new IndexController();
const app = express();
app.use(express.json());

app.post('/ussd/main', async (req: { body: USSDRequest; }, res: { set: (arg0: string, arg1: string) => void; send: (arg0: string) => any; }) => {
  const container = await loadConfig();
  const response = await IndexMethod.index(container, req.body);
  res.set('Content-Type', 'application/json');
  return res.send(response.body);
});

app.listen(3000, () => {
  console.log('Listening on port 3000');
});
