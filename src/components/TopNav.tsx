import { Link } from "react-router-dom";
import { Search, User } from "lucide-react";

export const TopNav = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-background/90 to-transparent backdrop-blur-sm">
      <div className="flex items-center justify-between px-4 py-4">
        <Link to="/" className="text-2xl font-bold text-primary">
          Stany Min Tv
        </Link>
        
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
            Home
          </Link>
          <Link to="/categories" className="text-sm font-medium hover:text-primary transition-colors">
            Categories
          </Link>
          <Link to="/search" className="text-sm font-medium hover:text-primary transition-colors">
            <Search className="h-5 w-5" />
          </Link>
          <Link to="/profile" className="text-sm font-medium hover:text-primary transition-colors">
            <User className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </header>
  );
};
