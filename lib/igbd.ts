"use server";

import type {
  SearchGamesResponse,
  GetGameResponse,
  TwitchOAuthResponse,
} from "@/types.ts/responses";

// caching bearer token in memory from twitch
let cachedToken: string | null = null;
let tokenExpiry: number = 0;

const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;
const TWITCH_CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET;

// in order to use igdb, we need to authenticate with twitch
// oauth2 first. will store token so we don't make repeated calls
async function getAccessToken() {
  if (cachedToken && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  if (!TWITCH_CLIENT_ID) {
    throw new Error("TWITCH_CLIENT_ID is not set");
  }

  if (!TWITCH_CLIENT_SECRET) {
    throw new Error("TWITCH_CLIENT_SECRET is not set");
  }

  const response = await fetch("https://id.twitch.tv/oauth2/token", {
    method: "POST",
    body: new URLSearchParams({
      client_id: TWITCH_CLIENT_ID,
      client_secret: TWITCH_CLIENT_SECRET,
      grant_type: "client_credentials",
    }),
  });

  if (!response.ok) {
    throw new Error(`Twitch OAuth error: ${response.status}`);
  }

  const data: TwitchOAuthResponse = await response.json();

  cachedToken = data.access_token;
  tokenExpiry = Date.now() + data.expires_in * 1000;

  return cachedToken;
}

// function to fetch data from any igdb endpoint
// takes in a generic type
async function igdbFetch<T>(endpoint: string, query: string): Promise<T[]> {
  const token = await getAccessToken();

  const response = await fetch(`https://api.igdb.com/v4/${endpoint}`, {
    method: "POST",
    headers: {
      "Client-ID": TWITCH_CLIENT_ID!,
      Authorization: `Bearer ${token}`,
    },
    body: query,
  });

  if (!response.ok) {
    throw new Error(`IGDB API error: ${response.status}`);
  }

  return response.json();
}

export async function searchGames(
  query: string,
): Promise<SearchGamesResponse[]> {
  return igdbFetch(
    "games",
    `
    fields id,name,cover.url,summary;
    where (name ~ "${query}"* & themes != (42) & version_parent=null & parent_game=null);
    sort rating desc;
    limit 10;
    `,
  );
}

export async function getGame(id: number): Promise<GetGameResponse> {
  const results = await igdbFetch<GetGameResponse>(
    "games",
    `
    fields id,name,genres.name,first_release_date,total_rating,total_rating_count,cover.url,artworks.url,summary;
    where id = ${id};
    `,
  );

  return results[0];
}
