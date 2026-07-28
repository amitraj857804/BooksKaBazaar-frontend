import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Carousel({ children }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    dragFree: true,
    containScroll: "trimSnaps",
  });

  return (
    <div className="relative">
      {/* Left */}

      <button
        onClick={() => emblaApi?.scrollPrev()}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white border shadow hover:bg-red-50"
      >
        <ChevronLeft className="mx-auto" size={18} />
      </button>

      {/* Right */}

      <button
        onClick={() => emblaApi?.scrollNext()}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white border shadow hover:bg-red-50"
      >
        <ChevronRight className="mx-auto" size={18} />
      </button>

      <div className="overflow-hidden px-12" ref={emblaRef}>
        <div className="flex gap-6">
          {children}
        </div>
      </div>
    </div>
  );
}