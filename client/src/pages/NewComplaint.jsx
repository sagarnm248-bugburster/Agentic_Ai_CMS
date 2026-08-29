import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useComplaintStore } from '../store/complaintStore';
import api from '../services/api';
import {
  Send,
  ArrowLeft,
  Image as ImageIcon,
  MapPin,
  Tag,
  AlertTriangle,
  FileText,
  Sparkles,
} from 'lucide-react';


const CATEGORIES = [
  { id: 'classroom', label: 'Classroom' },
  { id: 'lab', label: 'Laboratory' },
  { id: 'hostel', label: 'Hostel' },
  { id: 'wifi', label: 'Wi-Fi & Network' },
  { id: 'infrastructure', label: 'Infrastructure' },
  { id: 'transport', label: 'Transport' },
  { id: 'cleanliness', label: 'Cleanliness' },
  { id: 'other', label: 'Other' },
];

const PRIORITIES = [
  { id: 'low', label: 'Low', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
  { id: 'medium', label: 'Medium', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
  { id: 'high', label: 'High', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
  { id: 'critical', label: 'Critical', color: 'bg-rose-500/10 text-rose-400 border-rose-500/30' },
];

const NewComplaint = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('classroom');
  const [location, setLocation] = useState('');
  const [priority, setPriority] = useState('low');
  const [imageUrl, setImageUrl] = useState('');
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestedByAI, setSuggestedByAI] = useState(false);

  const { createComplaint, loading, error } = useComplaintStore();
  const navigate = useNavigate();

  const handleSuggestCategory = async () => {
    if (!description.trim() || isSuggesting) return;
    try {
      setIsSuggesting(true);
      const res = await api.post('/complaints/suggest-category', { description });
      if (res.data && res.data.category) {
        setCategory(res.data.category);
        setSuggestedByAI(true);
      }
    } catch (err) {
      console.error('Category suggestion error:', err);
    } finally {
      setIsSuggesting(false);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      title,
      description,
      category,
      location,
      priority,
      attachments: imageUrl.trim() ? [imageUrl.trim()] : [],
    };

    const res = await createComplaint(payload);
    if (res.success) {
      navigate('/student/dashboard');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Dashboard</span>
      </button>

      <div className="glass-panel p-6 sm:p-8 relative overflow-hidden">
        {/* Glow header */}
        <div className="border-b border-slate-800 pb-6 mb-6">
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <FileText className="w-7 h-7 text-indigo-400" />
            <span>Submit New Facility Issue</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Provide detailed information so the department can resolve your issue quickly.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Issue Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Issue Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Projector not working in Room 302"
              className="w-full glass-input"
            />
          </div>

          {/* Category & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-indigo-400" />
                <span>Category *</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full glass-input bg-slate-900 cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id} className="bg-slate-900 text-white">
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                <span>Location *</span>
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Science Block, 3rd Floor"
                className="w-full glass-input"
              />
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-indigo-400" />
              <span>Priority Level</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {PRIORITIES.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPriority(p.id)}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all ${
                    priority === p.id
                      ? `${p.color} ring-2 ring-indigo-500/50`
                      : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
          {/* Description */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Detailed Description *
              </label>
              {isSuggesting ? (
                <span className="flex items-center gap-1 text-[10px] text-indigo-400 font-semibold animate-pulse">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  <span>AI analyzing category...</span>
                </span>
              ) : suggestedByAI ? (
                <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>AI Suggested Category Applied</span>
                </span>
              ) : null}
            </div>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={handleSuggestCategory}
              placeholder="Describe what's wrong, when it started, and any relevant specifics..."
              className="w-full glass-input resize-none"
            />
          </div>

          {/* Attachment Image URL */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-indigo-400" />
              <span>Image Attachment URL (Optional)</span>
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/photo-1581092160607-ee22621dd758"
              className="w-full glass-input"
            />
            {imageUrl.trim() && (
              <div className="mt-3 relative rounded-xl overflow-hidden border border-slate-800 h-40 max-w-sm">
                <img
                  src={imageUrl}
                  alt="Attachment Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Submit Complaint</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewComplaint;
