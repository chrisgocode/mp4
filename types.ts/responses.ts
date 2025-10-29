export type TwitchOAuthResponse = {
  access_token: string;
  expires_in: number;
  token_type: string;
};

export type SearchGamesResponse = {
  id: number;
  cover?: {
    id: number;
    url: string;
  };
  name: string;
  summary: string;
};

export type GetGameResponse = {
  id: number;
  artworks?: Array<{
    id: number;
    url: string;
  }>;
  cover: {
    id: number;
    url: string;
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
