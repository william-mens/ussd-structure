import { getMenuContent } from '../menu-content.js';
import { endSession, ussdResponse } from '../responses.js';
import { setClientState } from '../states/client.state.js';
import { clearState } from '../states/ussd.state.js';
import { ConfigContainer, USSDRequest, USSDState } from '../types.js';
import { MenuOptions } from '../menu-options.js';
import { MenuNames } from '../menu-names.js';
import { ConfirmMenu } from './sub-menus/confirm-menu.js';

export class MainMenu {
  async index(
    container: ConfigContainer,
    request: USSDRequest,
    retryMessage: string = '',
  ) {
    const [state] = await Promise.allSettled([
      clearState(container.redis, request),
    ]);
    let content: string = await getMenuContent(MenuNames.main_menu, container); 
    await setClientState(container.redis, request, MenuNames.main_menu,MenuNames.main_menu);
    return ussdResponse(request, retryMessage + content);
  }
  async fire(
    state: USSDState,
    menu: string,
    request: USSDRequest,
    container: ConfigContainer
  ) {
     console.log({ menu });
  
    if (request.userInput == MenuOptions.accept) {
      const flow = MenuNames.confirm_screen;
      const next = MenuNames.confirm_screen;
      console.log("reached option one session");
      
      // container.logger.info(`${request.msisdn} user is on the ${flow} menu at ${new Date().toISOString().replace('T','').substring(0, 19)}`);
      const clientState = await setClientState(container.redis, request, next, flow);
      console.log("clientStateeeeeeeee",clientState);
      return new ConfirmMenu().fire(state, { next }, request, container);
    }

    if (request.userInput === MenuOptions.cancel) {
      return endSession(container,request,"goodbye see you again");
    }
    return this.index(container, request, 'Incorrect choice, please retry \n');
  }


}
