import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useComplaintStore } from '../store/complaintStore';
import api from '../services/api';
import {
  ShieldAlert,
  BarChart3,
  Users,
  AlertCircle,
  Clock,
  CheckCircle2,
  Inbox,
  ArrowRight,
  TrendingUp,
  PieChart,
} from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuthStore();
  const { complaints, fetchComplaints, loading } = useComplaintStore();
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    fetchComplaints();
    const fetchStats = async () => {
      try {
        setStatsLoading(true);
        const res = await api.get('/admin/stats');
        setStats(res.data);
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      } finally {
        setStatsLoading(false);
      }
    };
    fetchStats();
  }, [fetchComplaints]);


  // Calculate statistics
  const total = complaints.length;
  const criticalCount = complaints.filter((c) => c.priority === 'critical' && c.status !== 'closed' && c.status !== 'resolved').length;
  const pendingReview = complaints.filter((c) => c.status === 'submitted' || c.status === 'under_review').length;
  const inProgress = complaints.filter((c) => c.status === 'assigned' || c.status === 'in_progress').length;
  const resolved = complaints.filter((c) => c.status === 'resolved' || c.status === 'closed').length;

  // Filter top critical/unresolved complaints to highlight
  const criticalComplaints = complaints
    .filter((c) => c.status !== 'resolved' && c.status !== 'closed')
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="glass-panel p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-purple-500/20 bg-gradient-to-r from-purple-950/40 via-slate-900 to-slate-900 animate-fade-in">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-purple-400">Administrator Console</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Admin Workspace — {user?.name} 🛠️
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Triage facility complaints, assign departments, and track campus resolution operations.
          </p>
        </div>
        <Link
          to="/admin/complaints"
          className="py-3 px-5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold flex items-center gap-2 shadow-lg shadow-purple-600/30 transition-all hover:scale-105 shrink-0"
        >
          <ShieldAlert className="w-5 h-5" />
          <span>Manage Complaints</span>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-panel p-6 flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{total}</div>
            <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Total Received</div>
          </div>
        </div>

        <div className="glass-panel p-6 flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <AlertCircle className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{criticalCount}</div>
            <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Active Critical</div>
          </div>
        </div>

        <div className="glass-panel p-6 flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{pendingReview + inProgress}</div>
            <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">In Progress / Review</div>
          </div>
        </div>

        <div className="glass-panel p-6 flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{resolved}</div>
            <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Resolved Tickets</div>
          </div>
        </div>
      </div>

      {/* Main Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Urgent Attention Action Board */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-400" />
              <span>Complaints Requiring Attention</span>
            </h2>
            <Link
              to="/admin/complaints"
              className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="glass-panel p-12 text-center">
              <div className="w-8 h-8 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto"></div>
              <p className="text-slate-400 text-sm mt-3">Loading active issues...</p>
            </div>
          ) : criticalComplaints.length === 0 ? (
            <div className="glass-panel p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-slate-800 text-slate-500 flex items-center justify-center mx-auto">
                <Inbox className="w-6 h-6" />
              </div>
              <h3 className="text-slate-300 font-semibold">All clear! No pending issues.</h3>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {criticalComplaints.map((c) => (
                <Link
                  key={c._id}
                  to={`/admin/complaints/${c._id}`}
                  className="glass-panel p-5 hover:border-slate-700 transition-all hover:translate-x-1 group flex items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${
                        c.priority === 'critical'
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      }`}>
                        {c.priority}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-indigo-400">
                        {c.status.replace('_', ' ')}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-white group-hover:text-purple-400 transition-colors">
                      {c.title}
                    </h3>
                    <p className="text-xs text-slate-400">
                      Submitted by {c.studentId?.name || 'Student'} • {c.location}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-purple-400 transition-colors shrink-0" />
                </Link>
              ))}
            </div>
          )}
        </div>
        {/* Stats Panel */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <PieChart className="w-5 h-5 text-purple-400" />
            <span>Category & Status Analytics</span>
          </h2>

          <div className="glass-panel p-6 space-y-6">
            {statsLoading ? (
              <div className="flex flex-col items-center justify-center py-12 gap-2">
                <div className="w-6 h-6 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
                <span className="text-xs text-slate-500">Loading details...</span>
              </div>
            ) : stats ? (
              <>
                {/* Categories */}
                <div className="space-y-3.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Tickets by Category</h3>
                  <div className="space-y-2.5">
                    {Object.entries(stats.byCategory || {})
                      .sort((a, b) => b[1] - a[1]) // Sort highest count first
                      .slice(0, 5) // Show top 5
                      .map(([cat, val]) => {
                        const pct = stats.total > 0 ? Math.round((val / stats.total) * 100) : 0;
                        return (
                          <div key={cat} className="space-y-1">
                            <div className="flex justify-between text-xs font-semibold">
                              <span className="capitalize text-slate-200">{cat}</span>
                              <span className="text-slate-400">
                                {val} ({pct}%)
                              </span>
                            </div>
                            <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                              <div
                                className="bg-purple-500 h-1.5 rounded-full transition-all duration-500"
                                style={{ width: `${pct}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>

                {/* Statuses */}
                <div className="space-y-3.5 pt-4 border-t border-slate-800/80">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Status Distribution</h3>
                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-850">
                      <div className="text-sm font-bold text-white">
                        {(stats.byStatus?.submitted || 0) + (stats.byStatus?.under_review || 0)}
                      </div>
                      <div className="text-[10px] text-slate-450 uppercase font-semibold mt-0.5">New / Under Review</div>
                    </div>
                    <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-850">
                      <div className="text-sm font-bold text-cyan-400">
                        {(stats.byStatus?.assigned || 0) + (stats.byStatus?.in_progress || 0)}
                      </div>
                      <div className="text-[10px] text-slate-450 uppercase font-semibold mt-0.5">In Progress</div>
                    </div>
                    <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-850">
                      <div className="text-sm font-bold text-emerald-400">
                        {stats.byStatus?.resolved || 0}
                      </div>
                      <div className="text-[10px] text-slate-450 uppercase font-semibold mt-0.5">Resolved</div>
                    </div>
                    <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-850">
                      <div className="text-sm font-bold text-slate-400">
                        {stats.byStatus?.closed || 0}
                      </div>
                      <div className="text-[10px] text-slate-450 uppercase font-semibold mt-0.5">Closed</div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-xs text-slate-500 italic text-center py-6">
                No statistics data available.
              </div>
            )}
          </div>
        </div>      </div>
    </div>
  );
};

export default AdminDashboard;
