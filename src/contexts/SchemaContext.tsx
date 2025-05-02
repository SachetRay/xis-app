import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { RawUserData } from '../data/schema/rawDataSchema';
import { TransformedUserData } from '../data/schema/transformedSchema';
import { schemaService } from '../services/SchemaService';

// Define the context shape
interface SchemaContextType {
  rawSchema: RawUserData;
  transformedSchema: TransformedUserData;
  isLoading: boolean;
  error: string | null;
  updateRawSchema: (path: string, value: any) => boolean;
  updateTransformedSchema: (path: string, value: any) => boolean;
  getRawValue: (path: string) => any;
  getTransformedValue: (path: string) => any;
  resetSchemas: () => void;
}

// Create context with default empty values
const SchemaContext = createContext<SchemaContextType>({
  rawSchema: {} as RawUserData,
  transformedSchema: {} as TransformedUserData,
  isLoading: true,
  error: null,
  updateRawSchema: () => false,
  updateTransformedSchema: () => false,
  getRawValue: () => undefined,
  getTransformedValue: () => undefined,
  resetSchemas: () => {}
});

// Provider component props
interface SchemaProviderProps {
  children: ReactNode;
}

// Provider component
export const SchemaProvider: React.FC<SchemaProviderProps> = ({ children }) => {
  const [rawSchema, setRawSchema] = useState<RawUserData>({} as RawUserData);
  const [transformedSchema, setTransformedSchema] = useState<TransformedUserData>({} as TransformedUserData);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load initial schemas
  useEffect(() => {
    try {
      setRawSchema(schemaService.getRawSchema());
      setTransformedSchema(schemaService.getTransformedSchema());
      setIsLoading(false);
    } catch (error) {
      setError('Failed to load schemas');
      setIsLoading(false);
      console.error('Schema loading error:', error);
    }
  }, []);

  // Update raw schema at path
  const updateRawSchema = (path: string, value: any): boolean => {
    try {
      const success = schemaService.updateRawSchemaAt(path, value);
      if (success) {
        setRawSchema(schemaService.getRawSchema());
      }
      return success;
    } catch (error) {
      console.error('Failed to update raw schema:', error);
      return false;
    }
  };

  // Update transformed schema at path
  const updateTransformedSchema = (path: string, value: any): boolean => {
    try {
      const success = schemaService.updateTransformedSchemaAt(path, value);
      if (success) {
        setTransformedSchema(schemaService.getTransformedSchema());
      }
      return success;
    } catch (error) {
      console.error('Failed to update transformed schema:', error);
      return false;
    }
  };

  // Get value from raw schema at path
  const getRawValue = (path: string): any => {
    return schemaService.getRawSchemaValueAt(path);
  };

  // Get value from transformed schema at path
  const getTransformedValue = (path: string): any => {
    return schemaService.getTransformedSchemaValueAt(path);
  };

  // Reset schemas to their original state
  const resetSchemas = (): void => {
    schemaService.resetSchemas();
    setRawSchema(schemaService.getRawSchema());
    setTransformedSchema(schemaService.getTransformedSchema());
  };

  return (
    <SchemaContext.Provider
      value={{
        rawSchema,
        transformedSchema,
        isLoading,
        error,
        updateRawSchema,
        updateTransformedSchema,
        getRawValue,
        getTransformedValue,
        resetSchemas
      }}
    >
      {children}
    </SchemaContext.Provider>
  );
};

// Custom hook for using the schema context
export const useSchema = () => useContext(SchemaContext);

export default SchemaContext; 