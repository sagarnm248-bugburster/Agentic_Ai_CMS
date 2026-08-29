import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useComplaintStore } from '../store/complaintStore';
import {
  ArrowLeft,
  MapPin,
  Tag,
  Clock,
  CheckCircle2,
  AlertCircle,
  Building2,
  User,
  MessageSquare,
  Sparkles,
} from 'lucide-react';

const STATUS_CONFIG = {
  submitted: { label: 'Submitted', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
  under_review: { label: 'Under Review', color: 'bg-purple-500/10 text-purple-400 border-purple-500/30' },
  assigned: { label: 'Assigned', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
  in_progress: { label: 'In Progress', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' },
  resolved: { label: 'Resolved', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
  closed: { label: 'Closed', color: 'bg-slate-500/10 text-slate-400 border-slate-500/30' },
};

const PRIORITY_CONFIG = {
  low: { label: 'Low', color: 'bg-slate-800 text-slate-300' },
  medium: { label: 'Medium', color: 'bg-blue-500/20 text-blue-300 border border-blue-500/30' },
  high: { label: 'High', color: 'bg-amber-500/20 text-amber-300 border border-amber-500/30' },
  critical: { label: 'Critical', color: 'bg-rose-500/20 text-rose-300 border border-rose-500/30' },
};

const ComplaintDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentComplaint, fetchComplaintById, loading, error } = useComplaintStore();

  useEffect(() => {
    fetchComplaintById(id);
  }, [id, fetchComplaintById]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !currentComplaint) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <div className="glass-panel p-8 space-y-4">
          <AlertCircle className="w-12 h-12 text-rose-400 mx-auto" />
          <h2 className="text-xl font-bold text-white">Complaint Not Found</h2>
          <p className="text-slate-400 text-sm">{error || "You don't have access to this complaint or it doesn't exist."}</p>
          <button
            onClick={() => navigate('/student/dashboard')}
            className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-sm transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const statusInfo = STATUS_CONFIG[currentComplaint.status] || STATUS_CONFIG.submitted;
  const priorityInfo = PRIORITY_CONFIG[currentComplaint.priority] || PRIORITY_CONFIG.low;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top back navigation */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Dashboard</span>
      </button>

      {/* Main Details Card */}
      <div className="glass-panel p-6 sm:p-8 space-y-6 relative overflow-hidden">
        {/* Status Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${statusInfo.color}`}>
                {statusInfo.label}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${priorityInfo.color}`}>
                {priorityInfo.label} Priority
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-3">
              {currentComplaint.title}
            </h1>
          </div>

          <div className="text-right text-xs text-slate-400">
            <div>Submitted on</div>
            <div className="font-semibold text-slate-200 mt-0.5">
              {new Date(currentComplaint.createdAt).toLocaleDateString(undefined, {
                dateStyle: 'medium',
                timeStyle: 'short',
              })}
            </div>
          </div>
        </div>

        {/* Metadata grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950/40 p-4 rounded-xl border border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-500 uppercase font-semibold">Category</div>
              <div className="text-sm font-medium text-slate-200 capitalize">{currentComplaint.category}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-500 uppercase font-semibold">Location</div>
              <div className="text-sm font-medium text-slate-200">{currentComplaint.location}</div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Description</h3>
          <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-line bg-slate-950/30 p-4 rounded-xl border border-slate-800/50">
            {currentComplaint.description}
          </p>
        </div>

        {/* Attachments */}
        {currentComplaint.attachments && currentComplaint.attachments.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Attachment</h3>
            <div className="flex flex-wrap gap-4">
              {currentComplaint.attachments.map((url, idx) => (
                <a
                  key={idx}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 w-full sm:w-80 h-48 block"
                >
                  <img
                    src={url}
                    alt={`Attachment ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs font-semibold text-white">
                    Click to view full image
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Assignment & Resolution Section */}
        {(currentComplaint.assignedDepartment || currentComplaint.assignedStaff || currentComplaint.resolutionDetails) && (
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>Department & Resolution Status</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {currentComplaint.assignedDepartment && (
                <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 flex items-center gap-3">
                  <Building2 className="w-5 h-5 text-indigo-400" />
                  <div>
                    <div className="text-xs text-slate-500">Assigned Department</div>
                    <div className="text-sm font-semibold text-slate-200">{currentComplaint.assignedDepartment}</div>
                  </div>
                </div>
              )}

              {currentComplaint.assignedStaff && (
                <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 flex items-center gap-3">
                  <User className="w-5 h-5 text-purple-400" />
                  <div>
                    <div className="text-xs text-slate-500">Assigned Staff</div>
                    <div className="text-sm font-semibold text-slate-200">{currentComplaint.assignedStaff}</div>
                  </div>
                </div>
              )}
            </div>

            {currentComplaint.resolutionDetails && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Resolution Note</span>
                </div>
                <p className="text-slate-200 text-sm">{currentComplaint.resolutionDetails}</p>
              </div>
            )}
          </div>
        )}

        {/* Admin Comments */}
        {currentComplaint.adminComments && currentComplaint.adminComments.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-indigo-400" />
              <span>Admin Updates & Comments</span>
            </h3>

            <div className="space-y-3">
              {currentComplaint.adminComments.map((comment, idx) => (
                <div key={idx} className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-indigo-400">
                      {comment.authorId?.name || 'Administrator'}
                    </span>
                    <span className="text-slate-500">
                      {new Date(comment.createdAt).toLocaleDateString(undefined, {
                        dateStyle: 'short',
                        timeStyle: 'short',
                      })}
                    </span>
                  </div>
                  <p className="text-slate-300 text-sm mt-1">{comment.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplaintDetails;
