import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { MovieCard } from "@/components/MovieCard";
import { TopNav } from "@/components/TopNav";
import { BottomNav } from "@/components/BottomNav";
import { Search as SearchIcon } from "lucide-react";

export default function Search() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: movies } = useQuery({
    queryKey: ["movies"],
    queryFn: async () => {
      const { data, error } = await supabase.from("movies").select("*");
      if (error) throw error;
      return data;
    },
  });

  const { data: channels } = useQuery({
    queryKey: ["channels"],
    queryFn: async () => {
      const { data, error } = await supabase.from("live_channels").select("*");
      if (error) throw error;
      return data;
    },
  });

  const filteredMovies = (movies || [])
    .filter((m) =>
      m.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .map((m) => ({
      id: m.id,
      title: m.title,
      posterUrl: m.poster_url,
      type: "movie" as const,
    }));

  const filteredChannels = (channels || [])
    .filter((c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .map((c) => ({
      id: c.id,
      title: c.name,
      posterUrl: c.poster_url,
      type: "channel" as const,
    }));

  const allResults = [...filteredMovies, ...filteredChannels];

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <TopNav />
      
      <main className="pt-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="relative mb-8">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search movies and channels..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 text-lg"
            />
          </div>

          {searchTerm && (
            <div>
              <h2 className="text-xl font-bold mb-4">
                {allResults.length} Results for "{searchTerm}"
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {allResults.map((item) => (
                  <MovieCard
                    key={item.id}
                    id={item.id}
                    title={item.title}
                    posterUrl={item.posterUrl}
                    type={item.type}
                  />
                ))}
              </div>

              {allResults.length === 0 && (
                <p className="text-center text-muted-foreground mt-12">
                  No results found. Try a different search term.
                </p>
              )}
            </div>
          )}

          {!searchTerm && (
            <div className="text-center mt-24">
              <SearchIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Search for content</h2>
              <p className="text-muted-foreground">
                Find your favorite movies and live channels
              </p>
            </div>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
