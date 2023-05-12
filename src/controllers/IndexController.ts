import { mapToMenu } from '../map-menus.js';
import { MainMenu } from '../menus/main.menu.js';
import { ussdResponse } from '../responses.js';
import { getClientState } from '../states/client.state.js';
import { ConfigContainer, ResponseType, USSDRequest } from '../types.js';
import  Catch from "../helpers/catch-exceptions.js";

export default class IndexController {
  @Catch
   async index (
    container: ConfigContainer,
    request: USSDRequest
  ): Promise<ResponseType> {
    if (this.isFirstRequest(request)) {
      const mainMenu = await new MainMenu().index(container, request);
      return mainMenu;
    }
    const clientState = await getClientState(container.redis, request);
    console.log({ clientState });
  
    if (clientState) {
      return mapToMenu(clientState, clientState.current_menu, request, container);
    }
    return ussdResponse(request, `Something went wrong. Please try again later`);
  };
  isFirstRequest(request: USSDRequest): boolean {
    return request.requestType === 'INITIATION';
  }
}

