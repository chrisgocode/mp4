// https://api-docs.igdb.com/#images
export type IGDBImageSize =
  | "cover_small" // 90 x 128
  | "screenshot_med" // 569 x 320
  | "cover_big" // 264 x 374
  | "logo_med" // 284 x 160
  | "screenshot_big" // 889 x 500
  | "screenshot_huge" // 1280 x 720
  | "thumb" // 90 x 90
  | "micro" // 35 x 35
  | "720p" // 1280 x 720
  | "1080p"; // 1920 x 1080

export type TwitchOAuthResponse = {
  access_token: string;
  expires_in: number;
  token_type: string;
};

export type SearchGamesResponse = {
  id: number;
  cover?: {
    id: number;
    image_id: string;
  };
  name: string;
  summary: string;
};

export type GetGameResponse = {
  id: number;
  artworks?: Array<{
    id: number;
    image_id: string;
  }>;
  screenshots?: Array<{
    id: number;
    image_id: string;
  }>;
  cover: {
    id: number;
    image_id: string;
  };
  first_release_date: number;
  genres: Array<{
    id: number;
    name: string;
  }>;
  name: string;
  summary: string;
  total_rating: number;
  total_rating_count: number;
};
