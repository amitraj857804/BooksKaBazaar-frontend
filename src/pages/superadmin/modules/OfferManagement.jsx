import React, { useState } from 'react';
import { useSuperAdmin } from '../../../context/superadmin/SuperAdminContext';
import { superAdminApi } from '../../../services/superadmin/superAdminApi';
import { AlertCircle, CheckCircle } from 'lucide-react';

const OfferManagement = () => {
  const { token } = useSuperAdmin();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [mode, setMode] = useState('create'); // 'create' or 'update'
  const [formData, setFormData] = useState({
    offerId: '',
    offerName: '',
    offerDescription: '',
    discountPercentage: '',
    validFrom: '',
    validTo: '',
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
      !formData.offerName ||
      !formData.offerDescription ||
      !formData.discountPercentage ||
      !formData.validFrom ||
      !formData.validTo
    ) {
      setMessage({ type: 'error', text: 'Please fill all required fields' });
      return;
    }

    if (new Date(formData.validFrom) >= new Date(formData.validTo)) {
      setMessage({
        type: 'error',
        text: 'Valid To date must be after Valid From date',
      });
      return;
    }

    setLoading(true);
    try {
      const offerData = {
        offerName: formData.offerName,
        offerDescription: formData.offerDescription,
        discountPercentage: parseFloat(formData.discountPercentage),
        validFrom: formData.validFrom,
        validTo: formData.validTo,
      };

      if (mode === 'create') {
        await superAdminApi.createOffer(offerData, token);
        setMessage({ type: 'success', text: 'Offer created successfully!' });
      } else {
        if (!formData.offerId) {
          setMessage({ type: 'error', text: 'Please provide offer ID for update' });
          setLoading(false);
          return;
        }
        await superAdminApi.updateOffer(formData.offerId, offerData, token);
        setMessage({ type: 'success', text: 'Offer updated successfully!' });
      }

      setFormData({
        offerId: '',
        offerName: '',
        offerDescription: '',
        discountPercentage: '',
        validFrom: '',
        validTo: '',
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
          Create New Offer
        </button>
        <button
          onClick={() => setMode('update')}
          className={`flex-1 py-2 px-3 md:px-4 rounded-lg transition text-sm md:text-base ${
            mode === 'update'
              ? 'bg-amber-500 text-white'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >
          Update Offer
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
          {/* Offer ID (only for update mode) */}
          {mode === 'update' && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Offer ID *
              </label>
              <input
                type="number"
                name="offerId"
                value={formData.offerId}
                onChange={handleInputChange}
                placeholder="Enter offer ID"
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                disabled={loading}
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Offer Name */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Offer Name *
              </label>
              <input
                type="text"
                name="offerName"
                value={formData.offerName}
                onChange={handleInputChange}
                placeholder="e.g., Summer Sale"
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                disabled={loading}
              />
            </div>

            {/* Discount Percentage */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Discount Percentage * (0-100)
              </label>
              <input
                type="number"
                name="discountPercentage"
                value={formData.discountPercentage}
                onChange={handleInputChange}
                placeholder="e.g., 20"
                min="0"
                max="100"
                step="0.01"
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                disabled={loading}
              />
            </div>
          </div>

          {/* Offer Description */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Description *
            </label>
            <textarea
              name="offerDescription"
              value={formData.offerDescription}
              onChange={handleInputChange}
              placeholder="Enter offer description"
              rows="3"
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Valid From */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Valid From *
              </label>
              <input
                type="date"
                name="validFrom"
                value={formData.validFrom}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                disabled={loading}
              />
            </div>

            {/* Valid To */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Valid To *
              </label>
              <input
                type="date"
                name="validTo"
                value={formData.validTo}
                onChange={handleInputChange}
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
                ? 'Creating Offer...'
                : 'Updating Offer...'
              : mode === 'create'
              ? 'Create Offer'
              : 'Update Offer'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OfferManagement;
