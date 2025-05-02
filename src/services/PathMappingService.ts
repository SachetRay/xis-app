// Path Mapping Service
// Handles operations related to path mappings between raw and transformed data

import { 
  pathMappings, 
  PathMapping, 
  PathLevel,
  getMappingByRawPath,
  getMappingByTransformedPath,
  updateMapping,
  addMapping
} from '../data/mapping/pathMappingConfig';
import { schemaService } from './SchemaService';
import { EventEmitter } from '../utils/EventEmitter';

// Events emitted by this service
export enum PathMappingEvents {
  MAPPING_UPDATED = 'mapping_updated',
  MAPPING_ADDED = 'mapping_added',
  MAPPING_DELETED = 'mapping_deleted'
}

/**
 * Path Mapping Service provides functionality to manipulate path mappings
 * and synchronize changes with the schema.
 */
class PathMappingService {
  // Event emitter for mapping changes
  private eventEmitter = new EventEmitter();
  
  /**
   * Get all path mappings
   */
  getAllMappings(): PathMapping[] {
    return [...pathMappings];
  }
  
  /**
   * Get a specific mapping by ID
   */
  getMappingById(id: string): PathMapping | undefined {
    return pathMappings.find(mapping => mapping.id === id);
  }
  
  /**
   * Get a mapping by raw path
   */
  getMappingByRawPath(rawPath: string): PathMapping | undefined {
    return getMappingByRawPath(rawPath);
  }
  
  /**
   * Get a mapping by transformed path
   */
  getMappingByTransformedPath(transformedPath: string): PathMapping | undefined {
    return getMappingByTransformedPath(transformedPath);
  }
  
  /**
   * Filter mappings based on level values
   */
  getMappingsByLevel(level: keyof PathLevel, value: string): PathMapping[] {
    return pathMappings.filter(mapping => mapping.levels[level] === value);
  }
  
  /**
   * Get all unique values for a specific level
   */
  getUniqueValuesForLevel(level: keyof PathLevel): string[] {
    const values = new Set<string>();
    pathMappings.forEach(mapping => {
      if (mapping.levels[level]) {
        values.add(mapping.levels[level] as string);
      }
    });
    return Array.from(values).sort();
  }
  
  /**
   * Update a mapping with new level values
   * This also ensures the transformed schema is updated to reflect the changes
   */
  updateMappingLevels(id: string, newLevels: PathLevel): PathMapping | null {
    const originalMapping = this.getMappingById(id);
    if (!originalMapping) return null;
    
    // Update the mapping
    const updatedMapping = updateMapping(id, newLevels);
    if (!updatedMapping) return null;
    
    // Ensure the path exists in the transformed schema
    schemaService.ensureTransformedPath(updatedMapping.transformedPath);
    
    // Notify listeners of the change
    this.eventEmitter.emit(PathMappingEvents.MAPPING_UPDATED, {
      originalMapping,
      updatedMapping
    });
    
    return updatedMapping;
  }
  
  /**
   * Add a new mapping
   */
  addNewMapping(
    rawPath: string,
    levels: PathLevel,
    description?: string,
    dataType?: string
  ): PathMapping | null {
    // Validate that the raw path exists in the schema
    if (!schemaService.rawPathExists(rawPath)) {
      console.error(`Raw path does not exist: ${rawPath}`);
      return null;
    }
    
    // Add the new mapping
    const newMapping = addMapping(rawPath, levels, description, dataType);
    
    // Ensure the path exists in the transformed schema
    schemaService.ensureTransformedPath(newMapping.transformedPath);
    
    // Notify listeners of the change
    this.eventEmitter.emit(PathMappingEvents.MAPPING_ADDED, {
      newMapping
    });
    
    return newMapping;
  }
  
  /**
   * Apply a raw data value to the transformed schema using mappings
   */
  applyValueToTransformedSchema(rawPath: string, value: any): boolean {
    const mapping = this.getMappingByRawPath(rawPath);
    if (!mapping) {
      console.warn(`No mapping found for raw path: ${rawPath}`);
      return false;
    }
    
    return schemaService.updateTransformedSchemaAt(mapping.transformedPath, value);
  }
  
  /**
   * Transform an entire raw data object using all available mappings
   */
  transformRawData(rawData: any): any {
    const result: any = {};
    
    // For each mapping, extract the value from raw data and apply to transformed structure
    pathMappings.forEach(mapping => {
      try {
        // Get raw value
        const rawValue = this.extractValueFromPath(rawData, mapping.rawPath);
        
        // Apply to transformed structure
        if (rawValue !== undefined) {
          this.setValueAtPath(result, mapping.transformedPath, rawValue);
        }
      } catch (error) {
        console.error(`Error transforming ${mapping.rawPath}:`, error);
      }
    });
    
    return result;
  }
  
  /**
   * Extract a value from an object at the specified path
   */
  private extractValueFromPath(obj: any, path: string): any {
    const parts = path.split('/');
    let current = obj;
    
    for (const part of parts) {
      if (current === undefined || current === null) {
        return undefined;
      }
      current = current[part];
    }
    
    return current;
  }
  
  /**
   * Set a value in an object at the specified path
   */
  private setValueAtPath(obj: any, path: string, value: any): void {
    const parts = path.split('/');
    let current = obj;
    
    // Create the nested structure
    for (let i = 0; i < parts.length - 1; i++) {
      if (!current[parts[i]]) {
        current[parts[i]] = {};
      }
      current = current[parts[i]];
    }
    
    // Set the value at the final path
    current[parts[parts.length - 1]] = value;
  }
  
  /**
   * Subscribe to mapping events
   */
  subscribe(event: PathMappingEvents, callback: (data: any) => void): () => void {
    return this.eventEmitter.subscribe(event, callback);
  }
}

// Create and export a singleton instance
export const pathMappingService = new PathMappingService();

// Export the service class for testing
export default PathMappingService; 