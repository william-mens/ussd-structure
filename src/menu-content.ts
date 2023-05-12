import { MenuNames } from './menu-names.js';
import { ConfigContainer } from './types.js';
export const menus = [
  // Onboarding
  {
    name: MenuNames.main_menu,
    content:
      'Welcome to your first ussd menu\n 1. confirm 2. cancel',
  },
  {
    name: MenuNames.confirm_screen,
    content:
      'Confirm screen here.',
  },
];
export const getMenuContent = async (
  menuName: string,
  container: ConfigContainer
): Promise<string> => {
  const menus = await fetchMenus(container);
  return menus[menuName];
};

const fetchMenus = async (container: ConfigContainer): Promise<any> => {
  let transformedMenus: {} = {};
   const menuFromCache = await container.redis.get('test_menu_uat');
    if (menuFromCache) {
      return JSON.parse(menuFromCache);
    }
   menus.forEach((menu: { name: string; content: string; }) => {
    const key: string = menu.name as string;
    transformedMenus = { [key]: menu.content, ...transformedMenus };
  });
  console.log("transformed Menus",transformedMenus);
  await container.redis.set('test_menu_uat',JSON.stringify(transformedMenus));
  return transformedMenus;
};
