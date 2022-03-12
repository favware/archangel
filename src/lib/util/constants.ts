import { URL } from 'node:url';

export const rootFolder = new URL('../../../', import.meta.url);
export const srcFolder = new URL('src/', rootFolder);

export const enum BrandingColors {
	Primary = 0x5b75b3,
	Secondary = 0xfffeff
}
