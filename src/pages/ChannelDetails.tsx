import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { TopNav } from "@/components/TopNav";
import { BottomNav } from "@/components/BottomNav";
import { Play, ArrowLeft, Radio } from "lucide-react";

export default function ChannelDetails() {
  const { id } = useParams();

  const { data: channel, isLoading } = useQuery({
    queryKey: ["channel", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("live_channels")
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

  if (!channel) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Channel not found</div>;
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <TopNav />
      
      <main className="pt-16">
        <div className="relative h-[50vh] sm:h-[60vh] overflow-hidden">
          <img
            src={channel.poster_url}
            alt={channel.name}
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

          <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            <Radio className="h-4 w-4" />
            LIVE
          </div>
        </div>

        <div className="px-4 -mt-20 relative z-10">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              {channel.name}
            </h1>

            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm">
              {channel.categories && (
                <span className="px-3 py-1 bg-primary/20 text-primary rounded-full">
                  {channel.categories.name}
                </span>
              )}
              <span className="text-muted-foreground">Live Channel</span>
            </div>

            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto mb-6"
            >
              <a
                href={channel.watch_link}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Play className="mr-2 h-5 w-5 fill-current" />
                Watch Live
              </a>
            </Button>

            {channel.description && (
              <div className="bg-card p-6 rounded-lg">
                <h2 className="text-xl font-bold mb-3">About</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {channel.description}
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
