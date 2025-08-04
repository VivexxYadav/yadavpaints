import { User } from '../types';

const DEMO_USER: User = {
  id: '1',
  email: 'demo@paintshop.com',
  name: 'Demo User',
  shopName: 'Yadav Paints'
};

export const login = async (email: string, password: string): Promise<User> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  if (email === 'demo@paintshop.com' && password === 'demo123') {
    localStorage.setItem('user', JSON.stringify(DEMO_USER));
    return DEMO_USER;
  }
  
  throw new Error('Invalid credentials');
};

export const register = async (email: string, password: string, name: string, shopName: string): Promise<User> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const newUser: User = {
    id: Date.now().toString(),
    email,
    name,
    shopName
  };
  
  localStorage.setItem('user', JSON.stringify(newUser));
  return newUser;
};

export const logout = (): void => {
  localStorage.removeItem('user');
};

export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};