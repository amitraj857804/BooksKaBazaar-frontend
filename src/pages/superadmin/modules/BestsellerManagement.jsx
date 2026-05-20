import React, { useState } from 'react';
import { useSuperAdmin } from '../../../context/superadmin/SuperAdminContext';
import { superAdminApi } from '../../../services/superadmin/superAdminApi';
import { AlertCircle, CheckCircle } from 'lucide-react';

const BestsellerManagement = () => {
  const { token } = useSuperAdmin();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [mode, setMode] = useState('create'); // 'create' or 'update'
  const [formData, setFormData] = useState({
    bestsellerId: '',
    bookId: '',
    bookTitle: '',
    salesCount: '',
    rating: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (
      !formData.bookId ||
      !formData.bookTitle ||
      !formData.salesCount ||
      formData.rating === ''
    ) {
      setMessage({ type: 'error', text: 'Please fill all required fields' });
      return;
    }

    const rating = parseFloat(formData.rating);
    if (rating < 0 || rating > 5) {
      setMessage({ type: 'error', text: 'Rating must be between 0 and 5' });
      return;
    }

    setLoading(true);
    try {
      const bestsellerData = {
        bookId: parseInt(formData.bookId),
        bookTitle: formData.bookTitle,
        salesCount: parseInt(formData.salesCount),
        rating: rating,
      };

      if (mode === 'create') {
        await superAdminApi.createBestseller(bestsellerData, token);
        setMessage({ type: 'success', text: 'Bestseller created successfully!' });
      } else {
        if (!formData.bestsellerId) {
          setMessage({
            type: 'error',
            text: 'Please provide bestseller ID for update',
          });
          setLoading(false);
          return;
        }
        await superAdminApi.updateBestseller(
          formData.bestsellerId,
          bestsellerData,
          token
        );
        setMessage({ type: 'success', text: 'Bestseller updated successfully!' });
      }

      setFormData({
        bestsellerId: '',
        bookId: '',
        bookTitle: '',
        salesCount: '',
        rating: '',
      });
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Mode Toggle */}
      <div className="flex gap-2 md:gap-4 bg-slate-800 rounded-lg p-3 md:p-4 border border-slate-700">
        <button
          onClick={() => setMode('create')}
          className={`flex-1 py-2 px-3 md:px-4 rounded-lg transition text-sm md:text-base ${
            mode === 'create'
              ? 'bg-amber-500 text-white'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >
          Add to Bestseller
        </button>
        <button
          onClick={() => setMode('update')}
          className={`flex-1 py-2 px-3 md:px-4 rounded-lg transition text-sm md:text-base ${
            mode === 'update'
              ? 'bg-amber-500 text-white'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >
          Update Bestseller
        </button>
      </div>

      {/* Form */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-4 md:p-6 lg:p-8">
        {message.text && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${
              message.type === 'success'
                ? 'bg-green-500/10 border border-green-500/20'
                : 'bg-red-500/10 border border-red-500/20'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            )}
            <p
              className={
                message.type === 'success' ? 'text-green-200' : 'text-red-200'
              }
            >
              {message.text}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Bestseller ID (only for update mode) */}
          {mode === 'update' && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Bestseller ID *
              </label>
              <input
                type="number"
                name="bestsellerId"
                value={formData.bestsellerId}
                onChange={handleInputChange}
                placeholder="Enter bestseller ID"
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                disabled={loading}
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Book ID */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Book ID *
              </label>
              <input
                type="number"
                name="bookId"
                value={formData.bookId}
                onChange={handleInputChange}
                placeholder="Enter book ID"
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                disabled={loading}
              />
            </div>

            {/* Book Title */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Book Title *
              </label>
              <input
                type="text"
                name="bookTitle"
                value={formData.bookTitle}
                onChange={handleInputChange}
                placeholder="Enter book title"
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                disabled={loading}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sales Count */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Sales Count *
              </label>
              <input
                type="number"
                name="salesCount"
                value={formData.salesCount}
                onChange={handleInputChange}
                placeholder="Enter sales count"
                min="0"
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                disabled={loading}
              />
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Rating * (0-5)
              </label>
              <input
                type="number"
                name="rating"
                value={formData.rating}
                onChange={handleInputChange}
                placeholder="Enter rating"
                min="0"
                max="5"
                step="0.1"
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                disabled={loading}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? mode === 'create'
                ? 'Adding to Bestseller...'
                : 'Updating Bestseller...'
              : mode === 'create'
              ? 'Add to Bestseller'
              : 'Update Bestseller'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BestsellerManagement;
