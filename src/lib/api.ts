import axios from 'axios';
import type { User } from '../types/user';

const API_URL = 'http://localhost:3000/api';

export async function addUser(user: Omit<User, 'id'>) {
  const response = await axios.post(`${API_URL}/users`, user);
  return response.data;
}

export async function getAllUsers() {
  const response = await axios.get(`${API_URL}/users`);
  return response.data;
}

export async function updateUser(user: User) {
  const response = await axios.put(`${API_URL}/users/${user.id}`, user);
  return response.data;
}

export async function deleteUser(id: number) {
  const response = await axios.delete(`${API_URL}/users/${id}`);
  return response.data;
}

export async function searchUsers(query: string) {
  const response = await axios.get(`${API_URL}/users/search`, {
    params: { q: query }
  });
  return response.data;
}