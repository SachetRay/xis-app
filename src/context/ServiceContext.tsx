import React, { createContext, useContext, ReactNode } from 'react';
import { schemaService } from '../services/SchemaService';
import { treeService } from '../services/TreeService';
import { pathMappingService } from '../services/PathMappingService';

// Create a type for the context value
interface ServiceContextType {
  schemaService: typeof schemaService;
  treeService: typeof treeService;
  pathMappingService: typeof pathMappingService;
}

// Create the context with a default value
const ServiceContext = createContext<ServiceContextType | null>(null);

// Provider component
interface ServiceProviderProps {
  children: ReactNode;
}

export const ServiceProvider: React.FC<ServiceProviderProps> = ({ children }) => {
  // Services are singleton instances, so we can just pass them directly
  const value = {
    schemaService,
    treeService,
    pathMappingService
  };

  return (
    <ServiceContext.Provider value={value}>
      {children}
    </ServiceContext.Provider>
  );
};

// Custom hook for using the services
export const useServices = () => {
  const context = useContext(ServiceContext);
  if (!context) {
    throw new Error('useServices must be used within a ServiceProvider');
  }
  return context;
}; 