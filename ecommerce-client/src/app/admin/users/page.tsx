"use client";
import { useEffect, useState } from "react";
import {
  Users,
  Search,
  X,
  ChevronDown,
  Shield,
  User,
  Trash2,
} from "lucide-react";
import { apiClient } from "@/services/api-client";
import { Skeleton } from "@/components/ui/skeleton";
import Swal from "sweetalert2";

interface UserItem {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    try {
      const { data } = await apiClient.get("/admin/users?limit=50");
      setUsers(data.users || []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  async function handleRoleChange(userId: string, newRole: string) {
    setUpdatingId(userId);
    try {
      await apiClient.put(`/admin/users/${userId}/role`, { role: newRole });
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
      );
    } catch {
      // ignore
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleDeleteUser(userId: string, userName: string) {
    const result = await Swal.fire({
      title: "Delete User?",
      html: `This will permanently remove <strong>${userName}</strong> from the database and Firebase. They will need to create a new account to rejoin.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete permanently",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    setUpdatingId(userId);
    try {
      await apiClient.delete(`/admin/users/${userId}`);
      setUsers((prev) => prev.filter((u) => u._id !== userId));
      Swal.fire("Deleted", "User has been permanently removed.", "success");
    } catch {
      Swal.fire("Error", "Failed to delete user. Please try again.", "error");
    } finally {
      setUpdatingId(null);
    }
  }

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-4 sm:p-6">
        <Skeleton className="h-7 w-48" />
        <div className="mt-6 space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-4 rounded-lg border border-[#f0f0f0] bg-white p-4">
              <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
              <Skeleton className="h-8 w-24" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-semibold text-[#262626]">Users</h1>
          <p className="mt-1 text-[13px] text-[#8c8c8c]">Manage user accounts and roles</p>
        </div>
      </div>

      {/* Search */}
      <div className="mt-5 flex gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8c8c8c]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users by name or email..."
            className="h-10 w-full rounded-lg border border-[#f0f0f0] bg-white pl-10 pr-4 text-[13px] text-[#262626] placeholder:text-[#8c8c8c] focus:border-[#1677ff] focus:outline-none"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8c8c8c] hover:text-[#262626]">
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Users Table */}
      <div className="mt-4 overflow-x-auto rounded-lg border border-[#f0f0f0] bg-white">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b border-[#f0f0f0] bg-[#fafafb]">
              <th className="px-4 py-3 text-left text-[12px] font-medium text-[#8c8c8c]">User</th>
              <th className="px-4 py-3 text-left text-[12px] font-medium text-[#8c8c8c]">Email</th>
              <th className="px-4 py-3 text-left text-[12px] font-medium text-[#8c8c8c]">Role</th>
              <th className="px-4 py-3 text-left text-[12px] font-medium text-[#8c8c8c]">Joined</th>
              <th className="px-4 py-3 text-left text-[12px] font-medium text-[#8c8c8c]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id} className="border-b border-[#f0f0f0] last:border-0 hover:bg-[#fafafb]">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f5f5f5] text-[#8c8c8c]">
                      {user.role === "admin" ? <Shield size={16} /> : <User size={16} />}
                    </div>
                    <p className="text-[13px] font-medium text-[#262626]">{user.name}</p>
                  </div>
                </td>
                <td className="px-4 py-3 text-[13px] text-[#8c8c8c]">{user.email}</td>
                <td className="px-4 py-3">
                  <div className="relative">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                      disabled={updatingId === user._id}
                      className={`appearance-none rounded px-2 py-1 pr-6 text-[11px] font-medium capitalize ${
                        user.role === "admin" ? "bg-[#f9f0ff] text-[#531dab]" : "bg-[#f5f5f5] text-[#8c8c8c]"
                      }`}
                    >
                      <option value="customer">Customer</option>
                      <option value="admin">Admin</option>
                    </select>
                    <ChevronDown size={12} className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2" />
                  </div>
                </td>
                <td className="px-4 py-3 text-[12px] text-[#8c8c8c]">
                  {new Date(user.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </td>
                <td className="px-4 py-3">
                  {user.role !== "admin" && (
                    <button
                      onClick={() => handleDeleteUser(user._id, user.name)}
                      disabled={updatingId === user._id}
                      className="flex h-8 items-center gap-1.5 rounded-lg bg-[#fff1f0] px-3 text-[12px] font-medium text-[#dc3545] transition hover:bg-[#ffe0de] disabled:opacity-50"
                    >
                      <Trash2 size={13} />
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-[13px] text-[#8c8c8c]">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
