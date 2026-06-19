import React from "react";
import BookCard from "./BookCard";
import { useCart } from "../../hooks/useCart";

const AuthorBooks = ({ authorBooks = [] }) => {
  const { addToCart } = useCart();

  if (authorBooks.length === 0) return null;

  return (
    <section className="mt-16">
      <div className="mb-8 border-b border-gray-100 pb-5">
        <h2 className="text-2xl font-serif font-black text-gray-900 tracking-tight">
          More Books You May Like
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Explore recommendations based on the author and genre
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5 sm:gap-6">
        {authorBooks.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            onAddToCart={addToCart}
          />
        ))}
      </div>
    </section>
  );
};

export default AuthorBooks;
