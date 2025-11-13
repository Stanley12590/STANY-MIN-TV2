import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { TopNav } from "@/components/TopNav";
import { BottomNav } from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { User, LogOut, Shield } from "lucide-react";
import { toast } from "sonner";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      setUser(session.user);

      // Check if user is admin
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id);

      if (roles && roles.some(r => r.role === "admin")) {
        setIsAdmin(true);
      }

      setLoading(false);
    };

    checkAuth();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
    navigate("/auth");
  };

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <TopNav />
      
      <main className="pt-24 px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center">
                <User className="h-8 w-8 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">
                  {user?.user_metadata?.username || "User"}
                </h1>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>

            {isAdmin && (
              <div className="mb-6 p-4 bg-primary/10 rounded-lg flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <span className="font-medium">Admin Account</span>
              </div>
            )}

            <div className="space-y-3">
              {isAdmin && (
                <Button
                  onClick={() => navigate("/admin")}
                  className="w-full"
                  variant="secondary"
                >
                  <Shield className="mr-2 h-5 w-5" />
                  Admin Dashboard
                </Button>
              )}

              <Button
                onClick={handleSignOut}
                className="w-full"
                variant="destructive"
              >
                <LogOut className="mr-2 h-5 w-5" />
                Sign Out
              </Button>
            </div>
          </Card>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
