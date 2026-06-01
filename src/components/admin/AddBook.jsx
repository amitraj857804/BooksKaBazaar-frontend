import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Image, AlertCircle } from "lucide-react";
import { adminApi } from "../../services/admin/adminApi";

const AddBook = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    bookTitle: "",
    authorName: "",
    isbn: "",
    description: "",
    category: "Technology",
    publisher: "",
    publicationYear: new Date().getFullYear(),
    price: "",
    costPrice: "",
    initialStock: "",
    image: null,
    imagePreview: null,
  });

  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "publicationYear" || name === "price" || name === "costPrice" || name === "initialStock" ? (value ? parseFloat(value) : "") : value,
    }));
  };

  const handleImageUpload = async (file) => {
    if (!file || !file.type.startsWith("image/")) {
      setError("Please select a valid image file");
      return;
    }

    // Preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setFormData((prev) => ({
        ...prev,
        image: file,
        imagePreview: e.target.result,
      }));
      setError("");
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleImageUpload(files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation - make it less strict as requested
    if (!formData.bookTitle) {
      setError("At least a book title is required");
      return;
    }

    setIsSubmitting(true);
    try {
      const bookData = {
        bookTitle: formData.bookTitle,
        authorName: formData.authorName,
        isbn: formData.isbn,
        description: formData.description,
        category: formData.category,
        publisher: formData.publisher,
        publicationYear: parseInt(formData.publicationYear),
        price: parseFloat(formData.price),
        costPrice: parseFloat(formData.costPrice),
        initialStock: parseInt(formData.initialStock),
      };

      await adminApi.createBook(bookData, formData.image);

      // Reset form
      setFormData({
        bookTitle: "",
        authorName: "",
        isbn: "",
        description: "",
        category: "Technology",
        publisher: "",
        publicationYear: new Date().getFullYear(),
        price: "",
        costPrice: "",
        initialStock: "",
        image: null,
        imagePreview: null,
      });

      onSubmit?.();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to add book");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Slide-Over Modal */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-screen w-full max-w-lg bg-white z-50 shadow-2xl overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Add New Book</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={24} className="text-gray-600" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Book Cover Image
                </label>
                <motion.div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                    isDragging
                      ? "border-red-500 bg-red-50"
                      : "border-gray-200 hover:border-red-200 bg-gray-50/50"
                  }`}
                  animate={{ 
                    backgroundColor: isDragging ? "#fef2f2" : "#f9fafb",
                    borderColor: isDragging ? "#ef4444" : "#e5e7eb"
                  }}
                >
                  {formData.imagePreview ? (
                    <div className="space-y-4">
                      <div className="relative group mx-auto w-40 h-56 bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 p-1">
                        <div className="w-full h-full rounded-lg overflow-hidden relative">
                          <img
                            src={formData.imagePreview}
                            alt="Preview"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                             <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  fileInputRef.current?.click();
                                }}
                                className="p-2 bg-white rounded-full text-red-600 shadow-lg hover:bg-red-50 transition-colors"
                             >
                                <Image size={20} />
                             </button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-center gap-1">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Photo Uploaded Album</p>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="text-sm text-red-600 hover:text-red-700 font-medium underline underline-offset-4"
                        >
                          Upload Different Photo
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center py-6 gap-3">
                      <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-500">
                        <Image size={32} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">
                          Upload Book Cover
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Drag and drop or click to browse
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="mt-2 px-4 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-semibold text-gray-700 hover:border-red-300 hover:text-red-600 transition-all shadow-sm"
                      >
                        Choose Image
                      </button>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        handleImageUpload(e.target.files[0]);
                      }
                    }}
                    className="hidden"
                  />
                </motion.div>
                {isUploading && (
                  <p className="text-xs text-gray-500 mt-2 flex items-center gap-2">
                    <Upload size={14} /> Uploading...
                  </p>
                )}
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Book Title *
                </label>
                <input
                  type="text"
                  name="bookTitle"
                  value={formData.bookTitle}
                  onChange={handleInputChange}
                  placeholder="Enter book title"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              {/* Author */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Author Name *
                </label>
                <input
                  type="text"
                  name="authorName"
                  value={formData.authorName}
                  onChange={handleInputChange}
                  placeholder="Enter author name"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              {/* Price & Cost Price */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Selling Price ($) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Cost Price ($) *
                  </label>
                  <input
                    type="number"
                    name="costPrice"
                    value={formData.costPrice}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Category & Initial Stock */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option>Technology</option>
                    <option>Fiction</option>
                    <option>Non-Fiction</option>
                    <option>Science Fiction</option>
                    <option>Romance</option>
                    <option>Mystery</option>
                    <option>Biography</option>
                    <option>Self-Help</option>
                    <option>History</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Initial Stock *
                  </label>
                  <input
                    type="number"
                    name="initialStock"
                    value={formData.initialStock}
                    onChange={handleInputChange}
                    placeholder="0"
                    min="0"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Publisher & Publication Year */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Publisher
                  </label>
                  <input
                    type="text"
                    name="publisher"
                    value={formData.publisher}
                    onChange={handleInputChange}
                    placeholder="Enter publisher name"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Publication Year
                  </label>
                  <input
                    type="number"
                    name="publicationYear"
                    value={formData.publicationYear}
                    onChange={handleInputChange}
                    placeholder={new Date().getFullYear()}
                    min="1900"
                    max={new Date().getFullYear()}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* ISBN */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ISBN
                </label>
                <input
                  type="text"
                  name="isbn"
                  value={formData.isbn}
                  onChange={handleInputChange}
                  placeholder="978-0-..."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter book description"
                  rows="4"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Adding..." : "Add Book"}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AddBook;
