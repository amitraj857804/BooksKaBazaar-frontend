import { useState, useCallback, useEffect } from "react";
import StatsCards from "../../components/admin/StatsCards";
import InventoryTable from "../../components/admin/InventoryTable";
import BookForm from "../../components/admin/BookForm";
import { mockAdminBooks } from "../../utils/mockAdminBooks";
import { adminApi } from "../../services/admin/adminApi";

const InventoryPage = () => {
  const [books, setBooks] = useState([]);
  const [showBookForm, setShowBookForm] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [isLoadingForm, setIsLoadingForm] = useState(false);
  const [isLoadingBooks, setIsLoadingBooks] = useState(true);
  
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

  // Fetch Books from backend
  const fetchBooks = useCallback(async (query = "") => {
    try {
      setIsLoadingBooks(true);
      let data;
      if (query) {
        const response = await adminApi.searchBooks(query);
        data = response.data;
      } else {
        const response = await adminApi.getBooks();
        data = response.data;
      }
      
      let booksArray = [];
      if (data && Array.isArray(data)) {
        booksArray = data;
      } else if (data && data.success && Array.isArray(data.data)) {
        booksArray = data.data;
      } else if (data && Array.isArray(data.data)) {
        booksArray = data.data;
      }
      
      const mappedBooks = booksArray.map(book => ({
        id: book.bookId,
        title: book.bookTitle,
        author: book.authorName,
        price: book.price,
        category: book.category,
        stock: book.availableStock,
        imageURL: book.imageFileName 
          ? `/admin/inventory/books/${book.bookId}/image`
          : "https://images.unsplash.com/photo-1543565521-bcf289c60034?w=200&h=300&fit=crop",
        isbn: book.isbn,
        description: book.description,
        totalStock: book.totalStock,
        reservedStock: book.reservedStock,
        damagedStock: book.damagedStock
      }));
      
      setBooks(mappedBooks);
    } catch (error) {
      console.error("❌ Failed to fetch books:", error);
      setBooks([]); // Clear books on error
    } finally {
      setIsLoadingBooks(false);
    }
  }, []);

  // Fetch Stats from backend
  const fetchStats = useCallback(async () => {
    try {
      setIsLoadingStats(true);
      const data = await adminApi.getInventoryStats();
      
      if (data && data.success) {
        setInventoryStats(data.data);
      }
    } catch (error) {
      console.error("❌ Failed to fetch inventory stats:", error);
    } finally {
      setIsLoadingStats(false);
    }
  }, []);

  useEffect(() => {
    fetchBooks();
    fetchStats();
  }, [fetchBooks, fetchStats]);

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
    async (formData, imageFile) => {
      setIsLoadingForm(true);

      try {
        if (editingBook) {
          // Update existing book with potential new image
          await adminApi.updateBook(editingBook.id, formData, imageFile);
        } else {
          // Add new book with image
          await adminApi.createBook(formData, imageFile);
        }
        
        // Refresh data
        await fetchBooks();
        await fetchStats();
        
        setShowBookForm(false);
        setEditingBook(null);
      } catch (error) {
        console.error("❌ Failed to save book:", error);
        alert("Failed to save book. Please try again.");
      } finally {
        setIsLoadingForm(false);
      }
    },
    [editingBook]
  );

  // Handle delete book
  const handleDeleteBook = useCallback(async (bookId) => {
    try {
      await adminApi.deleteBook(bookId);
      // Refresh data
      await fetchBooks();
      await fetchStats();
    } catch (error) {
      console.error("❌ Failed to delete book:", error);
      alert("Failed to delete book. Please try again.");
    }
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
        onSearch={fetchBooks}
        isLoading={isLoadingBooks}
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
