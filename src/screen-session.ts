import { goToMainMenu, mapToMenu } from './map-menus.js';
import { ussdResponse } from './responses.js';
import { setClientState } from './states/client.state.js';
import {
  ConfigContainer,
  MenuProperties,
  ResponseType,
  USSDRequest,
  USSDState,
} from './types.js';

export class ScreenSession {
  protected incorrectOptionMessage: string = '';
  protected menuName: string = '';
  public request: USSDRequest = {};
  public container: ConfigContainer | {} = {};
  protected properties: { next?: string; menu?: string } = {};
  async ask(container: ConfigContainer): Promise<ResponseType> {
    console.log({ container });
    return ussdResponse(
      this.request,
      `Sorry an error occured. Please try again${container.services?.merchantCatalogService.url}`
    );
  }

  public async fire(
    state: any = null,
    currentMenuProperties: MenuProperties,
    request: USSDRequest,
    container: ConfigContainer
  ): Promise<any> {
    this.request = request as USSDRequest;
    this.properties = currentMenuProperties;
    this.container = container;
    const next = this.properties.next as string;
    let response;
    if (this.shouldProcessUserInput()) {
      response = await this.processUserInput(next, state, request, container);
      return response;
    }
    response = await this.ask(container);
    return response;
  }
  protected async processUserInput(
    next: string,
    state: any,
    data: USSDRequest,
    container: ConfigContainer
  ): Promise<ResponseType> {
    console.log('No input to process. This is bad', {
      next,
      state,
      data,
      container,
    });
    return this.nextScreen(state, next, this.request, container);
  }
  private shouldProcessUserInput() {
    return this.request.currentMenu === this.menuName;
  }
  protected async nextScreen(
    state: USSDState,
    next: string,
    request: USSDRequest,
    container: ConfigContainer
  ) {
    await setClientState(container.redis, this.request, next, state.flow);
    if (next === 'main_menu' || next === 'ROOT') {
      return goToMainMenu(container, this.request);
    }
    return mapToMenu(state, next, request, container);
  }
  async reAsk(container: ConfigContainer,incorrectOptionMessage: string = 'Incorrect input, please retry.\n') {
    this.incorrectOptionMessage = incorrectOptionMessage;
    return this.ask(container);
  }
}
