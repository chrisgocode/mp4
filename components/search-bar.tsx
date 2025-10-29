"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { searchGames } from "@/lib/igbd";
import type { SearchGamesResponse } from "@/types.ts/responses";
import Image from "next/image";
import Link from "next/link";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchGamesResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // this useEffect uses the ref we just created to close the dropdown
  // result bar when user clicks anywhere else on screen
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // this useEffect runs a debounce search every 300ms
  // change in query resets this timer
  useEffect(() => {
    const performSearch = async () => {
      // if less than 2 chars => cleared
      if (query.trim().length < 2) {
        setResults([]);
        setShowResults(false);
        return;
      }

      setIsLoading(true);
      setShowResults(true);

      try {
        const data = await searchGames(query);
        setResults(data);
      } catch (error) {
        console.error("Error fetching search results:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(performSearch, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  return (
    <div ref={searchRef} className="relative w-full">
      <div className="relative">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
          size={20}
        />
        <Input
          type="text"
          placeholder="Search games..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim().length >= 2 && setShowResults(true)}
          className="h-14 pl-12 pr-12 text-base shadow-lg border-border focus-visible:ring-2 focus-visible:ring-ring"
        />
        {isLoading && (
          <Loader2
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground animate-spin"
            size={20}
          />
        )}
      </div>

      {showResults && results.length > 0 && (
        <Card className="absolute top-full mt-2 w-full max-h-[500px] overflow-y-auto shadow-xl border-border z-50">
          <div className="divide-y divide-border">
            {results.map((result) => (
              <Link
                key={result.id}
                href={`/game/${result.id}`}
                onClick={() => setShowResults(false)}
                className="w-full text-left p-4 hover:bg-accent transition-colors focus:bg-accent focus:outline-none block"
              >
                <div className="flex gap-3">
                  {result.cover?.url && (
                    <Image
                      src={`https:${result.cover.url}`}
                      alt={result.name}
                      width={150}
                      height={150}
                      className="w-14 h-18 object-cover rounded shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground mb-1 text-balance">
                      {result.name}
                    </h3>
                    {result.summary && (
                      <p className="text-sm text-muted-foreground line-clamp-2 text-pretty">
                        {result.summary}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Card>
      )}

      {showResults &&
        !isLoading &&
        query.trim().length >= 2 &&
        results.length === 0 && (
          <Card className="absolute top-full mt-2 w-full p-4 shadow-xl border-border z-50">
            <p className="text-sm text-muted-foreground text-center">
              No results found
            </p>
          </Card>
        )}
    </div>
  );
}
