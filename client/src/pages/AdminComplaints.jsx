import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useComplaintStore } from '../store/complaintStore';
import {
  ListFilter,
  Search,
  ChevronRight,
  MapPin,
  Tag,
  AlertCircle,
  Inbox,
  XCircle,
} from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'All Categories' },
  { id: 'classroom', label: 'Classroom' },
  { id: 'lab', label: 'Laboratory' },
  { id: 'hostel', label: 'Hostel' },
  { id: 'wifi', label: 'Wi-Fi & Network' },
  { id: 'infrastructure', label: 'Infrastructure' },
  { id: 'transport', label: 'Transport' },
  { id: 'cleanliness', label: 'Cleanliness' },
  { id: 'other', label: 'Other' },
];

const STATUSES = [
  { id: 'all', label: 'All Statuses' },
  { id: 'submitted', label: 'Submitted' },
  { id: 'under_review', label: 'Under Review' },
  { id: 'assigned', label: 'Assigned' },
  { id: 'in_progress', label: 'In Progress' },
  { id: 'resolved', label: 'Resolved' },
  { id: 'closed', label: 'Closed' },
];

const PRIORITIES = [
  { id: 'all', label: 'All Priorities' },
  { id: 'low', label: 'Low' },
  { id: 'medium', label: 'Medium' },
  { id: 'high', label: 'High' },
  { id: 'critical', label: 'Critical' },
];

const STATUS_BADGES = {
  submitted: { label: 'Submitted', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
  under_review: { label: 'Under Review', color: 'bg-purple-500/10 text-purple-400 border-purple-500/30' },
  assigned: { label: 'Assigned', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
  in_progress: { label: 'In Progress', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' },
  resolved: { label: 'Resolved', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
  closed: { label: 'Closed', color: 'bg-slate-500/10 text-slate-400 border-slate-500/30' },
};

const AdminComplaints = () => {
  const { complaints, fetchComplaints, loading, error } = useComplaintStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');

  useEffect(() => {
    // Build query filters
    const filters = {};
    if (selectedCategory !== 'all') filters.category = selectedCategory;
    if (selectedStatus !== 'all') filters.status = selectedStatus;
    if (selectedPriority !== 'all') filters.priority = selectedPriority;

    fetchComplaints(filters);
  }, [selectedCategory, selectedStatus, selectedPriority, fetchComplaints]);

  // Front-end filter for text search matches on title, description, location, or student name
  const filteredComplaints = complaints.filter((c) => {
    const term = searchTerm.toLowerCase();
    return (
      c.title.toLowerCase().includes(term) ||
      c.description.toLowerCase().includes(term) ||
      c.location.toLowerCase().includes(term) ||
      (c.studentId?.name || '').toLowerCase().includes(term)
    );
  });

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedStatus('all');
    setSelectedPriority('all');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Manage All Complaints</h1>
        <p className="text-slate-400 text-sm mt-1">
          Search, filter, and choose a ticket to update assignment, comments, or resolution details.
        </p>
      </div>

      {/* Filter and Search Panel */}
      <div className="glass-panel p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
        {/* Search */}
        <div className="lg:col-span-2 space-y-2">
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Search Tickets
          </label>
          <div className="relative">
            <Search className="w-5 h-5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search title, student name, location..."
              className="w-full glass-input pl-11 py-2 text-sm"
            />
          </div>
        </div>

        {/* Category */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full glass-input py-2 text-sm bg-slate-900 cursor-pointer"
          >
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id} className="bg-slate-900">
                {c.label}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Status
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full glass-input py-2 text-sm bg-slate-900 cursor-pointer"
          >
            {STATUSES.map((s) => (
              <option key={s.id} value={s.id} className="bg-slate-900">
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {/* Priority */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Priority
          </label>
          <div className="flex gap-2">
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="w-full glass-input py-2 text-sm bg-slate-900 cursor-pointer"
            >
              {PRIORITIES.map((p) => (
                <option key={p.id} value={p.id} className="bg-slate-900">
                  {p.label}
                </option>
              ))}
            </select>

            {(searchTerm || selectedCategory !== 'all' || selectedStatus !== 'all' || selectedPriority !== 'all') && (
              <button
                onClick={clearFilters}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition-colors"
                title="Clear All Filters"
              >
                <XCircle className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main List Area */}
      <div className="space-y-4">
        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="glass-panel p-12 text-center">
            <div className="w-8 h-8 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto"></div>
            <p className="text-slate-400 text-sm mt-3">Loading tickets from database...</p>
          </div>
        ) : filteredComplaints.length === 0 ? (
          <div className="glass-panel p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-800/80 text-slate-500 flex items-center justify-center mx-auto">
              <Inbox className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">No matching complaints</h3>
              <p className="text-slate-400 text-sm mt-1">
                Try widening your category, priority or status filters, or checking your spelling.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredComplaints.map((c) => {
              const statusBadge = STATUS_BADGES[c.status] || STATUS_BADGES.submitted;
              return (
                <Link
                  key={c._id}
                  to={`/admin/complaints/${c._id}`}
                  className="glass-panel p-5 hover:border-slate-700 transition-all hover:translate-x-1 group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border uppercase tracking-wider ${statusBadge.color}`}>
                        {statusBadge.label}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md text-xs font-bold uppercase ${
                        c.priority === 'critical'
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          : c.priority === 'high'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {c.priority} priority
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white group-hover:text-purple-400 transition-colors">
                      {c.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                      <span className="font-semibold text-slate-300">
                        By: {c.studentId?.name || 'Unknown Student'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Tag className="w-3.5 h-3.5 text-purple-400" />
                        <span className="capitalize">{c.category}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-purple-400" />
                        <span>{c.location}</span>
                      </span>
                      <span>
                        Received {new Date(c.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-purple-400 font-semibold text-xs group-hover:translate-x-1 transition-transform self-end sm:self-center">
                    <span>Manage Ticket</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminComplaints;
