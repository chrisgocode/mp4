import type { IGDBImageSize } from "@/types/responses";

export function createIGDBImageUrl(
  size: IGDBImageSize,
  imageId: string,
): string {
  return `https://images.igdb.com/igdb/image/upload/t_${size}/${imageId}.jpg`;
}
