import { useState, useRef, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Image as ImageIcon, AlertCircle, CheckCircle } from "lucide-react";

// Zod validation schema
const bookFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  author: z.string().min(2, "Author name required"),
  price: z.coerce.number().min(0.01, "Price must be greater than 0"),
  category: z.string().min(1, "Category required"),
  stock: z.coerce.number().min(0, "Stock cannot be negative").int(),
  isbn: z.string().optional(),
  description: z.string().optional(),
});

const BookForm = ({ isOpen, onClose, onSubmit, initialData = null }) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(initialData?.imageURL || null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm({
    resolver: zodResolver(bookFormSchema),
    defaultValues: initialData || {
      title: "",
      author: "",
      price: "",
      category: "Fiction",
      stock: "",
      isbn: "",
      description: "",
    },
  });

  // Simulate S3 upload with progress
  const handleImageUpload = useCallback(async (file) => {
    if (!file || !file.type.startsWith("image/")) {
      alert("Please select a valid image file");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    // Read file and create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target.result);
    };
    reader.readAsDataURL(file);

    // Simulate progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return prev;
        }
        return prev + Math.random() * 30;
      });
    }, 200);

    // Simulate S3 upload (replace with real API)
    setTimeout(() => {
      clearInterval(interval);
      setUploadProgress(100);
      setIsUploading(false);

      // In production: get actual S3 URL from backend
      console.log("Image uploaded (simulated):", file.name);

      setTimeout(() => {
        setUploadProgress(0);
      }, 1000);
    }, 2000);
  }, []);

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
    if (e.dataTransfer.files?.[0]) {
      handleImageUpload(e.dataTransfer.files[0]);
    }
  };

  const onSubmitForm = async (data) => {
    const formData = {
      ...data,
      imageURL: uploadedImage || initialData?.imageURL,
    };
    await onSubmit?.(formData);
    reset();
    setUploadedImage(null);
    onClose();
  };

  const handleClose = () => {
    reset();
    setUploadedImage(null);
    setUploadProgress(0);
    setIsUploading(false);
    onClose();
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
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 z-40"
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-screen w-full max-w-lg bg-white z-50 shadow-2xl overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-labelledby="book-form-title"
          >
            {/* Sticky Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 id="book-form-title" className="text-xl font-bold text-gray-900">
                {initialData ? "Edit Book" : "Add New Book"}
              </h2>
              <button
                onClick={handleClose}
                aria-label="Close form"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={24} className="text-gray-600" />
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit(onSubmitForm)}
              className="p-6 space-y-6"
              noValidate
            >
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Book Cover Image
                </label>
                <motion.div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${
                    isDragging
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300 hover:border-gray-400 bg-gray-50"
                  }`}
                  animate={{
                    backgroundColor: isDragging ? "#fef2f2" : "#f9fafb",
                  }}
                >
                  {uploadedImage ? (
                    <div className="flex flex-col items-center gap-4">
                      <motion.img
                        src={uploadedImage}
                        alt="Preview"
                        className="w-24 h-32 object-cover rounded-lg shadow-md"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                      />
                      {isUploading && (
                        <div className="w-32">
                          <div className="flex items-center gap-2 mb-2">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                            >
                              <Upload size={16} className="text-red-600" />
                            </motion.div>
                            <span className="text-xs font-medium text-gray-600">
                              {Math.round(uploadProgress)}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <motion.div
                              className="bg-red-600 h-2 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${uploadProgress}%` }}
                              transition={{ duration: 0.3 }}
                            />
                          </div>
                        </div>
                      )}
                      {!isUploading && (
                        <motion.button
                          type="button"
                          onClick={() => {
                            fileInputRef.current?.click();
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="text-sm text-red-600 hover:text-red-700 font-medium"
                        >
                          Change Image
                        </motion.button>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <ImageIcon size={32} className="text-gray-400" />
                      <p className="text-sm font-medium text-gray-700">
                        Drag and drop your image here
                      </p>
                      <p className="text-xs text-gray-500">or</p>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-sm text-red-600 hover:text-red-700 font-medium"
                      >
                        Browse files
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
                    aria-label="Upload book cover image"
                  />
                </motion.div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Title *
                </label>
                <Controller
                  name="title"
                  control={control}
                  render={({ field }) => (
                    <>
                      <input
                        {...field}
                        placeholder="Enter book title"
                        className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${
                          errors.title ? "border-red-500" : "border-gray-300"
                        }`}
                        aria-invalid={!!errors.title}
                        aria-describedby={errors.title ? "title-error" : undefined}
                      />
                      {errors.title && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          id="title-error"
                          className="text-red-500 text-sm mt-2 flex items-center gap-1"
                        >
                          <AlertCircle size={14} />
                          {errors.title.message}
                        </motion.p>
                      )}
                    </>
                  )}
                />
              </div>

              {/* Author */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Author *
                </label>
                <Controller
                  name="author"
                  control={control}
                  render={({ field }) => (
                    <>
                      <input
                        {...field}
                        placeholder="Enter author name"
                        className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${
                          errors.author ? "border-red-500" : "border-gray-300"
                        }`}
                        aria-invalid={!!errors.author}
                        aria-describedby={errors.author ? "author-error" : undefined}
                      />
                      {errors.author && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          id="author-error"
                          className="text-red-500 text-sm mt-2 flex items-center gap-1"
                        >
                          <AlertCircle size={14} />
                          {errors.author.message}
                        </motion.p>
                      )}
                    </>
                  )}
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Price (₹) *
                </label>
                <Controller
                  name="price"
                  control={control}
                  render={({ field }) => (
                    <>
                      <input
                        {...field}
                        type="number"
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${
                          errors.price ? "border-red-500" : "border-gray-300"
                        }`}
                        aria-invalid={!!errors.price}
                        aria-describedby={errors.price ? "price-error" : undefined}
                      />
                      {errors.price && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          id="price-error"
                          className="text-red-500 text-sm mt-2 flex items-center gap-1"
                        >
                          <AlertCircle size={14} />
                          {errors.price.message}
                        </motion.p>
                      )}
                    </>
                  )}
                />
              </div>

              {/* Category & Stock */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category *
                  </label>
                  <Controller
                    name="category"
                    control={control}
                    render={({ field }) => (
                      <select
                        {...field}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                      >
                        <option>Fiction</option>
                        <option>Non-Fiction</option>
                        <option>Science Fiction</option>
                        <option>Romance</option>
                        <option>Mystery</option>
                        <option>Biography</option>
                        <option>Self-Help</option>
                        <option>History</option>
                      </select>
                    )}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Stock *
                  </label>
                  <Controller
                    name="stock"
                    control={control}
                    render={({ field }) => (
                      <>
                        <input
                          {...field}
                          type="number"
                          placeholder="0"
                          min="0"
                          className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${
                            errors.stock ? "border-red-500" : "border-gray-300"
                          }`}
                          aria-invalid={!!errors.stock}
                          aria-describedby={errors.stock ? "stock-error" : undefined}
                        />
                        {errors.stock && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            id="stock-error"
                            className="text-red-500 text-sm mt-2 flex items-center gap-1"
                          >
                            <AlertCircle size={14} />
                            {errors.stock.message}
                          </motion.p>
                        )}
                      </>
                    )}
                  />
                </div>
              </div>

              {/* ISBN */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ISBN
                </label>
                <Controller
                  name="isbn"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      placeholder="978-0-..."
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                    />
                  )}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <textarea
                      {...field}
                      placeholder="Enter book description"
                      rows="4"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all resize-none"
                    />
                  )}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-6 border-t border-gray-200 sticky bottom-0 bg-white pb-6">
                <motion.button
                  type="button"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  disabled={isSubmitting || isUploading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        <Upload size={18} />
                      </motion.div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={18} />
                      {initialData ? "Update Book" : "Add Book"}
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BookForm;
