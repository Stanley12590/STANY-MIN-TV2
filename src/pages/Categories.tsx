import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TopNav } from "@/components/TopNav";
import { BottomNav } from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { Grid } from "lucide-react";

export default function Categories() {
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

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <TopNav />
      
      <main className="pt-24 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Categories</h1>
          
          {categories && categories.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {categories.map((category) => (
                <Card
                  key={category.id}
                  className="p-6 hover:bg-accent transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Grid className="h-6 w-6 text-primary" />
                    <h3 className="font-semibold">{category.name}</h3>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center mt-24">
              <p className="text-muted-foreground">No categories available yet.</p>
            </div>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
