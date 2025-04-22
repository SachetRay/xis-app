import { ReactNode } from 'react';

export interface SearchResult {
  id: string;
  type: 'tool' | 'data' | 'folder';
  name: string;
  title: string;
  description?: string;
  icon?: ReactNode;
  color?: string;
  path?: string[];
  dataOwner?: string;
  dataSource?: string;
  latency?: string;
}

export interface Message {
  id: string;
  content: string;
  type: 'user' | 'assistant' | 'search';
  timestamp: Date;
  searchResults?: SearchResult[];
  isSearchQuery?: boolean;
} 