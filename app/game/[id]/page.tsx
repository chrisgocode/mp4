"use client";

import { useState, useEffect, use } from "react";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { Calendar, Star, Users } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { GetGameResponse } from "@/types/responses";
import { getGame } from "@/lib/igdb";
import { createIGDBImageUrl } from "@/lib/igdb.images";
import Image from "next/image";

export default function GamePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [isLoading, setIsLoading] = useState(false);
  const [game, setGame] = useState<GetGameResponse | null>();

  useEffect(() => {
    const fetchGame = async () => {
      const gameId = Number(id);

      setIsLoading(true);

      try {
        const game = await getGame(gameId);
        setGame(game);
      } catch (error) {
        console.error("Error fetching game: ", error);
        setGame(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGame();
  }, [id]);

  if (!game || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className="size-12" />
      </div>
    );
  }

  const galleryImages = [...(game.artworks || []), ...(game.screenshots || [])];

  return (
    <main className="container mx-auto px-4 py-8">
      <Card className="max-w-5xl mx-auto mt-[10vh]">
        {/* image header */}
        <div className="relative h-[400px] w-full overflow-hidden">
          <Image
            src={createIGDBImageUrl("screenshot_huge", game.cover.image_id)}
            alt={game.name}
            className="h-full w-full"
            width={1280}
            height={720}
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h2 className="text-4xl font-bold mb-2 text-balance">
              {game.name}
            </h2>
            <div className="flex flex-wrap gap-2">
              {game.genres?.map((genre) => (
                <Badge
                  key={genre.id}
                  variant="secondary"
                  className="bg-white/20 text-white border-white/30"
                >
                  {genre.name}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* release date and ratings */}

        <CardHeader>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            {game.first_release_date && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">
                  {new Date(game.first_release_date * 1000).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    },
                  )}
                </span>
              </div>
            )}
            {game.total_rating && (
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <span className="font-bold">
                  {(game.total_rating / 20).toFixed(1)}
                </span>
                <span className="text-muted-foreground">/ 5</span>
              </div>
            )}
            {game.total_rating_count && (
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {game.total_rating_count.toLocaleString()} ratings
                </span>
              </div>
            )}
          </div>
        </CardHeader>

        {/* description */}
        <CardContent className="space-y-6">
          {game.summary && (
            <div>
              <h3 className="text-lg font-semibold mb-2">About</h3>
              <p className="text-muted-foreground leading-relaxed text-pretty">
                {game.summary}
              </p>
            </div>
          )}

          {galleryImages.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Gallery</h3>
              <div className="grid grid-cols-2 gap-3">
                {galleryImages.slice(0, 6).map((image) => (
                  <div
                    key={image.id}
                    className="relative aspect-video overflow-hidden rounded-lg border"
                  >
                    <Image
                      src={createIGDBImageUrl("screenshot_big", image.image_id)}
                      alt="Game artwork"
                      className="h-full w-full object-cover transition-transform hover:scale-105"
                      height={500}
                      width={889}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
