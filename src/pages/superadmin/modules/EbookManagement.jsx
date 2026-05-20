import React, { useState } from 'react';
import { useSuperAdmin } from '../../../context/superadmin/SuperAdminContext';
import { superAdminApi } from '../../../services/superadmin/superAdminApi';
import { AlertCircle, CheckCircle, Upload } from 'lucide-react';

const EbookManagement = () => {
  const { token } = useSuperAdmin();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    bookTitle: '',
    author: '',
    fileName: '',
    fileContent: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        fileName: file.name,
        fileContent: file,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (!formData.bookTitle || !formData.author || !formData.fileContent) {
      setMessage({ type: 'error', text: 'Please fill all fields' });
      return;
    }

    setLoading(true);
    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result.split(',')[1];
        const uploadData = {
          bookTitle: formData.bookTitle,
          author: formData.author,
          fileName: formData.fileName,
          fileContent: base64,
        };

        await superAdminApi.uploadEbook(uploadData, token);
        setMessage({ type: 'success', text: 'Ebook uploaded successfully!' });
        setFormData({
          bookTitle: '',
          author: '',
          fileName: '',
          fileContent: null,
        });
      };
      reader.readAsDataURL(formData.fileContent);
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 p-4 md:p-6 lg:p-8">
      <h3 className="text-xl md:text-2xl font-bold text-white mb-6">Upload New Ebook</h3>

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

          {/* Author */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Author *
            </label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleInputChange}
              placeholder="Enter author name"
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
              disabled={loading}
            />
          </div>
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            PDF File *
          </label>
          <div className="relative">
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
              disabled={loading}
            />
            <label
              htmlFor="file-upload"
              className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-slate-600 rounded-lg cursor-pointer hover:border-amber-500 transition"
            >
              <Upload className="w-5 h-5 text-slate-400" />
              <span className="text-slate-300">
                {formData.fileName || 'Click to upload PDF'}
              </span>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Uploading...' : 'Upload Ebook'}
        </button>
      </form>
    </div>
  );
};

export default EbookManagement;
