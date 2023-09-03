import { BrandingColors } from '#utils/constants';
import { getAttachment, oneLine } from '#utils/util';
import type { Components } from '@skyra/discord-components-core';
import { marked as markdownToHtml } from 'marked';
import { markedSmartypants } from 'marked-smartypants';
import { markedXhtml } from 'marked-xhtml';

markdownToHtml.use(markedXhtml());
markdownToHtml.use(markedSmartypants());
markdownToHtml.setOptions({ breaks: false });

export const discordMessageGenerator = ({
  author,
  avatar,
  bot,
  edited,
  roleColor,
  verified,
  timestamp,
  content,
  image
}: Omit<DiscordMessageOptions, 'profile' | 'op' | 'roleIcon' | 'roleName'>) => {
  let htmlContent = markdownToHtml(content);
  if (image !== null)
    htmlContent += [
      `<discord-attachment
						slot="attachments"
						url="${image.proxyURL ?? image.url}"
						height="${image.height}"
						width="${image.width}"
						alt="discord-attachment"
				/>`
    ].join(' ');

  return oneLine(`
		<discord-message
			author="${author}"
			avatar="${avatar}"
			role-color="${roleColor ?? `#${BrandingColors.Secondary}`}"
			timestamp="${timestamp}"
			${edited ? 'edited' : null}
			${bot ? 'bot' : null}
			${verified ? 'verified' : null}
		>${htmlContent}</discord-message>
`);
};

export const discordMessagesGenerator = ({ compactMode, lightTheme, content }: Partial<DiscordMessagesOptions>) => `
<discord-messages ${compactMode ? 'compact-mode' : null} ${lightTheme ? 'light-theme' : null}>
	${content}
</discord-messages>
`;

export const htmlGenerator = (content: string) => `
<!DOCTYPE html>
<html>
  <head>
    <script
      type="module"
      src="https://unpkg.com/@skyra/discord-components-core@3.6.1/dist/skyra-discord-components-core/skyra-discord-components-core.esm.js"
    ></script>
    <style>
      .discord-messages {
        border-radius: 0px;
      }

      code {
        background: #2f3136;
        border-radius: 3px;
        border: none;
        font-family: Consolas, Andale Mono WT, Andale Mono, Lucida Console,
          Lucida Sans Typewriter, DejaVu Sans Mono, Bitstream Vera Sans Mono,
          Liberation Mono, Nimbus Mono L, Monaco, Courier New, Courier,
          monospace;
        font-size: 85%;
        margin: -0.2em 0;
        padding: 0.2em;
        text-indent: 0;
        white-space: pre-wrap;
      }

      pre {
        margin: 0;
        border: 0;
        border-radius: 4px;
        padding: 0;
        font-family: Consolas, Andale Mono WT, Andale Mono, Lucida Console,
          Lucida Sans Typewriter, DejaVu Sans Mono, Bitstream Vera Sans Mono,
          Liberation Mono, Nimbus Mono L, Monaco, Courier New, Courier,
          monospace;
        font-size: 0.75rem;
        line-height: 1rem;
        margin-top: 6px;
        white-space: pre-wrap;
        background-clip: border-box;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        max-width: 90%;
      }

      pre > code {
        overflow-x: auto;
        border-radius: 4px;
        color: #b9bbbe;
        display: block;
        padding: 0.5em;
        -webkit-text-size-adjust: none;
        -moz-text-size-adjust: none;
        -ms-text-size-adjust: none;
        text-size-adjust: none;
        font-size: 0.875rem;
        line-height: 1.125rem;
        text-indent: 0;
        white-space: pre-wrap;
        scrollbar-width: thin;
        scrollbar-color: #202225 #2f3136;
        background: #2f3136;
        border: 1px solid #202225;
      }
    </style>
  </head>
  <body>
    ${content}
  </body>
</html>
`;

interface DiscordContent {
  /**
   * Content of the Discord Messages component
   */
  content: string;
}

interface DiscordMessageExtraData extends DiscordContent {
  /**
   * The image to include in the message
   */
  image: ReturnType<typeof getAttachment>;
}

type DiscordMessageOptions = DiscordMessageExtraData & Components.DiscordMessage;
type DiscordMessagesOptions = DiscordContent & Components.DiscordMessages;
