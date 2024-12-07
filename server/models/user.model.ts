import pool from '../config/database';
import { User } from '../../src/types/user';

export async function createUser(user: Omit<User, 'id'>): Promise<number> {
  const [result] = await pool.execute(
    'INSERT INTO users (name, email, phone, department, joinDate) VALUES (?, ?, ?, ?, ?)',
    [user.name, user.email, user.phone, user.department, user.joinDate]
  );
  return (result as any).insertId;
}

export async function getAllUsers(): Promise<User[]> {
  const [rows] = await pool.execute('SELECT * FROM users');
  return rows as User[];
}

export async function updateUser(user: User): Promise<void> {
  await pool.execute(
    'UPDATE users SET name = ?, email = ?, phone = ?, department = ?, joinDate = ? WHERE id = ?',
    [user.name, user.email, user.phone, user.department, user.joinDate, user.id]
  );
}

export async function deleteUser(id: number): Promise<void> {
  await pool.execute('DELETE FROM users WHERE id = ?', [id]);
}

export async function searchUsers(query: string): Promise<User[]> {
  const [rows] = await pool.execute(
    'SELECT * FROM users WHERE name LIKE ? OR email LIKE ? OR department LIKE ?',
    [`%${query}%`, `%${query}%`, `%${query}%`]
  );
  return rows as User[];
}