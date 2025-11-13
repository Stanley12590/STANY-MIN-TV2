import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { HeroBanner } from "@/components/HeroBanner";
import { CategoryRow } from "@/components/CategoryRow";
import { TopNav } from "@/components/TopNav";
import { BottomNav } from "@/components/BottomNav";

export default function Home() {
  const { data: banners } = useQuery({
    queryKey: ["banners"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("banners")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data;
    },
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data;
    },
  });

  const { data: movies } = useQuery({
    queryKey: ["movies"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("movies")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const { data: channels } = useQuery({
    queryKey: ["channels"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("live_channels")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const getItemsByCategory = (categoryId: string, type: "movie" | "channel") => {
    if (type === "movie") {
      return (movies || [])
        .filter((m) => m.category_id === categoryId)
        .map((m) => ({
          id: m.id,
          title: m.title,
          posterUrl: m.poster_url,
          type: "movie" as const,
        }));
    } else {
      return (channels || [])
        .filter((c) => c.category_id === categoryId)
        .map((c) => ({
          id: c.id,
          title: c.name,
          posterUrl: c.poster_url,
          type: "channel" as const,
        }));
    }
  };

  const bannersData = (banners || []).map((b) => ({
    id: b.id,
    imageUrl: b.image_url,
    targetMovieId: b.target_movie_id,
    targetChannelId: b.target_channel_id,
  }));

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <TopNav />
      
      <main className="pt-16">
        <HeroBanner banners={bannersData} />
        
        <div className="mt-8 space-y-8">
          {categories?.map((category) => {
            const movieItems = getItemsByCategory(category.id, "movie");
            const channelItems = getItemsByCategory(category.id, "channel");
            
            return (
              <div key={category.id}>
                {movieItems.length > 0 && (
                  <CategoryRow title={`${category.name} - Movies`} items={movieItems} />
                )}
                {channelItems.length > 0 && (
                  <CategoryRow title={`${category.name} - Channels`} items={channelItems} />
                )}
              </div>
            );
          })}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
