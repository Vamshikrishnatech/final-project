import React, { useEffect, useState } from 'react';
import { UserForm } from './components/UserForm';
import { UserList } from './components/UserList';
import { addUser, getAllUsers, updateUser, deleteUser, searchUsers } from './lib/db';
import type { User } from './types/user';
import { Plus } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | undefined>();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const loadedUsers = await getAllUsers();
      setUsers(loadedUsers);
    } catch (error) {
      toast.error('Failed to load users');
    }
  };

  const handleSubmit = async (data: Omit<User, 'id'>) => {
    try {
      if (editingUser) {
        await updateUser({ ...data, id: editingUser.id });
        toast.success('User updated successfully');
      } else {
        await addUser(data);
        toast.success('User added successfully');
      }
      await loadUsers();
      setIsFormOpen(false);
      setEditingUser(undefined);
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteUser(id);
      toast.success('User deleted successfully');
      await loadUsers();
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const handleSearch = async (query: string) => {
    try {
      const results = await searchUsers(query);
      setUsers(results);
    } catch (error) {
      toast.error('Search failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            <button
              onClick={() => {
                setEditingUser(undefined);
                setIsFormOpen(true);
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </button>
          </div>

          {isFormOpen ? (
            <div className="bg-white shadow rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">
                {editingUser ? 'Edit User' : 'Add New User'}
              </h2>
              <UserForm
                onSubmit={handleSubmit}
                onCancel={() => {
                  setIsFormOpen(false);
                  setEditingUser(undefined);
                }}
                initialData={editingUser}
              />
            </div>
          ) : null}

          <div className="bg-white shadow rounded-lg p-6">
            <UserList
              users={users}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onSearch={handleSearch}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;