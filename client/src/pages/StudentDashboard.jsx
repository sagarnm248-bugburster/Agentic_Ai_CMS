import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useComplaintStore } from '../store/complaintStore';
import {
  PlusCircle,
  FileText,
  CheckCircle2,
  Clock,
  ChevronRight,
  MapPin,
  Tag,
  AlertCircle,
  Inbox,
} from 'lucide-react';

const STATUS_BADGES = {
  submitted: { label: 'Submitted', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
  under_review: { label: 'Under Review', color: 'bg-purple-500/10 text-purple-400 border-purple-500/30' },
  assigned: { label: 'Assigned', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
  in_progress: { label: 'In Progress', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' },
  resolved: { label: 'Resolved', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
  closed: { label: 'Closed', color: 'bg-slate-500/10 text-slate-400 border-slate-500/30' },
};

const StudentDashboard = () => {
  const { user } = useAuthStore();
  const { complaints, fetchComplaints, loading, error } = useComplaintStore();

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  const totalCount = complaints.length;
  const inProgressCount = complaints.filter((c) =>
    ['submitted', 'under_review', 'assigned', 'in_progress'].includes(c.status)
  ).length;
  const resolvedCount = complaints.filter((c) =>
    ['resolved', 'closed'].includes(c.status)
  ).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Banner */}
      <div className="glass-panel p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-indigo-500/20 bg-gradient-to-r from-indigo-950/40 via-slate-900 to-slate-900">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">Student Portal</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Welcome back, {user?.name}! 🎓
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Report facility issues or track existing complaints in real-time.
          </p>
        </div>
        <Link
          to="/student/complaints/new"
          className="py-3 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 shrink-0"
        >
          <PlusCircle className="w-5 h-5" />
          <span>File New Complaint</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{totalCount}</div>
            <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Total Submitted</div>
          </div>
        </div>

        <div className="glass-panel p-6 flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{inProgressCount}</div>
            <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Active / Pending</div>
          </div>
        </div>

        <div className="glass-panel p-6 flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{resolvedCount}</div>
            <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Resolved</div>
          </div>
        </div>
      </div>

      {/* Complaint List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span>Your Complaints History</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400">
              {complaints.length}
            </span>
          </h2>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="glass-panel p-12 text-center">
            <div className="w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto"></div>
            <p className="text-slate-400 text-sm mt-3">Loading your complaints...</p>
          </div>
        ) : complaints.length === 0 ? (
          <div className="glass-panel p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-800/80 text-slate-500 flex items-center justify-center mx-auto">
              <Inbox className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">No complaints reported yet</h3>
              <p className="text-slate-400 text-sm mt-1 max-w-md mx-auto">
                If you encounter any facility issues around campus, click the button below to submit a ticket.
              </p>
            </div>
            <Link
              to="/student/complaints/new"
              className="inline-flex items-center gap-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-sm transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>File First Complaint</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {complaints.map((c) => {
              const statusBadge = STATUS_BADGES[c.status] || STATUS_BADGES.submitted;
              return (
                <Link
                  key={c._id}
                  to={`/student/complaints/${c._id}`}
                  className="glass-panel p-5 hover:border-slate-700 transition-all hover:translate-x-1 group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border uppercase tracking-wider ${statusBadge.color}`}>
                        {statusBadge.label}
                      </span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 uppercase">
                        {c.priority} Priority
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors">
                      {c.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Tag className="w-3.5 h-3.5 text-indigo-400" />
                        <span className="capitalize">{c.category}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                        <span>{c.location}</span>
                      </span>
                      <span>
                        Submitted {new Date(c.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs group-hover:translate-x-1 transition-transform self-end sm:self-center">
                    <span>View Details</span>
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

export default StudentDashboard;
