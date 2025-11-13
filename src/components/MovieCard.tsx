import { Link } from "react-router-dom";
import { Play } from "lucide-react";

interface MovieCardProps {
  id: string;
  title: string;
  posterUrl: string;
  type?: "movie" | "channel";
}

export const MovieCard = ({ id, title, posterUrl, type = "movie" }: MovieCardProps) => {
  const linkPath = type === "movie" ? `/movie/${id}` : `/channel/${id}`;

  return (
    <Link to={linkPath} className="group relative flex-shrink-0 w-[150px] sm:w-[180px] md:w-[200px]">
      <div className="relative aspect-[2/3] overflow-hidden rounded-md bg-muted transition-transform duration-300 group-hover:scale-105">
        <img
          src={posterUrl}
          alt={title}
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary">
            <Play className="h-6 w-6 fill-current text-primary-foreground" />
          </div>
        </div>
      </div>
      <h3 className="mt-2 text-sm font-medium text-foreground line-clamp-2">{title}</h3>
    </Link>
  );
};
