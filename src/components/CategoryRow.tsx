import { MovieCard } from "./MovieCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

interface CategoryRowProps {
  title: string;
  items: Array<{
    id: string;
    title: string;
    posterUrl: string;
    type?: "movie" | "channel";
  }>;
}

export const CategoryRow = ({ title, items }: CategoryRowProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -400 : 400;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  if (!items || items.length === 0) return null;

  return (
    <div className="mb-8 sm:mb-12">
      <h2 className="mb-4 px-4 text-xl sm:text-2xl font-bold text-foreground">
        {title}
      </h2>
      <div className="group relative">
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 z-10 -translate-y-1/2 h-full w-12 bg-gradient-to-r from-background to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-start pl-2"
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-8 w-8 text-white" />
        </button>
        
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto px-4 hide-scrollbar"
        >
          {items.map((item) => (
            <MovieCard
              key={item.id}
              id={item.id}
              title={item.title}
              posterUrl={item.posterUrl}
              type={item.type}
            />
          ))}
        </div>

        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 z-10 -translate-y-1/2 h-full w-12 bg-gradient-to-l from-background to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-end pr-2"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-8 w-8 text-white" />
        </button>
      </div>
    </div>
  );
};
