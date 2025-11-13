import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Search from "./pages/Search";
import Categories from "./pages/Categories";
import Profile from "./pages/Profile";
import MovieDetails from "./pages/MovieDetails";
import ChannelDetails from "./pages/ChannelDetails";
import Dashboard from "./pages/admin/Dashboard";
import AdminMovies from "./pages/admin/Movies";
import AdminChannels from "./pages/admin/Channels";
import AdminCategories from "./pages/admin/Categories";
import AdminBanners from "./pages/admin/Banners";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/search" element={<Search />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/channel/:id" element={<ChannelDetails />} />
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/movies" element={<AdminMovies />} />
          <Route path="/admin/channels" element={<AdminChannels />} />
          <Route path="/admin/categories" element={<AdminCategories />} />
          <Route path="/admin/banners" element={<AdminBanners />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
