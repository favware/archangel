import { envParseArray } from '@skyra/env-utilities';
import type { Message } from 'discord.js';

export function getGuildIds(): string[] {
  return envParseArray('COMMAND_GUILD_IDS', []);
}

/**
 * Image extensions:
 * - bmp
 * - jpg
 * - jpeg
 * - png
 * - gif
 * - webp
 */
export const IMAGE_EXTENSION = /\.(bmp|jpe?g|png|gif|webp)$/i;

export interface ImageAttachment {
  url: string;
  proxyURL: string;
  height: number;
  width: number;
}

/**
 * Get a image attachment from a message.
 * @param message The Message instance to get the image url from
 */
export function getAttachment(message: Message): ImageAttachment | null {
  if (message.attachments.size) {
    const attachment = message.attachments.find((att) => IMAGE_EXTENSION.test(att.url));
    if (attachment) {
      return {
        url: attachment.url,
        proxyURL: attachment.proxyURL,
        height: attachment.height!,
        width: attachment.width!
      };
    }
  }

  for (const embed of message.embeds) {
    if (embed.image) {
      return {
        url: embed.image.url,
        proxyURL: embed.image.proxyURL!,
        height: embed.image.height!,
        width: embed.image.width!
      };
    } else if (embed.thumbnail) {
      return {
        url: embed.thumbnail!.url,
        proxyURL: embed.thumbnail!.proxyURL!,
        height: embed.thumbnail!.height!,
        width: embed.thumbnail!.width!
      };
    }
  }

  return null;
}

export const oneLine = (input: string): string => input.replace(/(?:\n(?:\s*))+/g, ' ').trim();
