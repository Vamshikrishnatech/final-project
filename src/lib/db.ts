import { openDB } from 'idb';
import type { User } from '../types/user';

const DB_NAME = 'employeeDB';
const STORE_NAME = 'employees';

export async function initDB() {
  const db = await openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
        store.createIndex('email', 'email', { unique: true });
      }
    },
  });
  return db;
}

export async function addUser(user: Omit<User, 'id'>) {
  const db = await initDB();
  return db.add(STORE_NAME, user);
}

export async function getAllUsers() {
  const db = await initDB();
  return db.getAll(STORE_NAME);
}

export async function updateUser(user: User) {
  const db = await initDB();
  return db.put(STORE_NAME, user);
}

export async function deleteUser(id: number) {
  const db = await initDB();
  return db.delete(STORE_NAME, id);
}

export async function searchUsers(query: string) {
  const db = await initDB();
  const users = await db.getAll(STORE_NAME);
  return users.filter(user => 
    user.name.toLowerCase().includes(query.toLowerCase()) ||
    user.email.toLowerCase().includes(query.toLowerCase()) ||
    user.department.toLowerCase().includes(query.toLowerCase())
  );
}