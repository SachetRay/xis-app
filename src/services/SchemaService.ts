// Schema Service
// Handles operations related to the schema definitions

import { rawDataSchema, RawUserData } from '../data/schema/rawDataSchema';
import { transformedSchema, TransformedUserData } from '../data/schema/transformedSchema';

/**
 * Schema Service provides access to raw and transformed schemas
 * and functionality to update them.
 */
class SchemaService {
  // State to hold the current schemas
  private _rawSchema: RawUserData;
  private _transformedSchema: TransformedUserData;
  
  /**
   * Initialize the service with default schemas
   */
  constructor() {
    this._rawSchema = JSON.parse(JSON.stringify(rawDataSchema));
    this._transformedSchema = JSON.parse(JSON.stringify(transformedSchema));
  }
  
  /**
   * Get the raw data schema
   */
  getRawSchema(): RawUserData {
    return JSON.parse(JSON.stringify(this._rawSchema));
  }
  
  /**
   * Get the transformed data schema
   */
  getTransformedSchema(): TransformedUserData {
    return JSON.parse(JSON.stringify(this._transformedSchema));
  }
  
  /**
   * Update a value in the raw schema at the specified path
   */
  updateRawSchemaAt(path: string, value: any): boolean {
    try {
      const pathParts = path.split('/');
      let current = this._rawSchema as any;
      
      // Navigate through the path parts to find the target location
      for (let i = 0; i < pathParts.length - 1; i++) {
        if (current[pathParts[i]] === undefined) {
          return false; // Path doesn't exist
        }
        current = current[pathParts[i]];
      }
      
      // Update the value at the target location
      const lastPart = pathParts[pathParts.length - 1];
      current[lastPart] = value;
      return true;
    } catch (error) {
      console.error("Error updating raw schema:", error);
      return false;
    }
  }
  
  /**
   * Update a value in the transformed schema at the specified path
   */
  updateTransformedSchemaAt(path: string, value: any): boolean {
    try {
      const pathParts = path.split('/');
      let current = this._transformedSchema as any;
      
      // Navigate through the path parts to find the target location
      for (let i = 0; i < pathParts.length - 1; i++) {
        if (current[pathParts[i]] === undefined) {
          return false; // Path doesn't exist
        }
        current = current[pathParts[i]];
      }
      
      // Update the value at the target location
      const lastPart = pathParts[pathParts.length - 1];
      current[lastPart] = value;
      return true;
    } catch (error) {
      console.error("Error updating transformed schema:", error);
      return false;
    }
  }
  
  /**
   * Get a value from the raw schema at the specified path
   */
  getRawSchemaValueAt(path: string): any {
    try {
      const pathParts = path.split('/');
      let current = this._rawSchema as any;
      
      // Navigate through the path parts to find the target location
      for (const part of pathParts) {
        if (current[part] === undefined) {
          return undefined; // Path doesn't exist
        }
        current = current[part];
      }
      
      return current;
    } catch (error) {
      console.error("Error getting raw schema value:", error);
      return undefined;
    }
  }
  
  /**
   * Get a value from the transformed schema at the specified path
   */
  getTransformedSchemaValueAt(path: string): any {
    try {
      const pathParts = path.split('/');
      let current = this._transformedSchema as any;
      
      // Navigate through the path parts to find the target location
      for (const part of pathParts) {
        if (current[part] === undefined) {
          return undefined; // Path doesn't exist
        }
        current = current[part];
      }
      
      return current;
    } catch (error) {
      console.error("Error getting transformed schema value:", error);
      return undefined;
    }
  }
  
  /**
   * Checks if a path exists in the raw schema
   */
  rawPathExists(path: string): boolean {
    return this.getRawSchemaValueAt(path) !== undefined;
  }
  
  /**
   * Checks if a path exists in the transformed schema
   */
  transformedPathExists(path: string): boolean {
    return this.getTransformedSchemaValueAt(path) !== undefined;
  }
  
  /**
   * Create a path in the transformed schema if it doesn't exist
   */
  ensureTransformedPath(path: string): boolean {
    try {
      const pathParts = path.split('/');
      let current = this._transformedSchema as any;
      
      // Navigate through the path parts, creating objects as needed
      for (let i = 0; i < pathParts.length - 1; i++) {
        if (current[pathParts[i]] === undefined) {
          current[pathParts[i]] = {};
        }
        current = current[pathParts[i]];
      }
      
      // Set an empty value for the last part if it doesn't exist
      const lastPart = pathParts[pathParts.length - 1];
      if (current[lastPart] === undefined) {
        // Determine the type based on naming conventions (simplified)
        if (lastPart.includes('Date')) {
          current[lastPart] = "";
        } else if (lastPart.includes('Count') || lastPart.includes('Number')) {
          current[lastPart] = 0;
        } else if (lastPart.startsWith('is') || lastPart.includes('Valid') || lastPart.includes('Has')) {
          current[lastPart] = false;
        } else {
          current[lastPart] = "";
        }
      }
      
      return true;
    } catch (error) {
      console.error("Error ensuring transformed path:", error);
      return false;
    }
  }
  
  /**
   * Reset schemas to their original state
   */
  resetSchemas(): void {
    this._rawSchema = JSON.parse(JSON.stringify(rawDataSchema));
    this._transformedSchema = JSON.parse(JSON.stringify(transformedSchema));
  }
}

// Create and export a singleton instance
export const schemaService = new SchemaService();

// Export the service class for testing
export default SchemaService; 