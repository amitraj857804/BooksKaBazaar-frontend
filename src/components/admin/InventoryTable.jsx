import { useState, useMemo, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Edit2, Trash2, Plus, AlertCircle, BookX } from "lucide-react";
import { useDebounce } from "../../utils/adminUtils";
import AuthenticatedImage from "../common/AuthenticatedImage";

const InventoryTable = ({
  books = [],
  onAddBook,
  onEditBook,
  onDeleteBook,
  onSearch,
  isLoading = false,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingIds, setDeletingIds] = useState(new Set());
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Trigger server-side search when debounced query changes
  useEffect(() => {
    onSearch?.(debouncedSearch);
  }, [debouncedSearch, onSearch]);

  // Optimistic UI: Filter out deleted items
  const displayBooks = useMemo(
    () => books.filter((book) => !deletingIds.has(book.id)),
    [books, deletingIds]
  );

  // We no longer need client-side filteredBooks as we are searching on the server
  const filteredBooks = displayBooks;

  // Optimistic delete with immediate UI update
  const handleDelete = useCallback(
    (id) => {
      if (!confirm("Are you sure you want to delete this book?")) return;

      // Optimistic UI: Remove immediately
      setDeletingIds((prev) => new Set(prev).add(id));

      onDeleteBook?.(id);
    },
    [onDeleteBook]
  );

  // Reset deleting IDs when books list changes significantly (e.g. after refresh)
  useEffect(() => {
    setDeletingIds(new Set());
  }, [books.length]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="space-y-4">
      {/* Header with Search */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by title, author, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search books inventory"
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          )}
        </div>
        <motion.button
          onClick={onAddBook}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors whitespace-nowrap"
          aria-label="Add new book"
        >
          <Plus size={20} />
          <span>Add Book</span>
        </motion.button>
      </div>

      {/* Loading & Content State */}
      <div className="relative min-h-[400px]">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-10 bg-white/60 backdrop-blur-[1px] flex flex-col items-center justify-center rounded-xl border border-gray-200"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="inline-block mb-3"
              >
                <div className="w-10 h-10 border-4 border-gray-200 border-t-red-600 rounded-full" />
              </motion.div>
              <p className="text-gray-600 font-medium tracking-wide">Updating Inventory...</p>
            </motion.div>
          ) : filteredBooks.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl border border-gray-200 p-12 text-center"
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1 }}
                className="inline-block p-4 bg-blue-50 rounded-full mb-4"
              >
                <BookX className="w-8 h-8 text-blue-600" />
              </motion.div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchQuery ? "No books found" : "No books yet"}
              </h3>
              <p className="text-gray-600 mb-6 font-medium">
                {searchQuery
                  ? `Try adjusting your search terms for "${searchQuery}"`
                  : `Start by adding your first book to the inventory`}
              </p>
              {!searchQuery && (
                <motion.button
                  onClick={onAddBook}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  <Plus size={18} />
                  Add Your First Book
                </motion.button>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="table"
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {/* Table Header */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-6 py-4 text-left font-bold text-gray-700 uppercase tracking-wider text-xs">
                        Book
                      </th>
                      <th className="px-6 py-4 text-left font-bold text-gray-700 uppercase tracking-wider text-xs">
                        Category
                      </th>
                      <th className="px-6 py-4 text-left font-bold text-gray-700 uppercase tracking-wider text-xs">
                        Price
                      </th>
                      <th className="px-6 py-4 text-left font-bold text-gray-700 uppercase tracking-wider text-xs">
                        Stock
                      </th>
                      <th className="px-6 py-4 text-left font-bold text-gray-700 uppercase tracking-wider text-xs">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <AnimatePresence mode="popLayout">
                      {filteredBooks.map((book) => (
                        <motion.tr
                          key={book.id}
                          variants={item}
                          initial="hidden"
                          animate="show"
                          exit={{ opacity: 0, x: -100 }}
                          layout
                          className="hover:bg-gray-50 transition-colors"
                        >
                          {/* Book Info */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <AuthenticatedImage
                                src={book.imageURL}
                                alt={book.title}
                                className="w-10 h-14 object-cover rounded-md shadow-sm flex-shrink-0"
                              />
                              <div className="min-w-0 flex-1">
                                <p className="font-semibold text-gray-900 truncate" title={book.title}>
                                  {book.title || "Untitled Book"}
                                </p>
                                <p className="text-xs text-gray-500 truncate" title={`by ${book.author}`}>
                                  by {book.author || "Unknown Author"}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Category */}
                          <td className="px-6 py-4">
                            <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                              {book.category}
                            </span>
                          </td>

                          {/* Price */}
                          <td className="px-6 py-4">
                            <p className="font-semibold text-gray-900">
                              ₹{(Number(book.price) || 0).toFixed(2)}
                            </p>
                          </td>

                          {/* Stock with Visual Indicator */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${book.stock === 0
                                  ? "bg-red-50 text-red-700"
                                  : book.stock < 10
                                    ? "bg-amber-50 text-amber-700"
                                    : "bg-green-50 text-green-700"
                                  }`}
                                role="status"
                                aria-label={`Stock: ${book.stock} ${book.stock === 0
                                  ? "Sold Out"
                                  : book.stock < 10
                                    ? "Low Stock"
                                    : "In Stock"
                                  }`}
                              >
                                {book.stock === 0
                                  ? "Sold Out"
                                  : book.stock < 10
                                    ? "Low Stock"
                                    : `${book.stock} units`}
                              </span>
                              {book.stock < 10 && book.stock > 0 && (
                                <AlertCircle className="w-4 h-4 text-amber-600" />
                              )}
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => onEditBook?.(book)}
                                aria-label={`Edit ${book.title}`}
                                title={`Edit ${book.title}`}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              >
                                <Edit2 size={18} />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleDelete(book.id)}
                                aria-label={`Delete ${book.title}`}
                                title={`Delete ${book.title}`}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Trash2 size={18} />
                              </motion.button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>

              {/* Table Footer */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Showing <span className="font-semibold">{filteredBooks.length}</span>{" "}
                  {filteredBooks.length === 1 ? "book" : "books"}
                  {debouncedSearch && (
                    <>
                      {" "}
                      results found
                    </>
                  )}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence> {/* Add this missing closing tag */}
      </div>
    </div>
  );
};

export default InventoryTable;
