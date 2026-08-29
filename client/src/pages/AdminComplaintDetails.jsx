import React, { useEffect, useState } from 'react';
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
  Save,
  Trash2,
  Calendar,
  Mail,
} from 'lucide-react';

const STATUS_OPTIONS = [
  { id: 'submitted', label: 'Submitted' },
  { id: 'under_review', label: 'Under Review' },
  { id: 'assigned', label: 'Assigned' },
  { id: 'in_progress', label: 'In Progress' },
  { id: 'resolved', label: 'Resolved' },
  { id: 'closed', label: 'Closed' },
];

const PRIORITY_OPTIONS = [
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

const AdminComplaintDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    currentComplaint,
    fetchComplaintById,
    updateComplaint,
    deleteComplaint,
    loading,
    error,
  } = useComplaintStore();

  // Local Form state
  const [status, setStatus] = useState('submitted');
  const [priority, setPriority] = useState('low');
  const [assignedDepartment, setAssignedDepartment] = useState('');
  const [assignedStaff, setAssignedStaff] = useState('');
  const [comment, setComment] = useState('');
  const [resolutionDetails, setResolutionDetails] = useState('');

  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    fetchComplaintById(id);
  }, [id, fetchComplaintById]);

  // Sync state once data loads
  useEffect(() => {
    if (currentComplaint) {
      setStatus(currentComplaint.status || 'submitted');
      setPriority(currentComplaint.priority || 'low');
      setAssignedDepartment(currentComplaint.assignedDepartment || '');
      setAssignedStaff(currentComplaint.assignedStaff || '');
      setResolutionDetails(currentComplaint.resolutionDetails || '');
      setComment('');
    }
  }, [currentComplaint]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdateSuccess(false);

    const payload = {
      status,
      priority,
      assignedDepartment,
      assignedStaff,
      comment,
      resolutionDetails,
    };

    const res = await updateComplaint(id, payload);
    if (res.success) {
      setUpdateSuccess(true);
      setComment(''); // Clear comment field
      setTimeout(() => setUpdateSuccess(false), 3000);
    }
  };

  const handleDelete = async () => {
    const res = await deleteComplaint(id);
    if (res.success) {
      navigate('/admin/complaints');
    }
  };

  if (loading && !currentComplaint) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !currentComplaint) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <div className="glass-panel p-8 space-y-4">
          <AlertCircle className="w-12 h-12 text-rose-400 mx-auto" />
          <h2 className="text-xl font-bold text-white">Complaint Details Unreachable</h2>
          <p className="text-slate-400 text-sm">{error || 'This ticket may have been deleted.'}</p>
          <button
            onClick={() => navigate('/admin/complaints')}
            className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-sm transition-colors"
          >
            Go to Management Panel
          </button>
        </div>
      </div>
    );
  }

  const activeBadge = STATUS_BADGES[currentComplaint.status] || STATUS_BADGES.submitted;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Back Link */}
      <button
        onClick={() => navigate('/admin/complaints')}
        className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Complaints List</span>
      </button>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Details view */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6 sm:p-8 space-y-6">
            {/* Header info */}
            <div className="border-b border-slate-800 pb-6">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border uppercase tracking-wider ${activeBadge.color}`}>
                  {activeBadge.label}
                </span>
                <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-slate-800 text-slate-400 uppercase">
                  {currentComplaint.priority} Priority
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                {currentComplaint.title}
              </h1>
            </div>

            {/* Student Metadata Card */}
            <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Reporter Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-slate-200">
                  <User className="w-4 h-4 text-purple-400" />
                  <span className="font-semibold">{currentComplaint.studentId?.name || 'Unknown Student'}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Mail className="w-4 h-4 text-slate-500" />
                  <span>{currentComplaint.studentId?.email || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Calendar className="w-4 h-4 text-slate-500" />
                  <span>Submitted {new Date(currentComplaint.createdAt).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Category / Location Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950/20 p-4 rounded-xl border border-slate-850">
              <div className="flex items-center gap-3">
                <Tag className="w-5 h-5 text-purple-400" />
                <div>
                  <div className="text-xs text-slate-500 font-semibold uppercase">Category</div>
                  <div className="text-sm font-semibold text-slate-200 capitalize">{currentComplaint.category}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-purple-400" />
                <div>
                  <div className="text-xs text-slate-500 font-semibold uppercase">Location</div>
                  <div className="text-sm font-semibold text-slate-200">{currentComplaint.location}</div>
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

            {/* Attachment preview */}
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
                      className="group relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 w-full h-56 block"
                    >
                      <img
                        src={url}
                        alt="Attachment"
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform"
                      />
                      <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs font-bold text-white">
                        Click to view full size
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* ResolutionDetails rendering */}
            {currentComplaint.resolutionDetails && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Resolution Details Note</span>
                </div>
                <p className="text-slate-200 text-sm">{currentComplaint.resolutionDetails}</p>
              </div>
            )}

            {/* Comments logs */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-purple-400" />
                <span>Comments & Action Logs ({currentComplaint.adminComments?.length || 0})</span>
              </h3>

              {currentComplaint.adminComments && currentComplaint.adminComments.length > 0 ? (
                <div className="space-y-3">
                  {currentComplaint.adminComments.map((c, idx) => (
                    <div key={idx} className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-purple-400">
                          {c.authorId?.name || 'Administrator'}
                        </span>
                        <span className="text-slate-500">
                          {new Date(c.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-slate-300 text-sm mt-1">{c.text}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">No admin comments added to this ticket yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Col: Admin management panel form */}
        <div className="space-y-6">
          <div className="glass-panel p-6 sm:p-8 space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <span>Update Ticket Status</span>
            </h2>

            {updateSuccess && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-xl text-center">
                Ticket changes updated successfully!
              </div>
            )}

            <form onSubmit={handleUpdate} className="space-y-4">
              {/* Status */}
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Update Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full glass-input py-2 text-sm bg-slate-950"
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Override Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full glass-input py-2 text-sm bg-slate-950"
                >
                  {PRIORITY_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Department */}
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Assign Department
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={assignedDepartment}
                    onChange={(e) => setAssignedDepartment(e.target.value)}
                    placeholder="e.g. Electrical Maintenances"
                    className="w-full glass-input pl-10 py-2 text-sm"
                  />
                </div>
              </div>

              {/* Staff Member */}
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Assign Staff Handler
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={assignedStaff}
                    onChange={(e) => setAssignedStaff(e.target.value)}
                    placeholder="e.g. Officer John Doe"
                    className="w-full glass-input pl-10 py-2 text-sm"
                  />
                </div>
              </div>

              {/* Resolution details */}
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Resolution Details Note
                </label>
                <textarea
                  rows={2}
                  value={resolutionDetails}
                  onChange={(e) => setResolutionDetails(e.target.value)}
                  placeholder="Record how the problem was resolved..."
                  className="w-full glass-input py-2 text-sm resize-none"
                />
              </div>

              {/* Add admin comment */}
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Add Comment / Activity Log
                </label>
                <textarea
                  rows={2}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add update notes visible to student..."
                  className="w-full glass-input py-2 text-sm resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>Save Ticket Updates</span>
              </button>
            </form>
          </div>

          {/* Delete Ticket Section */}
          <div className="glass-panel p-6 border-rose-500/20 bg-rose-950/10">
            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full py-2.5 px-4 rounded-xl border border-rose-500/30 hover:bg-rose-500/10 text-rose-400 font-semibold text-xs flex items-center justify-center gap-2 transition-all"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete This Ticket</span>
              </button>
            ) : (
              <div className="space-y-3 text-center">
                <p className="text-xs text-rose-300 font-semibold">
                  Are you absolutely sure you want to delete this ticket permanently?
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleDelete}
                    className="py-2 px-3 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all"
                  >
                    Confirm Delete
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminComplaintDetails;
