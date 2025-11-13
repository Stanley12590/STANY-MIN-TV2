import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function Banners() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [banners, setBanners] = useState<any[]>([]);
  const [movies, setMovies] = useState<any[]>([]);
  const [channels, setChannels] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    imageUrl: "",
    targetType: "movie",
    targetId: "",
  });

  useEffect(() => {
    checkAdmin();
    fetchBanners();
    fetchMovies();
    fetchChannels();
  }, []);

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
      toast.error("Access denied");
      navigate("/");
    }
  };

  const fetchBanners = async () => {
    const { data } = await supabase
      .from("banners")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setBanners(data);
  };

  const fetchMovies = async () => {
    const { data } = await supabase.from("movies").select("id, title").order("title");
    if (data) setMovies(data);
  };

  const fetchChannels = async () => {
    const { data } = await supabase.from("live_channels").select("id, name").order("name");
    if (data) setChannels(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from("banners").insert({
        image_url: formData.imageUrl,
        target_movie_id: formData.targetType === "movie" ? formData.targetId : null,
        target_channel_id: formData.targetType === "channel" ? formData.targetId : null,
      });

      if (error) throw error;

      toast.success("Banner added!");
      setFormData({ imageUrl: "", targetType: "movie", targetId: "" });
      fetchBanners();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this banner?")) return;

    const { error } = await supabase.from("banners").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Banner deleted!");
      fetchBanners();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <Link to="/admin" className="flex items-center gap-2 text-sm hover:text-primary">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Manage Banners</h1>

        <Card className="p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Add New Banner</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="imageUrl">Banner Image URL *</Label>
              <Input
                id="imageUrl"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Link To</Label>
                <Select value={formData.targetType} onValueChange={(value) => setFormData({ ...formData, targetType: value, targetId: "" })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="movie">Movie</SelectItem>
                    <SelectItem value="channel">Channel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Select {formData.targetType === "movie" ? "Movie" : "Channel"} *</Label>
                <Select value={formData.targetId} onValueChange={(value) => setFormData({ ...formData, targetId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder={`Select ${formData.targetType}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {formData.targetType === "movie"
                      ? movies.map((m) => (
                          <SelectItem key={m.id} value={m.id}>
                            {m.title}
                          </SelectItem>
                        ))
                      : channels.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.name}
                          </SelectItem>
                        ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Banner"}
            </Button>
          </form>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Existing Banners ({banners.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {banners.map((banner) => (
              <div key={banner.id} className="relative group">
                <img
                  src={banner.image_url}
                  alt="Banner"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <Button
                  size="sm"
                  variant="destructive"
                  className="absolute top-2 right-2"
                  onClick={() => handleDelete(banner.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </main>
    </div>
  );
}
