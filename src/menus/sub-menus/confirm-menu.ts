import { ScreenSession } from '../../screen-session.js';
import { MenuNames } from '../../menu-names.js';
import { ConfigContainer, ResponseType } from '../../types.js';
import { getMenuContent } from '../../menu-content.js';
import { endSession } from '../../responses.js';

export class ConfirmMenu extends ScreenSession {
    protected menuName: string = MenuNames.confirm_screen;
    async ask(container: ConfigContainer): Promise<ResponseType> {
      const content: string = await getMenuContent(this.menuName, container);
      return endSession(container,this.request,content, this.menuName);
    }
  }