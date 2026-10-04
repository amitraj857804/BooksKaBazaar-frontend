import { useState, useRef, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Image as ImageIcon, AlertCircle, CheckCircle } from "lucide-react";
import AuthenticatedImage from "../common/AuthenticatedImage";

// Zod validation schema - basic fields are required for creation, but can be optional for updates
const getBookFormSchema = (isEdit) => z.object({
  title: isEdit ? z.string().optional().or(z.literal("")) : z.string().min(1, "Title is required"),
  author: isEdit ? z.string().optional().or(z.literal("")) : z.string().min(1, "Author name required"),
  price: isEdit
    ? z.union([z.coerce.number().min(0), z.literal(""), z.null(), z.undefined()])
    : z.coerce.number().min(0, "Price must be at least 0"),
  category: z.string().optional(),
  stock: z.coerce.number().min(0, "Stock cannot be negative").int().optional().or(z.literal("")),
  isbn: z.string().optional().or(z.literal("")),
  description: z.string().optional().or(z.literal("")),
});

const BookForm = ({ isOpen, onClose, onSubmit, initialData = null }) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(initialData?.imageURL || null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm({
    resolver: zodResolver(getBookFormSchema(!!initialData)),
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
      toast.error("Please select a valid image file");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setSelectedFile(file);

    // Read file and create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target.result);
    };
    reader.readAsDataURL(file);

    // Simulate progress for UI feedback
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return prev;
        }
        return prev + Math.random() * 30;
      });
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      setUploadProgress(100);
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }, 800);
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
    // Pass both data and the actual file object
    await onSubmit?.(data, selectedFile);
    reset();
    setUploadedImage(null);
    setSelectedFile(null);
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
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
              <h2 id="book-form-title" className="text-xl font-bold text-gray-900">
                {initialData ? "Edit Book" : "Add New Book"}
              </h2>
              <button
                onClick={handleClose}
                aria-label="Close form"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={24} className="text-gray-600 cursor-pointer" />
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
                  className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${isDragging
                    ? "border-red-500 bg-red-50"
                    : "border-gray-200 hover:border-red-200 bg-gray-50/50 hover:cursor-pointer"
                    }`}
                  animate={{
                    backgroundColor: isDragging ? "#fef2f2" : "#f9fafb",
                    borderColor: isDragging ? "#ef4444" : "#e5e7eb",
                  }}
                >
                  {uploadedImage ? (
                    <div className="space-y-4">
                      <div className="relative group mx-auto w-40 h-56 bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 p-1 ">
                        <div className="w-full h-full rounded-lg overflow-hidden relative">
                          <AuthenticatedImage
                            src={uploadedImage}
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
                              className="p-2 bg-white rounded-full text-red-600 cursor-pointer shadow-lg hover:bg-red-50 transition-colors"
                            >
                              <ImageIcon size={20} />
                            </button>
                          </div>
                        </div>
                        {isUploading && (
                          <div className="absolute inset-0 bg-white/80 flex items-center justify-center p-4">
                            <div className="w-full">
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="mx-auto mb-2 text-red-600"
                              >
                                <Upload size={24} />
                              </motion.div>
                              <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                                <motion.div
                                  className="bg-red-600 h-full"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${uploadProgress}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col items-center gap-1">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Photo Uploaded Album</p>
                        {!isUploading && (
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="text-sm text-red-600 cursor-pointer hover:text-red-700 font-medium underline underline-offset-4"
                          >
                            Upload Different Photo
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center py-6 gap-3">
                      <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-500">
                        <ImageIcon size={32} />
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
                        className="mt-2 px-4 py-1.5 bg-white border cursor-pointer border-gray-200 rounded-full text-xs font-semibold text-gray-700 hover:border-red-300 hover:text-red-600 transition-all shadow-sm"
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
                    aria-label="Upload book cover image"
                  />
                </motion.div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Title {initialData ? "" : "*"}
                </label>
                <Controller
                  name="title"
                  control={control}
                  render={({ field }) => (
                    <>
                      <input
                        {...field}
                        placeholder="Enter book title"
                        className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${errors.title ? "border-red-500" : "border-gray-300"
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
                  Author {initialData ? "" : "*"}
                </label>
                <Controller
                  name="author"
                  control={control}
                  render={({ field }) => (
                    <>
                      <input
                        {...field}
                        placeholder="Enter author name"
                        className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${errors.author ? "border-red-500" : "border-gray-300"
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
                  Price (₹) {initialData ? "" : "*"}
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
                        className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${errors.price ? "border-red-500" : "border-gray-300"
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
                    Category {initialData ? "" : "*"}
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
                    Stock {initialData ? "" : "*"}
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
                          className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${errors.stock ? "border-red-500" : "border-gray-300"
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
              <div className="flex gap-3 pt-6 border-t border-gray-200 sticky bottom-0 bg-white pb-6 z-10">
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
