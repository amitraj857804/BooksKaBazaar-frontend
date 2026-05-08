import { useState, useCallback } from "react";
import StatsCards from "../../components/admin/StatsCards";
import InventoryTable from "../../components/admin/InventoryTable";
import BookForm from "../../components/admin/BookForm";
import { mockAdminBooks } from "../../utils/mockAdminBooks";

const InventoryPage = () => {
  const [books, setBooks] = useState(mockAdminBooks);
  const [showBookForm, setShowBookForm] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [isLoadingForm, setIsLoadingForm] = useState(false);

  // Mock stats calculation
  const stats = {
    totalRevenue: books.reduce((sum, book) => sum + book.price * 10, 0),
    revenueGrowth: 12.5,
    totalBooks: books.length,
    booksGrowth: 8,
    activeOrders: 342,
    ordersGrowth: 24,
    customerGrowth: 1284,
    newCustomers: 52,
  };

  // Handle add book
  const handleAddBook = useCallback(() => {
    setEditingBook(null);
    setShowBookForm(true);
  }, []);

  // Handle edit book
  const handleEditBook = useCallback((book) => {
    setEditingBook(book);
    setShowBookForm(true);
  }, []);

  // Handle form submission
  const handleFormSubmit = useCallback(
    async (formData) => {
      setIsLoadingForm(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (editingBook) {
        // Update existing book
        setBooks((prevBooks) =>
          prevBooks.map((book) =>
            book.id === editingBook.id ? { ...book, ...formData } : book
          )
        );
      } else {
        // Add new book
        const newBook = {
          id: Math.max(...books.map((b) => b.id), 0) + 1,
          ...formData,
        };
        setBooks((prevBooks) => [newBook, ...prevBooks]);
      }

      setIsLoadingForm(false);
      setShowBookForm(false);
      setEditingBook(null);
    },
    [editingBook, books]
  );

  // Handle delete book (optimistic)
  const handleDeleteBook = useCallback((bookId) => {
    setBooks((prevBooks) => prevBooks.filter((book) => book.id !== bookId));
  }, []);

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <StatsCards stats={stats} />

      {/* Inventory Table */}
      <InventoryTable
        books={books}
        onAddBook={handleAddBook}
        onEditBook={handleEditBook}
        onDeleteBook={handleDeleteBook}
        isLoading={false}
      />

      {/* Book Form Drawer */}
      <BookForm
        isOpen={showBookForm}
        onClose={() => {
          setShowBookForm(false);
          setEditingBook(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={editingBook}
      />
    </div>
  );
};

export default InventoryPage;
