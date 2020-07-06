import type { Components } from '@skyra/discord-components-core/dist/types/components';

export const discordMessageGenerator = ({ author, avatar, bot, edited, roleColor, verified, content }: Partial<DiscordMessageOptions>) => `
<discord-message
	author="${author}"
	avatar="${avatar}"
	roleColor="${roleColor ?? '#259EEE'}"
	${edited ? 'edited' : ''}
	${bot ? 'bot' : ''}
	${verified ? 'verified' : ''}
>
	${content}
</discord-message>
`;

export const discordMessagesGenerator = ({ compactMode, lightTheme, content }: Partial<DiscordMessagesOptions>) => `
<discord-messages ${compactMode ? 'compact-mode' : ''} ${lightTheme ? 'light-theme' : ''}>
	${content}
</discord-messages>
`;

export const htmlGenerator = (content: string) => `
<!DOCTYPE html>
<html>
	<head>
		<script
			type="module"
			src="https://cdn.jsdelivr.net/npm/@skyra/discord-components-core@1.1.4/dist/skyra-discord-components-core/skyra-discord-components-core.esm.js"
		></script>
		<style>
			/* Whitney font face to match Discord */
			@font-face {
				font-family: Whitney;
				font-style: light;
				font-weight: 300;
				src: url(https://discord.com/assets/6c6374bad0b0b6d204d8d6dc4a18d820.woff) format('woff');
			}
			@font-face {
				font-family: Whitney;
				font-style: normal;
				font-weight: 500;
				src: url(https://discord.com/assets/e8acd7d9bf6207f99350ca9f9e23b168.woff) format('woff');
			}
			@font-face {
				font-family: Whitney;
				font-style: medium;
				font-weight: 600;
				src: url(https://discord.com/assets/3bdef1251a424500c1b3a78dea9b7e57.woff) format('woff');
			}
			@font-face {
				font-family: WhitneyMedium;
				font-style: medium;
				font-weight: 600;
				src: url(https://discord.com/assets/be0060dafb7a0e31d2a1ca17c0708636.woff) format('woff');
			}
			@font-face {
				font-family: Whitney;
				font-style: bold;
				font-weight: 700;
				src: url(https://discord.com/assets/8e12fb4f14d9c4592eb8ec9f22337b04.woff) format('woff');
			}

			/* Setting default CSS for Discord messages */
			.discord-message,
			.discord-messages {
				font-family: Whitney, Roboto, 'Helvetica Neue', Helvetica, Arial, sans-serif;
			}

			.discord-messages {
				border-radius: 0px;
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

type DiscordMessageOptions = DiscordContent & Components.DiscordMessage;
type DiscordMessagesOptions = DiscordContent & Components.DiscordMessages;
