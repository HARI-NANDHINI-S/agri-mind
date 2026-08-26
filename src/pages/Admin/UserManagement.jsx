import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft,
  Users,
  UserPlus,
  ShieldCheck,
  CheckCircle2,
  Mail,
  MoreVertical,
  Trash2,
  X,
  Search
} from 'lucide-react';

export default function UserManagement() {
  const navigate = useNavigate();
  const { showToast } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Agronomist');

  const [users, setUsers] = useState([
    { id: 'USR-01', name: 'Aarav Patel', email: 'aarav.patel@agrimind.ai', role: 'Lead Agronomist', fieldAccess: 'All Fields (185 Ac)', status: 'Active', lastActive: 'Now (Online)' },
    { id: 'USR-02', name: 'Rajesh Kumar', email: 'rajesh.k@agrimind.ai', role: 'Field Agronomist', fieldAccess: 'Field 4B & 4A (Wheat)', status: 'Active', lastActive: '2h ago' },
    { id: 'USR-03', name: 'Sunil Verma', email: 'sunil.v@agrimind.ai', role: 'Irrigation & IoT Tech', fieldAccess: 'Field 1C & 2A', status: 'Active', lastActive: '5h ago' },
    { id: 'USR-04', name: 'Dr. Meera Sharma', email: 'meera.s@agroresearch.org', role: 'Pathology Consultant', fieldAccess: 'All Diagnostics', status: 'Active', lastActive: 'Yesterday' },
    { id: 'USR-05', name: 'Kavita Singh', email: 'kavita.s@agrimind.ai', role: 'Finance & Audit Lead', fieldAccess: 'Expense & Ledger', status: 'Active', lastActive: '3d ago' },
  ]);

  const handleInvite = (e) => {
    e.preventDefault();
    if (!inviteEmail) return;

    const newUser = {
      id: `USR-0${users.length + 1}`,
      name: inviteEmail.split('@')[0].replace('.', ' '),
      email: inviteEmail,
      role: inviteRole,
      fieldAccess: 'Assigned Fields',
      status: 'Invited',
      lastActive: 'Pending Acceptance'
    };

    setUsers([...users, newUser]);
    setIsInviteModalOpen(false);
    setInviteEmail('');
    showToast(`Invitation dispatched to ${inviteEmail}!`, 'success');
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full hover:bg-surface-container dark:hover:bg-slate-800 flex items-center justify-center text-on-surface-variant transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <span className="text-[11px] font-bold text-primary uppercase tracking-widest">
              Access Control & Organization
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-on-surface dark:text-white">
              Team & User Role Management
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsInviteModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-hover shadow-sm transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>Invite Team Member</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/40 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-on-surface-variant absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, role, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-surface-container-low dark:bg-slate-800 border border-outline-variant/40 text-xs text-on-surface dark:text-white focus:outline-none focus:border-primary"
          />
        </div>
        <span className="text-xs text-on-surface-variant font-medium hidden sm:inline">
          {filteredUsers.length} Active Members
        </span>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/40 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-container-low/60 dark:bg-slate-800/80 border-b border-outline-variant/40 text-on-surface-variant font-bold uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Member Name</th>
                <th className="py-3 px-4">Role & Designation</th>
                <th className="py-3 px-4">Field Access Scope</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Last Activity</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-surface-container-low/50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white font-bold flex items-center justify-center text-xs">
                        {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-on-surface dark:text-white capitalize">{user.name}</div>
                        <div className="text-[11px] text-on-surface-variant">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-primary dark:text-emerald-400">
                    {user.role}
                  </td>
                  <td className="py-3.5 px-4 text-on-surface-variant">{user.fieldAccess}</td>
                  <td className="py-3.5 px-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      user.status === 'Active'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-on-surface-variant font-mono text-[11px]">{user.lastActive}</td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => showToast(`Updated permissions for ${user.name}`, 'info')}
                      className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors"
                      title="Edit Permissions"
                    >
                      <ShieldCheck className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Member Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface dark:bg-slate-900 border border-outline-variant dark:border-slate-700 w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
              <h3 className="font-bold text-base text-on-surface dark:text-white">Invite Farm Team Member</h3>
              <button onClick={() => setIsInviteModalOpen(false)} className="p-1 text-on-surface-variant hover:text-on-surface">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleInvite} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-on-surface-variant uppercase">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. vikram.singh@agrimind.ai"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-surface-container-low dark:bg-slate-800 border border-outline-variant text-xs text-on-surface dark:text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-on-surface-variant uppercase">Assign Role</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-surface-container-low dark:bg-slate-800 border border-outline-variant text-xs text-on-surface dark:text-white focus:outline-none focus:border-primary"
                >
                  <option value="Agronomist">Field Agronomist</option>
                  <option value="Irrigation Technician">Irrigation / IoT Technician</option>
                  <option value="Finance Auditor">Finance & Accounting Auditor</option>
                  <option value="Farm Manager">Farm Manager (Full Admin)</option>
                </select>
              </div>

              <div className="pt-3 border-t border-outline-variant/30 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-outline-variant text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-hover shadow-sm"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
