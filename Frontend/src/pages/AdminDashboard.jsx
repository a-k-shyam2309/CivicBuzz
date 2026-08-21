import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Users,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RefreshCw,
  PlusCircle,
  Building2,
  Sliders,
  Layers,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { adminService } from '../services/adminService';
import { tenderService } from '../services/tenderService';
import { useNotifications } from '../context/NotificationContext';
import { StatusBadge } from '../components/StatusBadge';
import { PriorityBadge } from '../components/PriorityBadge';

export const AdminDashboard = () => {
  const { showToast } = useNotifications();

  const [activeTab, setActiveTab] = useState('QUEUE'); // 'QUEUE', 'ESCALATIONS', 'TENDERS', 'AUDIT'
  const [metrics, setMetrics] = useState(null);
  const [queue, setQueue] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Department Reassignment state
  const [reassignModalOpen, setReassignModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [targetDept, setTargetDept] = useState('ROADS_AND_POTHOLES');
  const [reassignNotes, setReassignNotes] = useState('');
  const [isReassigning, setIsReassigning] = useState(false);

  // New Tender state
  const [tenderModalOpen, setTenderModalOpen] = useState(false);
  const [tenderData, setTenderData] = useState({
    title: '',
    description: '',
    ward_id: 12,
    category: 'ROADS',
    location: 'Janpath Corridor, Bhubaneswar',
    estimated_budget: '₹14,50,000',
    duration_days: 45,
    verified_locations_count: 8,
  });
  const [isCreatingTender, setIsCreatingTender] = useState(false);

  const loadAdminData = async () => {
    setIsLoading(true);
    try {
      const [dashMetrics, routingQueue, logs] = await Promise.all([
        adminService.getDashboardMetrics(),
        adminService.getRoutingQueue(),
        adminService.getAuditLogs(30),
      ]);
      setMetrics(dashMetrics);
      setQueue(routingQueue || []);
      setAuditLogs(logs || []);
    } catch (err) {
      console.warn('Admin load error', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleReassignSubmit = async (e) => {
    e.preventDefault();
    if (!selectedComplaint) return;
    setIsReassigning(true);
    try {
      await adminService.reassignDepartment(
        selectedComplaint.complaint_id,
        targetDept,
        reassignNotes
      );
      showToast(`Complaint #${selectedComplaint.complaint_id} reassigned to ${targetDept}.`, 'success');
      setReassignModalOpen(false);
      await loadAdminData();
    } catch (err) {
      showToast(err.message || 'Failed to reassign department.', 'error');
    } finally {
      setIsReassigning(false);
    }
  };

  const handleCreateTenderSubmit = async (e) => {
    e.preventDefault();
    setIsCreatingTender(true);
    try {
      await tenderService.createTender(tenderData);
      showToast('New Municipal Tender published with public QR code.', 'success');
      setTenderModalOpen(false);
    } catch (err) {
      showToast(err.message || 'Failed to create tender.', 'error');
    } finally {
      setIsCreatingTender(false);
    }
  };

  const DEPARTMENTS = [
    { code: 'ROADS_AND_POTHOLES', name: 'Roads & Potholes Department' },
    { code: 'DRAINAGE_AND_SEWERAGE', name: 'Drainage & Stormwater Department' },
    { code: 'STREETLIGHTING', name: 'Streetlighting & Electrical' },
    { code: 'SANITATION_AND_WASTE', name: 'Sanitation & Solid Waste' },
    { code: 'WATER_SUPPLY', name: 'Water Supply & Public Health' },
    { code: 'PARKS_AND_HORTICULTURE', name: 'Parks & Public Greenery' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-xs font-bold">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Municipal Governance & Control Suite</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Administrator Command Portal
          </h1>
          <p className="text-xs text-slate-300">
            Monitor citywide grievance KPIs, review AI routing confidence, manage department overrides,
            handle resolution escalations, and publish tenders.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setTenderModalOpen(true)}
          className="px-5 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-2xl shadow-lg transition-all flex items-center gap-2 flex-shrink-0"
        >
          <PlusCircle className="w-4 h-4" /> Publish Municipal Tender
        </button>
      </div>

      {/* KPI Metric Cards */}
      {metrics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">
              {metrics.total_reported?.toLocaleString()}
            </span>
            <span className="block text-xs font-semibold text-slate-500 mt-1">Total Reported</span>
            <span className="text-[10px] text-emerald-600 font-bold mt-0.5 block">
              +{metrics.reported_change_percent}% vs last cycle
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center">
            <span className="text-2xl sm:text-3xl font-black text-emerald-600">
              {metrics.total_resolved?.toLocaleString()}
            </span>
            <span className="block text-xs font-semibold text-slate-500 mt-1">Citizen Verified</span>
            <span className="text-[10px] text-emerald-600 font-bold mt-0.5 block">
              {metrics.resolution_rate_percent}% Resolution Rate
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center">
            <span className="text-2xl sm:text-3xl font-black text-amber-600">
              {metrics.total_open?.toLocaleString()}
            </span>
            <span className="block text-xs font-semibold text-slate-500 mt-1">Under Remediation</span>
            <span className="text-[10px] text-slate-400 font-bold mt-0.5 block">Across all depts</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center">
            <span className="text-2xl sm:text-3xl font-black text-rose-600">
              {metrics.total_overdue?.toLocaleString()}
            </span>
            <span className="block text-xs font-semibold text-slate-500 mt-1">High Severity SLA</span>
            <span className="text-[10px] text-rose-600 font-bold mt-0.5 block">Requires Attention</span>
          </div>
        </div>
      )}

      {/* Tab Selector */}
      <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl max-w-md">
        <button
          onClick={() => setActiveTab('QUEUE')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'QUEUE' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
          }`}
        >
          AI Routing Queue ({queue.length})
        </button>
        <button
          onClick={() => setActiveTab('AUDIT')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'AUDIT' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
          }`}
        >
          Audit Logs ({auditLogs.length})
        </button>
      </div>

      {/* Tab 1: AI Routing Queue */}
      {activeTab === 'QUEUE' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900">AI Grievance Routing & Priority Stream</h3>
              <p className="text-xs text-slate-400">Review automated classifications and execute department overrides</p>
            </div>
            <button
              onClick={loadAdminData}
              className="p-2 text-slate-500 hover:text-slate-800 rounded-xl hover:bg-slate-50 transition-all"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                <tr>
                  <th className="p-4">Complaint</th>
                  <th className="p-4">Ward</th>
                  <th className="p-4">Category / Severity</th>
                  <th className="p-4">Assigned Department</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {queue.map((c) => (
                  <tr key={c.complaint_id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4">
                      <span className="font-mono font-bold text-slate-900 block">#{c.complaint_id}</span>
                      <span className="text-slate-500 text-[11px] line-clamp-1">{c.title}</span>
                    </td>
                    <td className="p-4 font-semibold text-slate-800">
                      {c.location?.ward_name || 'Ward 12'}
                    </td>
                    <td className="p-4 space-y-1">
                      <span className="font-bold text-slate-800 block">{c.category}</span>
                      <PriorityBadge level={c.priority?.level || c.severity} score={c.priority?.score} />
                    </td>
                    <td className="p-4 font-semibold text-blue-700">
                      {c.department_name}
                    </td>
                    <td className="p-4">
                      <StatusBadge status={c.status} size="sm" />
                    </td>
                    <td className="p-4 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedComplaint(c);
                          setReassignModalOpen(true);
                        }}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-all"
                      >
                        Reassign
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Immutable Audit Logs */}
      {activeTab === 'AUDIT' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-5 border-b border-slate-100">
            <h3 className="font-bold text-sm text-slate-900">Immutable Audit Trail</h3>
            <p className="text-xs text-slate-400">Cryptographically verifiable log of all administrative and citizen events</p>
          </div>

          <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
            {auditLogs.map((log, idx) => (
              <div key={idx} className="p-4 hover:bg-slate-50 flex items-center justify-between text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold px-2 py-0.5 bg-slate-100 text-slate-800 rounded">
                      {log.action}
                    </span>
                    <span className="text-slate-500 font-semibold">Entity: {log.entity_type} #{log.entity_id}</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Actor: <strong className="text-slate-700">{log.actor_role}</strong> (ID: {log.actor_id})
                  </p>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  {log.timestamp ? new Date(log.timestamp).toLocaleString() : ''}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reassign Department Modal */}
      {reassignModalOpen && selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">
                Override Assignment: #{selectedComplaint.complaint_id}
              </h3>
              <button onClick={() => setReassignModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleReassignSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Department</label>
                <select
                  value={targetDept}
                  onChange={(e) => setTargetDept(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {DEPARTMENTS.map((d) => (
                    <option key={d.code} value={d.code}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Administrative Justification</label>
                <textarea
                  rows={3}
                  value={reassignNotes}
                  onChange={(e) => setReassignNotes(e.target.value)}
                  placeholder="Reason for routing override (e.g. Issue involves underground stormwater drainage rather than surface asphalt)..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setReassignModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isReassigning}
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow transition-all flex items-center gap-2"
                >
                  {isReassigning && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  Confirm Reassignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Publish Tender Modal */}
      {tenderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Publish Official Municipal Tender</h3>
              <button onClick={() => setTenderModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTenderSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tender Title</label>
                <input
                  type="text"
                  required
                  value={tenderData.title}
                  onChange={(e) => setTenderData({ ...tenderData, title: e.target.value })}
                  placeholder="e.g. Ward 12 Main Pothole Repair & Asphalt Resurfacing Project"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Scope of Work</label>
                <textarea
                  rows={3}
                  required
                  value={tenderData.description}
                  onChange={(e) => setTenderData({ ...tenderData, description: e.target.value })}
                  placeholder="Remediation of 8 verified road defects on Janpath road. Heavy-duty bitumen surfacing required..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Estimated Budget</label>
                  <input
                    type="text"
                    value={tenderData.estimated_budget}
                    onChange={(e) => setTenderData({ ...tenderData, estimated_budget: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Ward ID</label>
                  <input
                    type="number"
                    value={tenderData.ward_id}
                    onChange={(e) => setTenderData({ ...tenderData, ward_id: parseInt(e.target.value) || 12 })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setTenderModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatingTender}
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow transition-all flex items-center gap-2"
                >
                  {isCreatingTender && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  Publish Municipal Tender
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
