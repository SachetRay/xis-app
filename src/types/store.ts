// User related types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'analyst';
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  notifications: boolean;
  dashboardLayout: string[];
}

// Project related types
export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'archived' | 'deleted';
  members: string[];
}

// Analytics related types
export interface AnalyticsData {
  id: string;
  projectId: string;
  metrics: {
    [key: string]: number;
  };
  period: {
    start: string;
    end: string;
  };
}

// Root state type
export interface RootState {
  auth: AuthState;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface ProjectsState {
  items: Project[];
  selectedProject: Project | null;
  loading: boolean;
  error: string | null;
}

export interface AnalyticsState {
  data: AnalyticsData[];
  loading: boolean;
  error: string | null;
  filters: {
    dateRange: [string, string];
    metrics: string[];
  };
}

export interface UIState {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  notifications: {
    items: Notification[];
    unreadCount: number;
  };
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  read: boolean;
  createdAt: string;
} 