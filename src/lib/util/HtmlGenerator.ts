import type { Components } from '@skyra/discord-components-core/dist/types/components';
import markdownToHtml from 'marked';
import type { getAttachment } from './util';

markdownToHtml.setOptions({
	breaks: false,
	headerIds: false,
	smartLists: false,
	smartypants: true,
	xhtml: true
});

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
}: Omit<DiscordMessageOptions, 'profile'>) => {
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

	return `
		<discord-message
			author="${author}"
			avatar="${avatar}"
			role-color="${roleColor ?? '#259EEE'}"
			timestamp=${timestamp}
			${edited ? 'edited' : null}
			${bot ? 'bot' : null}
			${verified ? 'verified' : null}
		>
			${htmlContent}
		</discord-message>
`;
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
      src="https://cdn.jsdelivr.net/npm/@skyra/discord-components-core/dist/skyra-discord-components-core/skyra-discord-components-core.esm.js"
    ></script>
    <style>
      /* Whitney font face to match Discord */
      @font-face {
        font-family: Whitney;
        font-style: light;
        font-weight: 300;
        src: url(https://discord.com/assets/6c6374bad0b0b6d204d8d6dc4a18d820.woff)
          format("woff");
      }
      @font-face {
        font-family: Whitney;
        font-style: normal;
        font-weight: 500;
        src: url(https://discord.com/assets/e8acd7d9bf6207f99350ca9f9e23b168.woff)
          format("woff");
      }
      @font-face {
        font-family: Whitney;
        font-style: medium;
        font-weight: 600;
        src: url(https://discord.com/assets/3bdef1251a424500c1b3a78dea9b7e57.woff)
          format("woff");
      }
      @font-face {
        font-family: WhitneyMedium;
        font-style: medium;
        font-weight: 600;
        src: url(https://discord.com/assets/be0060dafb7a0e31d2a1ca17c0708636.woff)
          format("woff");
      }
      @font-face {
        font-family: Whitney;
        font-style: bold;
        font-weight: 700;
        src: url(https://discord.com/assets/8e12fb4f14d9c4592eb8ec9f22337b04.woff)
          format("woff");
      }

      /* Setting default CSS for Discord messages */
      .discord-message,
      .discord-messages {
        font-family: Whitney, Roboto, "Helvetica Neue", Helvetica, Arial,
          sans-serif;
      }

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
