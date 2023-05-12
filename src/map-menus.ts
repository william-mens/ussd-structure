import { MainMenu } from './menus/main.menu.js';
import { ConfigContainer, USSDRequest } from './types.js';
import { MenuNames } from './menu-names.js';
import { ConfirmMenu } from './menus/sub-menus/confirm-menu.js';

export const goToMainMenu = (
  container: ConfigContainer,
  request: USSDRequest
) => {
  return new MainMenu().index(container, request);
};

export const mapToMenu = async (
  state: any,
  next: string,
  request: USSDRequest,
  container: ConfigContainer
) => {
  const menu = await getMappings();
  console.log({
    menu: menu[state.flow][next],
  });
  const res = menu[state.flow][next];
  return new res['class']().fire(state, res, request, container);
};

const getMappings = async (): Promise<any> => {
  return {
    [MenuNames.main_menu]: {
      [MenuNames.main_menu]: { class: MainMenu, next: null },
    },
    //confirm screen
    [MenuNames.confirm_screen]: {
        [MenuNames.confirm_screen]: { 
          class: ConfirmMenu,
          next: ''
          },
    },
  };
};
