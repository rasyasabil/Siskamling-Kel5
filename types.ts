
export type UserRole = 'resident' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string; // Added for login
  role: UserRole;
  avatar: string;
}

export interface Report {
  id: string;
  type: 'suspicious' | 'guest' | 'theft' | 'other';
  description: string;
  location: string;
  status: 'pending' | 'processed' | 'completed';
  timestamp: number;
  reporterName: string;
  imageUrl?: string;
  aiAnalysis?: string; // Analysis from Gemini
}

export interface Shift {
  id: string;
  userId: string;
  userName: string;
  date: string; // ISO Date string YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  status: 'scheduled' | 'active' | 'completed';
}

export interface Comment {
  id: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  timestamp: number;
}

export interface ForumPost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  category: 'security' | 'announcement' | 'general';
  title: string;
  content: string;
  timestamp: number;
  likes: number;
  isLiked: boolean; // Track if current user liked it
  isReported: boolean; // Track if current user reported it
  comments: Comment[]; // Changed from number to array
}

export interface Contact {
  id: string;
  name: string;
  role: string;
  phone: string;
  isEmergency: boolean;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'alert';
  timestamp: number;
  isRead: boolean;
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  REPORTING = 'REPORTING',
  SCHEDULE = 'SCHEDULE',
  FORUM = 'FORUM',
  CONTACTS = 'CONTACTS',
  AI_ASSISTANT = 'AI_ASSISTANT'
}
