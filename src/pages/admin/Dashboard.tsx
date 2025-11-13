import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Film, Radio, Grid, Image, Users, Plus, LayoutDashboard, LogOut } from "lucide-react";
import { toast } from "sonner";

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    movies: 0,
    channels: 0,
    categories: 0,
    banners: 0,
    users: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id);

      if (!roles || !roles.some(r => r.role === "admin")) {
        toast.error("Access denied: Admin only");
        navigate("/");
        return;
      }

      // Fetch stats
      const [moviesRes, channelsRes, categoriesRes, bannersRes, usersRes] = await Promise.all([
        supabase.from("movies").select("id", { count: "exact", head: true }),
        supabase.from("live_channels").select("id", { count: "exact", head: true }),
        supabase.from("categories").select("id", { count: "exact", head: true }),
        supabase.from("banners").select("id", { count: "exact", head: true }),
        supabase.from("profiles").select("id", { count: "exact", head: true }),
      ]);

      setStats({
        movies: moviesRes.count || 0,
        channels: channelsRes.count || 0,
        categories: categoriesRes.count || 0,
        banners: bannersRes.count || 0,
        users: usersRes.count || 0,
      });

      setLoading(false);
    };

    checkAdmin();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button asChild variant="outline" size="sm">
              <Link to="/">
                View Site
              </Link>
            </Button>
            <Button onClick={handleSignOut} variant="destructive" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-8">Welcome, Admin</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Movies</p>
                <p className="text-3xl font-bold">{stats.movies}</p>
              </div>
              <Film className="h-12 w-12 text-primary" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Live Channels</p>
                <p className="text-3xl font-bold">{stats.channels}</p>
              </div>
              <Radio className="h-12 w-12 text-primary" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Categories</p>
                <p className="text-3xl font-bold">{stats.categories}</p>
              </div>
              <Grid className="h-12 w-12 text-primary" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Banners</p>
                <p className="text-3xl font-bold">{stats.banners}</p>
              </div>
              <Image className="h-12 w-12 text-primary" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-3xl font-bold">{stats.users}</p>
              </div>
              <Users className="h-12 w-12 text-primary" />
            </div>
          </Card>
        </div>

        <h3 className="text-2xl font-bold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button asChild className="h-auto py-6 flex-col gap-2">
            <Link to="/admin/movies">
              <Plus className="h-6 w-6" />
              <span>Manage Movies</span>
            </Link>
          </Button>

          <Button asChild className="h-auto py-6 flex-col gap-2" variant="secondary">
            <Link to="/admin/channels">
              <Plus className="h-6 w-6" />
              <span>Manage Channels</span>
            </Link>
          </Button>

          <Button asChild className="h-auto py-6 flex-col gap-2" variant="secondary">
            <Link to="/admin/categories">
              <Plus className="h-6 w-6" />
              <span>Manage Categories</span>
            </Link>
          </Button>

          <Button asChild className="h-auto py-6 flex-col gap-2" variant="secondary">
            <Link to="/admin/banners">
              <Plus className="h-6 w-6" />
              <span>Manage Banners</span>
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
