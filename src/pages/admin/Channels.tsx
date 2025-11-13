import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function Channels() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [channels, setChannels] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    posterUrl: "",
    description: "",
    categoryId: "",
    watchLink: "",
  });

  useEffect(() => {
    checkAdmin();
    fetchChannels();
    fetchCategories();
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

  const fetchChannels = async () => {
    const { data } = await supabase
      .from("live_channels")
      .select("*, categories(name)")
      .order("created_at", { ascending: false });
    if (data) setChannels(data);
  };

  const fetchCategories = async () => {
    const { data } = await supabase.from("categories").select("*").order("name");
    if (data) setCategories(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from("live_channels").insert({
        name: formData.name,
        poster_url: formData.posterUrl,
        description: formData.description,
        category_id: formData.categoryId,
        watch_link: formData.watchLink,
      });

      if (error) throw error;

      toast.success("Channel added successfully!");
      setFormData({
        name: "",
        posterUrl: "",
        description: "",
        categoryId: "",
        watchLink: "",
      });
      fetchChannels();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this channel?")) return;

    const { error } = await supabase.from("live_channels").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Channel deleted!");
      fetchChannels();
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
        <h1 className="text-3xl font-bold mb-8">Manage Live Channels</h1>

        <Card className="p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Add New Channel</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Channel Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="posterUrl">Poster URL *</Label>
                <Input
                  id="posterUrl"
                  value={formData.posterUrl}
                  onChange={(e) => setFormData({ ...formData, posterUrl: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.categoryId} onValueChange={(value) => setFormData({ ...formData, categoryId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="watchLink">Watch Link *</Label>
                <Input
                  id="watchLink"
                  value={formData.watchLink}
                  onChange={(e) => setFormData({ ...formData, watchLink: e.target.value })}
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Channel"}
            </Button>
          </form>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Existing Channels ({channels.length})</h2>
          <div className="space-y-4">
            {channels.map((channel) => (
              <div key={channel.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-4">
                  <img
                    src={channel.poster_url}
                    alt={channel.name}
                    className="h-16 w-12 object-cover rounded"
                  />
                  <div>
                    <h3 className="font-semibold">{channel.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {channel.categories?.name}
                    </p>
                  </div>
                </div>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(channel.id)}>
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
