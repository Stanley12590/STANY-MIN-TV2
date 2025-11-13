import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function Movies() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [movies, setMovies] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    posterUrl: "",
    description: "",
    rating: "",
    releaseYear: "",
    categoryId: "",
    watchLink: "",
  });

  useEffect(() => {
    checkAdmin();
    fetchMovies();
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

  const fetchMovies = async () => {
    const { data } = await supabase
      .from("movies")
      .select("*, categories(name)")
      .order("created_at", { ascending: false });
    if (data) setMovies(data);
  };

  const fetchCategories = async () => {
    const { data } = await supabase.from("categories").select("*").order("name");
    if (data) setCategories(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from("movies").insert({
        title: formData.title,
        poster_url: formData.posterUrl,
        description: formData.description,
        rating: formData.rating ? parseFloat(formData.rating) : null,
        release_year: formData.releaseYear ? parseInt(formData.releaseYear) : null,
        category_id: formData.categoryId,
        watch_link: formData.watchLink,
      });

      if (error) throw error;

      toast.success("Movie added successfully!");
      setFormData({
        title: "",
        posterUrl: "",
        description: "",
        rating: "",
        releaseYear: "",
        categoryId: "",
        watchLink: "",
      });
      fetchMovies();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this movie?")) return;

    const { error } = await supabase.from("movies").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Movie deleted!");
      fetchMovies();
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
        <h1 className="text-3xl font-bold mb-8">Manage Movies</h1>

        <Card className="p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Add New Movie</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
                <Label htmlFor="rating">Rating (0-10)</Label>
                <Input
                  id="rating"
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="releaseYear">Release Year</Label>
                <Input
                  id="releaseYear"
                  type="number"
                  value={formData.releaseYear}
                  onChange={(e) => setFormData({ ...formData, releaseYear: e.target.value })}
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
              {loading ? "Adding..." : "Add Movie"}
            </Button>
          </form>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Existing Movies ({movies.length})</h2>
          <div className="space-y-4">
            {movies.map((movie) => (
              <div key={movie.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-4">
                  <img
                    src={movie.poster_url}
                    alt={movie.title}
                    className="h-16 w-12 object-cover rounded"
                  />
                  <div>
                    <h3 className="font-semibold">{movie.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {movie.categories?.name} • {movie.rating ? `${movie.rating}/10` : "No rating"}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(movie.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </main>
    </div>
  );
}
