import { URL } from 'url';

export const rootFolder = new URL('../../../', import.meta.url);
export const srcFolder = new URL('src/', rootFolder);

export const enum Emojis {
	Loading = '<a:_:730555789730775042>',
	GreenTick = '<:_:637706251253317669>',
	RedCross = '<:_:637706251257511973>'
}

export const LoadingMessages = [
	`${Emojis.Loading} Watching hamsters run...`,
	`${Emojis.Loading} Finding people at hide-and-seek...`,
	`${Emojis.Loading} Trying to figure out this command...`,
	`${Emojis.Loading} Fetching data from the cloud...`,
	`${Emojis.Loading} Calibrating lenses...`,
	`${Emojis.Loading} Playing rock, paper, scissors...`,
	`${Emojis.Loading} Tuning in to the right frequencies...`,
	`${Emojis.Loading} Reticulating splines...`
];

export const enum BrandingColors {
	Primary = 0x5b75b3,
	Secondary = 0xfffeff
}
