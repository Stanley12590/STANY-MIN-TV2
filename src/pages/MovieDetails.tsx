import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { TopNav } from "@/components/TopNav";
import { BottomNav } from "@/components/BottomNav";
import { Play, ArrowLeft, Star } from "lucide-react";

export default function MovieDetails() {
  const { id } = useParams();

  const { data: movie, isLoading } = useQuery({
    queryKey: ["movie", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("movies")
        .select("*, categories(name)")
        .eq("id", id)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;
  }

  if (!movie) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Movie not found</div>;
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <TopNav />
      
      <main className="pt-16">
        <div className="relative h-[50vh] sm:h-[60vh] overflow-hidden">
          <img
            src={movie.poster_url}
            alt={movie.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          
          <Link
            to="/"
            className="absolute top-4 left-4 flex items-center gap-2 text-white hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Back
          </Link>
        </div>

        <div className="px-4 -mt-20 relative z-10">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              {movie.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm">
              {movie.rating && (
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{movie.rating}/10</span>
                </div>
              )}
              {movie.release_year && (
                <span className="text-muted-foreground">{movie.release_year}</span>
              )}
              {movie.categories && (
                <span className="px-3 py-1 bg-primary/20 text-primary rounded-full">
                  {movie.categories.name}
                </span>
              )}
            </div>

            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto mb-6"
            >
              <a
                href={movie.watch_link}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Play className="mr-2 h-5 w-5 fill-current" />
                Watch Now
              </a>
            </Button>

            {movie.description && (
              <div className="bg-card p-6 rounded-lg">
                <h2 className="text-xl font-bold mb-3">Description</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {movie.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
