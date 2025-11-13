import { Link } from "react-router-dom";
import { Play, Info } from "lucide-react";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";

interface Banner {
  id: string;
  imageUrl: string;
  targetMovieId?: string;
  targetChannelId?: string;
}

interface HeroBannerProps {
  banners: Banner[];
}

export const HeroBanner = ({ banners }: HeroBannerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [banners.length]);

  if (!banners || banners.length === 0) return null;

  const currentBanner = banners[currentIndex];
  const targetPath = currentBanner.targetMovieId
    ? `/movie/${currentBanner.targetMovieId}`
    : currentBanner.targetChannelId
    ? `/channel/${currentBanner.targetChannelId}`
    : "#";

  return (
    <div className="relative h-[60vh] sm:h-[70vh] md:h-[80vh] w-full overflow-hidden">
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={banner.imageUrl}
            alt="Banner"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        </div>
      ))}

      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8 md:p-12">
        <div className="max-w-2xl space-y-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
            Stany Min Tv
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-xl">
            Stream the latest movies and live channels. Entertainment at your fingertips.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
              <Link to={targetPath}>
                <Play className="mr-2 h-5 w-5 fill-current" />
                Watch Now
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link to={targetPath}>
                <Info className="mr-2 h-5 w-5" />
                More Info
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {banners.length > 1 && (
        <div className="absolute bottom-4 right-4 flex gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-1 w-8 rounded-full transition-all ${
                index === currentIndex ? "bg-primary" : "bg-white/50"
              }`}
              aria-label={`Go to banner ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
