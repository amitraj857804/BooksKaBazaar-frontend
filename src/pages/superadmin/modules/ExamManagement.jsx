import React, { useState } from 'react';
import { useSuperAdmin } from '../../../context/superadmin/SuperAdminContext';
import { superAdminApi } from '../../../services/superadmin/superAdminApi';
import { AlertCircle, CheckCircle } from 'lucide-react';

const ExamManagement = () => {
  const { token } = useSuperAdmin();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [mode, setMode] = useState('create'); // 'create' or 'update'
  const [formData, setFormData] = useState({
    examId: '',
    examName: '',
    examDescription: '',
    examDate: '',
    totalQuestions: '',
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
      !formData.examName ||
      !formData.examDescription ||
      !formData.examDate ||
      !formData.totalQuestions
    ) {
      setMessage({ type: 'error', text: 'Please fill all required fields' });
      return;
    }

    setLoading(true);
    try {
      const examData = {
        examName: formData.examName,
        examDescription: formData.examDescription,
        examDate: formData.examDate,
        totalQuestions: parseInt(formData.totalQuestions),
      };

      if (mode === 'create') {
        await superAdminApi.createExam(examData, token);
        setMessage({ type: 'success', text: 'Exam created successfully!' });
      } else {
        if (!formData.examId) {
          setMessage({ type: 'error', text: 'Please provide exam ID for update' });
          setLoading(false);
          return;
        }
        await superAdminApi.updateExam(formData.examId, examData, token);
        setMessage({ type: 'success', text: 'Exam updated successfully!' });
      }

      setFormData({
        examId: '',
        examName: '',
        examDescription: '',
        examDate: '',
        totalQuestions: '',
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
          Create New Exam
        </button>
        <button
          onClick={() => setMode('update')}
          className={`flex-1 py-2 px-3 md:px-4 rounded-lg transition text-sm md:text-base ${
            mode === 'update'
              ? 'bg-amber-500 text-white'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >
          Update Exam
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
          {/* Exam ID (only for update mode) */}
          {mode === 'update' && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Exam ID *
              </label>
              <input
                type="number"
                name="examId"
                value={formData.examId}
                onChange={handleInputChange}
                placeholder="Enter exam ID"
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                disabled={loading}
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Exam Name */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Exam Name *
              </label>
              <input
                type="text"
                name="examName"
                value={formData.examName}
                onChange={handleInputChange}
                placeholder="e.g., JEE Advanced 2024"
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                disabled={loading}
              />
            </div>

            {/* Exam Date */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Exam Date *
              </label>
              <input
                type="date"
                name="examDate"
                value={formData.examDate}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                disabled={loading}
              />
            </div>
          </div>

          {/* Exam Description */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Description *
            </label>
            <textarea
              name="examDescription"
              value={formData.examDescription}
              onChange={handleInputChange}
              placeholder="Enter exam description"
              rows="4"
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
              disabled={loading}
            />
          </div>

          {/* Total Questions */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Total Questions *
            </label>
            <input
              type="number"
              name="totalQuestions"
              value={formData.totalQuestions}
              onChange={handleInputChange}
              placeholder="Enter total number of questions"
              min="1"
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
              disabled={loading}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? mode === 'create'
                ? 'Creating Exam...'
                : 'Updating Exam...'
              : mode === 'create'
              ? 'Create Exam'
              : 'Update Exam'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ExamManagement;
