import { useState, useCallback, useEffect } from "react";
import StatsCards from "../../components/admin/StatsCards";
import InventoryTable from "../../components/admin/InventoryTable";
import BookForm from "../../components/admin/BookForm";
import { mockAdminBooks } from "../../utils/mockAdminBooks";
import { adminApi } from "../../services/admin/adminApi";

const InventoryPage = () => {
  const [books, setBooks] = useState(mockAdminBooks);
  const [showBookForm, setShowBookForm] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [isLoadingForm, setIsLoadingForm] = useState(false);
  
  const [inventoryStats, setInventoryStats] = useState({
    totalBooks: 0,
    totalAvailable: 0,
    lowStockCount: 0,
    outOfStockCount: 0,
    totalReserved: 0,
    totalDamaged: 0,
    turnoverRate: 0
  });

  const [isLoadingStats, setIsLoadingStats] = useState(true);

  // Fetch Stats from backend
  const fetchStats = async () => {
    try {
      setIsLoadingStats(true);
      const data = await adminApi.getInventoryStats();
      console.log(data);
      // Handle both wrapped {success: true, data: {...}} and unwrapped {...stats} responses
      if (data && data.success !== undefined) {
        if (data.success && data.data) {
          setInventoryStats(data.data);
        }
      } else if (data) {
        // Unwrapped response
        setInventoryStats({
          totalBooks: data.totalBooks || 0,
          totalAvailable: data.totalAvailable || 0,
          lowStockCount: data.lowStockCount || 0,
          outOfStockCount: data.outOfStockCount || 0,
          totalReserved: data.totalReserved || 0,
          totalDamaged: data.totalDamaged || 0,
          turnoverRate: data.turnoverRate || 0
        });
      }
    } catch (error) {
      console.error("❌ Failed to fetch inventory stats:", error);
    } finally {
      setIsLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

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
      <StatsCards stats={inventoryStats} isLoading={isLoadingStats} />

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
