import ky from "ky-universal";

const tg = ky.create({
  prefixUrl: "https://api.telegram.org/bot" + process.env.BOT_TOKEN + "/",
  throwHttpErrors: false,
});

export interface PhotoSize {
  /** Identifier for this file, which can be used to download or reuse the file */
  file_id: string;
  /** Unique identifier for this file, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file. */
  file_unique_id: string;
  /** Photo width */
  width: number;
  /** Photo height */
  height: number;
  /** *Optional*. File size in bytes */
  file_size?: number;
}

export interface File {
  /** Identifier for this file, which can be used to download or reuse the file */
  file_id: string;
  /** Unique identifier for this file, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file. */
  file_unique_id: string;
  /** *Optional*. File size in bytes. It can be bigger than 2^31 and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this value. */
  file_size?: number;
  /** Optional. File path. Use https://api.telegram.org/file/bot<token>/<file_path> to get the file. */
  file_path?: string;
}

export interface Sticker {
  /** Identifier for this file, which can be used to download or reuse the file */
  file_id: string;
  /** Unique identifier for this file, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file. */
  file_unique_id: string;
  /** Type of the sticker, currently one of “regular”, “mask”, “custom_emoji”. The type of the sticker is independent from its format, which is determined by the fields is_animated and is_video. */
  type: string;
  /** Sticker width */
  width: number;
  /** Sticker height */
  height: number;
  /** True, if the sticker is [animated](https://telegram.org/blog/animated-stickers) */
  is_animated: boolean;
  /** True, if the sticker is a [video sticker](https://telegram.org/blog/video-stickers-better-reactions) */
  is_video: boolean;
  /** *Optional*. Sticker thumbnail in the .WEBP or .JPG format */
  thumb?: PhotoSize;
  /** *Optional*. Emoji associated with the sticker */
  emoji?: string;
  /** *Optional*. Name of the sticker set to which the sticker belongs */
  set_name?: string;
  /** *Optional*. For premium regular stickers, premium animation for the sticker */
  premium_animation?: File;
  /** *Optional*. For mask stickers, the position where the mask should be placed */
  mask_position?: unknown; // im not typing this, since it isnt needed
  /** *Optional*. For custom emoji stickers, unique identifier of the custom emoji */
  custom_emoji_id?: string;
  /** *Optional*. File size in bytes */
  file_size?: number;
}

export interface StickerSet {
  /** Sticker set name */
  name: string;
  /** Sticker set title */
  title: string;
  /** Type of stickers in the set, currently one of “regular”, “mask”, “custom_emoji” */
  sticker_type: string;
  /** True, if the sticker set contains [animated](https://telegram.org/blog/animated-stickers) */
  is_animated: boolean;
  /** True, if the sticker set contains a [video sticker](https://telegram.org/blog/video-stickers-better-reactions) */
  is_video: boolean;
  /** List of all set stickers */
  stickers: Sticker[];
  /** Optional. Sticker set thumbnail in the .WEBP, .TGS, or .WEBM format */
  thumb?: PhotoSize;
}

export default tg;
