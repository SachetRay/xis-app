import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { PathMapping, PathLevel } from '../data/mapping/pathMappingConfig';
import { pathMappingService, PathMappingEvents } from '../services/PathMappingService';
import { schemaService } from '../services/SchemaService';

// Define the context shape
interface PathMappingContextType {
  mappings: PathMapping[];
  isLoading: boolean;
  error: string | null;
  updateMapping: (id: string, newLevels: PathLevel) => PathMapping | null;
  addMapping: (rawPath: string, levels: PathLevel, description?: string, dataType?: string) => PathMapping | null;
  getMappingById: (id: string) => PathMapping | undefined;
  getMappingByRawPath: (rawPath: string) => PathMapping | undefined;
  getMappingByTransformedPath: (transformedPath: string) => PathMapping | undefined;
  getUniqueValuesForLevel: (level: keyof PathLevel) => string[];
}

// Create context with default empty values
const PathMappingContext = createContext<PathMappingContextType>({
  mappings: [],
  isLoading: true,
  error: null,
  updateMapping: () => null,
  addMapping: () => null,
  getMappingById: () => undefined,
  getMappingByRawPath: () => undefined,
  getMappingByTransformedPath: () => undefined,
  getUniqueValuesForLevel: () => []
});

// Provider component props
interface PathMappingProviderProps {
  children: ReactNode;
}

// Provider component
export const PathMappingProvider: React.FC<PathMappingProviderProps> = ({ children }) => {
  const [mappings, setMappings] = useState<PathMapping[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load initial mappings
  useEffect(() => {
    try {
      setMappings(pathMappingService.getAllMappings());
      setIsLoading(false);
    } catch (error) {
      setError('Failed to load path mappings');
      setIsLoading(false);
      console.error('Path mapping loading error:', error);
    }
  }, []);

  // Subscribe to mapping events
  useEffect(() => {
    const mappingUpdatedUnsubscribe = pathMappingService.subscribe(
      PathMappingEvents.MAPPING_UPDATED,
      () => {
        setMappings(pathMappingService.getAllMappings());
      }
    );

    const mappingAddedUnsubscribe = pathMappingService.subscribe(
      PathMappingEvents.MAPPING_ADDED,
      () => {
        setMappings(pathMappingService.getAllMappings());
      }
    );

    return () => {
      mappingUpdatedUnsubscribe();
      mappingAddedUnsubscribe();
    };
  }, []);

  // Update a mapping with new levels
  const updateMapping = (id: string, newLevels: PathLevel): PathMapping | null => {
    try {
      return pathMappingService.updateMappingLevels(id, newLevels);
    } catch (error) {
      console.error('Failed to update mapping:', error);
      return null;
    }
  };

  // Add a new mapping
  const addMapping = (
    rawPath: string,
    levels: PathLevel,
    description?: string,
    dataType?: string
  ): PathMapping | null => {
    try {
      return pathMappingService.addNewMapping(rawPath, levels, description, dataType);
    } catch (error) {
      console.error('Failed to add mapping:', error);
      return null;
    }
  };

  // Get mapping by ID
  const getMappingById = (id: string): PathMapping | undefined => {
    return pathMappingService.getMappingById(id);
  };

  // Get mapping by raw path
  const getMappingByRawPath = (rawPath: string): PathMapping | undefined => {
    return pathMappingService.getMappingByRawPath(rawPath);
  };

  // Get mapping by transformed path
  const getMappingByTransformedPath = (transformedPath: string): PathMapping | undefined => {
    return pathMappingService.getMappingByTransformedPath(transformedPath);
  };

  // Get unique values for a level
  const getUniqueValuesForLevel = (level: keyof PathLevel): string[] => {
    return pathMappingService.getUniqueValuesForLevel(level);
  };

  return (
    <PathMappingContext.Provider
      value={{
        mappings,
        isLoading,
        error,
        updateMapping,
        addMapping,
        getMappingById,
        getMappingByRawPath,
        getMappingByTransformedPath,
        getUniqueValuesForLevel
      }}
    >
      {children}
    </PathMappingContext.Provider>
  );
};

// Custom hook for using the path mapping context
export const usePathMapping = () => useContext(PathMappingContext);

export default PathMappingContext; 