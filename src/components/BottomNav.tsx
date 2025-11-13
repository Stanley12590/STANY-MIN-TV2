import { Home, Search, Grid, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export const BottomNav = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border md:hidden">
      <div className="flex items-center justify-around h-16">
        <Link
          to="/"
          className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
            isActive("/") ? "text-primary" : "text-muted-foreground"
          }`}
        >
          <Home className="h-6 w-6" />
          <span className="text-xs mt-1">Home</span>
        </Link>
        
        <Link
          to="/search"
          className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
            isActive("/search") ? "text-primary" : "text-muted-foreground"
          }`}
        >
          <Search className="h-6 w-6" />
          <span className="text-xs mt-1">Search</span>
        </Link>
        
        <Link
          to="/categories"
          className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
            isActive("/categories") ? "text-primary" : "text-muted-foreground"
          }`}
        >
          <Grid className="h-6 w-6" />
          <span className="text-xs mt-1">Categories</span>
        </Link>
        
        <Link
          to="/profile"
          className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
            isActive("/profile") ? "text-primary" : "text-muted-foreground"
          }`}
        >
          <User className="h-6 w-6" />
          <span className="text-xs mt-1">Profile</span>
        </Link>
      </div>
    </nav>
  );
};
