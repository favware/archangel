import { CLIENT_OPTIONS } from '#root/config';
import { ExtendedHandler as EnGbHandler } from '#utils/Intl/EnGbHandler';
import { SapphireClient } from '@sapphire/framework';

export class ArchAngelClient extends SapphireClient {
  public override readonly EnGbHandler = new EnGbHandler();

  public constructor() {
    super(CLIENT_OPTIONS);
  }
}
