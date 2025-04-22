import { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { tools, Tool } from '../data/tools';
import { transformToTree, searchInTree, getPathToNode } from '../utils/treeTransform';
import { useTransformedData } from './useTransformedData';
import { SearchResult, Message } from '../types/search';
import React from 'react';

interface SearchResultGroup {
  type: 'tools' | 'data';
  title: string;
  results: SearchResult[];
}

interface UseUnifiedSearchResult {
  isOpen: boolean;
  searchResults: SearchResultGroup[];
  chatHistory: Message[];
  openSearch: () => void;
  closeSearch: () => void;
  handleSearch: (query: string) => Promise<SearchResultGroup[]>;
  handleChatSubmit: (message: string) => Promise<void>;
  clearHistory: () => void;
  isChatMode: boolean;
  query: string;
}

export const useUnifiedSearch = (): UseUnifiedSearchResult => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResultGroup[]>([]);
  const [isChatMode, setIsChatMode] = useState(false);
  const [query, setQuery] = useState('');
  const [chatHistory, setChatHistory] = useState<Message[]>(() => {
    // Load chat history from localStorage
    const savedHistory = localStorage.getItem('chatHistory');
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  const { transformedData } = useTransformedData();

  const openSearch = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeSearch = useCallback(() => {
    // Reset to initial state
    setIsOpen(false);
    setSearchResults([]);
    setQuery('');
    setIsChatMode(false);
    setChatHistory([]);
    localStorage.removeItem('chatHistory');
  }, []);

  const clearHistory = useCallback(() => {
    setChatHistory([]);
    setSearchResults([]);
    setIsChatMode(false);
    localStorage.removeItem('chatHistory');
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for CMD/CTRL + K
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        setIsOpen(prev => !prev);
      }
      // Check for ESC
      if (event.key === 'Escape' && isOpen) {
        event.preventDefault();
        closeSearch();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeSearch]);

  const handleSearch = useCallback(async (query: string): Promise<SearchResultGroup[]> => {
    if (!query.trim()) {
      setSearchResults([]);
      return [];
    }

    // Add search query to chat history
    const searchMessage: Message = {
      id: uuidv4(),
      content: query,
      type: 'user',
      timestamp: new Date(),
      isSearchQuery: true
    };

    // Only update chat history if in chat mode
    if (isChatMode) {
      setChatHistory(prev => [...prev, searchMessage]);
    }

    // Search in tools
    const toolResults: SearchResult[] = tools
      .filter((tool: Tool) => 
        tool.name.toLowerCase().includes(query.toLowerCase()) ||
        tool.id.toLowerCase().includes(query.toLowerCase())
      )
      .map((tool: Tool) => ({
        id: tool.id,
        type: 'tool' as const,
        title: tool.name,
        name: tool.name,
        description: `Tool ID: ${tool.id}`,
        icon: React.isValidElement(tool.icon) ? tool.icon : null,
        color: tool.color,
      }))
      .slice(0, 5); // Max 5 tools

    // Search in transformed data tree
    const dataResults: SearchResult[] = transformedData 
      ? searchInTree(transformToTree(transformedData), query)
        .map(node => {
          const treeData = transformToTree(transformedData);
          const path = getPathToNode(node, treeData);
          return {
            id: node.name,
            type: 'data' as const,
            title: node.name,
            name: node.name,
            description: `Type: ${node.type}${node.dataOwner ? ` | Owner: ${node.dataOwner}` : ''}${node.dataSource ? ` | Source: ${node.dataSource}` : ''}`,
            path,
            dataOwner: node.dataOwner,
            dataSource: node.dataSource,
            latency: node.latency
          };
        })
        .slice(0, 10) // Max 10 data items
      : [];

    // Group results
    const groupedResults: SearchResultGroup[] = [];
    
    if (toolResults.length > 0) {
      groupedResults.push({
        type: 'tools',
        title: 'Features & Tools',
        results: toolResults
      });
    }

    if (dataResults.length > 0) {
      groupedResults.push({
        type: 'data',
        title: 'Data Items',
        results: dataResults
      });
    }

    // Only update search results if not in chat mode
    if (!isChatMode) {
      setSearchResults(groupedResults);
      return groupedResults;
    }
    return [];
  }, [transformedData, isChatMode]);

  const handleChatSubmit = useCallback(async (message: string) => {
    setIsChatMode(true);
    setSearchResults([]); // Clear search results when entering chat mode

    // Add user message to chat history
    const userMessage: Message = {
      id: uuidv4(),
      content: message,
      type: 'user',
      timestamp: new Date(),
      isSearchQuery: false
    };

    const updatedHistory = [...chatHistory, userMessage];
    setChatHistory(updatedHistory);

    try {
      // TODO: Implement actual chat/LLM logic here
      // This is a placeholder implementation
      const assistantMessage: Message = {
        id: uuidv4(),
        content: `I understand you're asking about "${message}". I'm currently in development, but I'll be able to help you with that soon!`,
        type: 'assistant',
        timestamp: new Date(),
        isSearchQuery: false
      };

      const finalHistory = [...updatedHistory, assistantMessage];
      setChatHistory(finalHistory);

      // Save to localStorage
      localStorage.setItem('chatHistory', JSON.stringify(finalHistory));
    } catch (error) {
      // Handle error gracefully
      const errorMessage: Message = {
        id: uuidv4(),
        content: 'I apologize, but I encountered an error processing your request. Please try again.',
        type: 'assistant',
        timestamp: new Date(),
        isSearchQuery: false
      };

      const finalHistory = [...updatedHistory, errorMessage];
      setChatHistory(finalHistory);
      localStorage.setItem('chatHistory', JSON.stringify(finalHistory));
    }
  }, [chatHistory]);

  return {
    isOpen,
    searchResults,
    chatHistory,
    openSearch,
    closeSearch,
    handleSearch,
    handleChatSubmit,
    clearHistory,
    isChatMode,
    query,
  };
}; 