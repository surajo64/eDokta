import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import Loading from '../../components/loading';
import ConfirmDialog from '../../components/ConfirmDialog';
import EditUserModal from '../../components/EditUserModal';
import axios from 'axios';
import { toast } from 'react-toastify';

const AllUsers = () => {
    const [users, setUsers] = useState(null);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, user: null });
    const [deactivateDialog, setDeactivateDialog] = useState({ isOpen: false, user: null });
    const [editModal, setEditModal] = useState({ isOpen: false, user: null });
    const { backendUrl, atoken } = useContext(AppContext);

    const fetchAllUsers = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/educator/all-users', {
                headers: { atoken }
            });

            if (data.success) {
                setUsers(data.users);
                setFilteredUsers(data.users);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Fetch users error:', error);
            toast.error(error.response?.data?.message || 'Failed to fetch users');
        }
    };

    useEffect(() => {
        fetchAllUsers();
    }, []);

    useEffect(() => {
        if (!users) return;

        let filtered = [...users];

        // Filter by role
        if (roleFilter !== 'all') {
            filtered = filtered.filter(user => user.userType === roleFilter);
        }

        // Filter by search term
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            filtered = filtered.filter(user =>
                user.name?.toLowerCase().includes(searchLower) ||
                user.email?.toLowerCase().includes(searchLower) ||
                user.phone?.toLowerCase().includes(searchLower)
            );
        }

        setFilteredUsers(filtered);
    }, [searchTerm, roleFilter, users]);

    const handleDeleteUser = async () => {
        try {
            const { user } = deleteDialog;
            const { data } = await axios.delete(
                `${backendUrl}/api/educator/delete-user/${user._id}`,
                {
                    headers: { atoken },
                    data: { userType: user.userType }
                }
            );

            if (data.success) {
                toast.success(data.message);
                fetchAllUsers(); // Refresh the list
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Delete user error:', error);
            toast.error(error.response?.data?.message || 'Failed to delete user');
        } finally {
            setDeleteDialog({ isOpen: false, user: null });
        }
    };

    const handleDeactivateUser = async () => {
        try {
            const { user } = deactivateDialog;
            const newStatus = !user.isActive; // Toggle status

            const { data } = await axios.patch(
                `${backendUrl}/api/educator/toggle-user-status/${user._id}`,
                {
                    userType: user.userType,
                    isActive: newStatus
                },
                { headers: { atoken } }
            );

            if (data.success) {
                toast.success(data.message);
                fetchAllUsers(); // Refresh the list
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Deactivate user error:', error);
            toast.error(error.response?.data?.message || 'Failed to update user status');
        } finally {
            setDeactivateDialog({ isOpen: false, user: null });
        }
    };

    const handleEditUser = async (formData) => {
        try {
            const { user } = editModal;
            const { data } = await axios.put(
                `${backendUrl}/api/educator/update-user/${user._id}`,
                {
                    ...formData,
                    userType: user.userType
                },
                { headers: { atoken } }
            );

            if (data.success) {
                toast.success(data.message);
                setEditModal({ isOpen: false, user: null });
                fetchAllUsers(); // Refresh the list
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Update user error:', error);
            toast.error(error.response?.data?.message || 'Failed to update user');
        }
    };

    const getRoleBadgeColor = (userType) => {
        switch (userType) {
            case 'admin':
                return 'bg-purple-100 text-purple-800';
            case 'educator':
                return 'bg-blue-100 text-blue-800';
            case 'student':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const canEdit = (user) => {
        // Only allow editing for educators and admins, not students
        return user.userType === 'educator' || user.userType === 'admin';
    };

    if (!users) {
        return <Loading />;
    }

    return (
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
            <div className="w-full h-full bg-white shadow-xl rounded-3xl p-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <h1 className="text-2xl font-bold text-gray-800">All Users</h1>

                    <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                        {/* Search Input */}
                        <input
                            type="text"
                            placeholder="Search by name, email, or phone..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 w-full md:w-64"
                        />

                        {/* Role Filter */}
                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            <option value="all">All Roles</option>
                            <option value="student">Students</option>
                            <option value="educator">Educators</option>
                            <option value="admin">Admins</option>
                        </select>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Total Users</p>
                        <p className="text-2xl font-bold text-blue-700">{users.length}</p>
                    </div>
                    <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Students</p>
                        <p className="text-2xl font-bold text-green-700">
                            {users.filter(u => u.userType === 'student').length}
                        </p>
                    </div>
                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Educators</p>
                        <p className="text-2xl font-bold text-purple-700">
                            {users.filter(u => u.userType === 'educator').length}
                        </p>
                    </div>
                    <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Admins</p>
                        <p className="text-2xl font-bold text-amber-700">
                            {users.filter(u => u.userType === 'admin').length}
                        </p>
                    </div>
                </div>

                {/* Users Table */}
                <div className="w-full overflow-x-auto rounded-md bg-white border border-gray-300 shadow-sm">
                    <table className="table-auto w-full text-sm text-gray-500">
                        <thead className="text-gray-900 border-b border-gray-300 text-left bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 font-semibold">#</th>
                                <th className="px-4 py-3 font-semibold">User</th>
                                <th className="px-4 py-3 font-semibold">Email</th>
                                <th className="px-4 py-3 font-semibold">Phone</th>
                                <th className="px-4 py-3 font-semibold">Role</th>
                                <th className="px-4 py-3 font-semibold">Status</th>
                                <th className="px-4 py-3 font-semibold">Joined</th>
                                <th className="px-4 py-3 font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="px-4 py-8 text-center text-gray-500">
                                        No users found matching your criteria
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user, index) => (
                                    <tr key={user._id} className="border-b border-gray-200 hover:bg-gray-50">
                                        <td className="px-4 py-3">{index + 1}</td>

                                        <td className="px-4 py-3">
                                            <div className="flex items-center space-x-3">
                                                <img
                                                    src={user.image || user.imageUrl || '/default-avatar.png'}
                                                    alt={user.name}
                                                    className="w-10 h-10 rounded-full object-cover border"
                                                />
                                                <span className="font-medium text-gray-800">{user.name}</span>
                                            </div>
                                        </td>

                                        <td className="px-4 py-3 text-gray-600">{user.email}</td>

                                        <td className="px-4 py-3 text-gray-600">{user.phone}</td>

                                        <td className="px-4 py-3">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.userType)}`}>
                                                {user.userType.charAt(0).toUpperCase() + user.userType.slice(1)}
                                            </span>
                                        </td>

                                        <td className="px-4 py-3">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.isActive !== false
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                }`}>
                                                {user.isActive !== false ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>

                                        <td className="px-4 py-3 text-gray-600">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>

                                        <td className="px-4 py-3">
                                            <div className="flex gap-2">
                                                {/* Edit button - only for educators and admins */}
                                                {canEdit(user) && (
                                                    <button
                                                        onClick={() => setEditModal({ isOpen: true, user })}
                                                        className="px-3 py-1 rounded-lg bg-blue-50 text-blue-600 font-medium shadow hover:bg-blue-100 focus:ring-2 focus:ring-blue-300 transition text-xs"
                                                    >
                                                        Edit
                                                    </button>
                                                )}

                                                {/* Deactivate/Activate button - for all users */}
                                                <button
                                                    onClick={() => setDeactivateDialog({ isOpen: true, user })}
                                                    className={`px-3 py-1 rounded-lg font-medium shadow focus:ring-2 transition text-xs ${user.isActive !== false
                                                            ? 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100 focus:ring-yellow-300'
                                                            : 'bg-green-50 text-green-600 hover:bg-green-100 focus:ring-green-300'
                                                        }`}
                                                >
                                                    {user.isActive !== false ? 'Deactivate' : 'Activate'}
                                                </button>

                                                {/* Delete button */}
                                                <button
                                                    onClick={() => setDeleteDialog({ isOpen: true, user })}
                                                    className="px-3 py-1 rounded-lg bg-red-50 text-red-600 font-medium shadow hover:bg-red-100 focus:ring-2 focus:ring-red-300 transition text-xs"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Results Count */}
                <div className="mt-4 text-sm text-gray-600">
                    Showing {filteredUsers.length} of {users.length} users
                </div>
            </div>

            {/* Edit User Modal */}
            <EditUserModal
                isOpen={editModal.isOpen}
                onClose={() => setEditModal({ isOpen: false, user: null })}
                user={editModal.user}
                onSave={handleEditUser}
            />

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                isOpen={deleteDialog.isOpen}
                onClose={() => setDeleteDialog({ isOpen: false, user: null })}
                onConfirm={handleDeleteUser}
                title="Delete User"
                message={`Are you sure you want to delete ${deleteDialog.user?.name}? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                type="danger"
            />

            {/* Deactivate/Activate Confirmation Dialog */}
            <ConfirmDialog
                isOpen={deactivateDialog.isOpen}
                onClose={() => setDeactivateDialog({ isOpen: false, user: null })}
                onConfirm={handleDeactivateUser}
                title={deactivateDialog.user?.isActive !== false ? "Deactivate User" : "Activate User"}
                message={`Are you sure you want to ${deactivateDialog.user?.isActive !== false ? 'deactivate' : 'activate'} ${deactivateDialog.user?.name}?`}
                confirmText={deactivateDialog.user?.isActive !== false ? "Deactivate" : "Activate"}
                cancelText="Cancel"
                type={deactivateDialog.user?.isActive !== false ? "warning" : "info"}
            />
        </div>
    );
};

export default AllUsers;
