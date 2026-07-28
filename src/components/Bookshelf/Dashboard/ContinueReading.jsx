import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { useRef } from "react";

import ContinueReadingCard from "./ContinueReadingCard";
import Carousel from "../Carousel/Carousel";

const books = [
  {
    id: 1,
    title: "Atomic Habits",
    author: "James Clear",
    cover: "https://images-na.ssl-images-amazon.com/images/I/81F90H7hnML.jpg",
    type: "PDF",
    progress: 46,
    currentPage: 146,
    totalPages: 320,
    lastRead: "2 hours ago",
  },
  {
    id: 2,
    title: "The Psychology of Money",
    author: "Morgan Housel",
    cover: "https://m.media-amazon.com/images/I/71g2ednj0JL.jpg",
    type: "Book",
    progress: 62,
    currentPage: 182,
    totalPages: 280,
    lastRead: "Yesterday",
  },
  {
    id: 3,
    title: "UPSC Daily News",
    author: "Books Ka Bazaar",
    cover: "https://picsum.photos/300/420?1",
    type: "Reading Room",
    progress: 18,
    currentPage: 5,
    totalPages: 30,
    lastRead: "Today",
  },
  {
    id: 4,
    title: "Ikigai",
    author: "Héctor García",
    cover: "https://m.media-amazon.com/images/I/81l3rZK4lnL.jpg",
    type: "PDF",
    progress: 88,
    currentPage: 201,
    totalPages: 228,
    lastRead: "5 mins ago",
  },
];

export default function ContinueReading() {

  const sliderRef = useRef();

  const scrollLeft = () => {
    sliderRef.current.scrollBy({
      left: -320,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    sliderRef.current.scrollBy({
      left: 320,
      behavior: "smooth",
    });
  };

  return (
    <section className="mt-10">

      {/* Header */}

      <div className="flex justify-between items-center mb-6">

        <div>

          <h2 className="text-2xl font-bold text-[#0d1117]">

            Continue Reading

          </h2>

          <p className="text-gray-500">

            Pick up where you left off.

          </p>

        </div>

        <div className="flex gap-3">

          <button
            onClick={scrollLeft}
            className="w-10 h-10 rounded-full border hover:bg-red-50 transition"
          >
            <ChevronLeft className="mx-auto" />
          </button>

          <button
            onClick={scrollRight}
            className="w-10 h-10 rounded-full border hover:bg-red-50 transition"
          >
            <ChevronRight className="mx-auto" />
          </button>

        </div>

      </div>

      {/* Slider */}

      <Carousel>

        {books.map(book => (

          <div
            key={book.id}
            className="flex-[0_0_280px]"
          >
            <ContinueReadingCard
              book={book}
            />
          </div>

        ))}

      </Carousel>


    </section>
  );
}