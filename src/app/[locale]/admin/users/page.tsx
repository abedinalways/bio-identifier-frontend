'use client';

import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  ShieldCheck,
  UserCheck,
  Sprout,
  HeartPulse,
  Loader2,
  AlertCircle,
  Clock,
} from 'lucide-react';
import {
  useGetUsersListQuery,
  useUpdateUserRoleMutation,
} from '@/store/api/adminApi';
import { useAppSelector } from '@/store/hooks';

export default function AdminUsersPage() {
  const { user: currentUser } = useAppSelector(state => state.auth);
  const { data: users = [], isLoading, refetch } = useGetUsersListQuery();
  const [updateRole, { isLoading: isUpdatingRole }] =
    useUpdateUserRoleMutation();

  const [searchQuery, setSearchQuery] = useState('');
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  const handleRoleChange = async (
    userId: string,
    newRole: 'USER' | 'DOCTOR' | 'AGRONOMIST' | 'ADMIN',
  ) => {
    setUpdatingUserId(userId);
    try {
      await updateRole({ id: userId, role: newRole }).unwrap();
      refetch();
    } catch (err: any) {
      alert(err?.data?.message || 'Failed to update user role');
    } finally {
      setUpdatingUserId(null);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const name = u.name.toLowerCase();
        const email = u.email.toLowerCase();
        if (!name.includes(q) && !email.includes(q)) {
          return false;
        }
      }
      return true;
    });
  }, [users, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight flex items-center gap-2.5">
            <Users className="w-7 h-7 text-brand-primary" />
            <span>User Access Control & Roles</span>
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Manage user authorization across Doctor, Agronomist, and
            Administrator access tiers.
          </p>
        </div>
      </div>

      {/* Search Filter */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3.5 top-3 text-text-muted" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search by user name or email..."
          className="w-full pl-10 pr-4 py-2 rounded-xl border border-border-subtle bg-bg-surface text-text-primary text-xs focus:outline-none focus:ring-2 focus:ring-brand-primary"
        />
      </div>

      {/* Users Table */}
      <div className="rounded-3xl bg-bg-surface border border-border-subtle shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 flex flex-col items-center gap-2 text-text-muted text-xs">
            <Loader2 className="w-6 h-6 animate-spin text-brand-primary" />
            <span>Loading user accounts...</span>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center text-text-muted text-xs">
            No registered users found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-bg-subtle text-text-secondary uppercase text-[10px] tracking-wider font-bold">
                <tr>
                  <th className="p-4">User</th>
                  <th className="p-4">Contact Phone</th>
                  <th className="p-4">Current Role Tier</th>
                  <th className="p-4">Promote / Change Role</th>
                  <th className="p-4">Registered Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {filteredUsers.map(u => {
                  const isCurrent = u.id === currentUser?.id;
                  const isUpdating = updatingUserId === u.id;

                  return (
                    <tr key={u.id} className="hover:bg-bg-subtle/50 transition">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center font-bold text-xs">
                            {u.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-extrabold text-sm text-text-primary flex items-center gap-2">
                              <span>{u.name}</span>
                              {isCurrent && (
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-brand-primary/10 text-brand-primary">
                                  You
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-text-muted">
                              {u.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-text-secondary font-mono">
                        {u.phone || 'Not provided'}
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            u.role === 'ADMIN'
                              ? 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30'
                              : u.role === 'DOCTOR'
                                ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30'
                                : u.role === 'AGRONOMIST'
                                  ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                                  : 'bg-bg-subtle text-text-secondary border border-border-subtle'
                          }`}
                        >
                          <ShieldCheck className="w-3 h-3" />
                          <span>{u.role}</span>
                        </span>
                      </td>
                      <td className="p-4">
                        {isCurrent ? (
                          <span className="text-[11px] text-text-muted italic">
                            Cannot change own role
                          </span>
                        ) : (
                          <select
                            disabled={isUpdating}
                            value={u.role}
                            onChange={e =>
                              handleRoleChange(u.id, e.target.value as any)
                            }
                            className="p-1.5 rounded-lg border border-border-subtle bg-bg-canvas text-text-primary text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-primary"
                          >
                            <option value="USER">USER (Standard)</option>
                            <option value="DOCTOR">
                              DOCTOR (Snakes & ASV)
                            </option>
                            <option value="AGRONOMIST">
                              AGRONOMIST (Pests & Crops)
                            </option>
                            <option value="ADMIN">ADMIN (Full Access)</option>
                          </select>
                        )}
                      </td>
                      <td className="p-4 font-mono text-[11px] text-text-muted">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
