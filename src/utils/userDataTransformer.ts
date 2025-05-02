import { userData } from '../data/userData';
import { transformedUserData } from '../data/transformedUserData';
import type { TransformedUserData } from '../types/transformedUserData';
import type { UserData } from '../types/userData';

// Define interface for path mapping
export interface PathMapping {
  id: string;
  xdmPath: string;
  transformedPath: string;
  transform?: (value: any) => any;
}

// Create a mapping store
let userDefinedMappings: PathMapping[] = [];

// Load initial mappings from localStorage if available
const loadMappingsFromStorage = (): PathMapping[] => {
  try {
    const savedMappings = localStorage.getItem('userDefinedMappings');
    if (savedMappings) {
      // Parse the mappings but omit any transform functions as they can't be serialized
      const parsed = JSON.parse(savedMappings) as PathMapping[];
      
      // Re-add transform functions based on mapping type
      return parsed.map(mapping => {
        const newMapping = { ...mapping };
        if (mapping.xdmPath.includes('isAdobeEmployee') || 
            mapping.xdmPath.includes('emailValidFlag') || 
            mapping.xdmPath.includes('linkToType2e')) {
          newMapping.transform = stringToBoolean;
        }
        return newMapping;
      });
    }
  } catch (error) {
    console.error('Error loading mappings from localStorage:', error);
  }
  return [];
};

// Initialize with default mappings if no saved mappings
const initializeMappings = () => {
  // Default mappings for critical paths that need to be present
  const defaultMappings: PathMapping[] = [
    // User Details - Identity
    {
      id: '1',
      xdmPath: 'person/name/firstname',
      transformedPath: 'userDetails/identity/firstName'
    },
    {
      id: '2',
      xdmPath: 'person/name/lastname',
      transformedPath: 'userDetails/identity/lastName'
    },
    {
      id: '3',
      xdmPath: 'homeAddress/countryCode',
      transformedPath: 'userDetails/identity/countryCode'
    },
    {
      id: '4',
      xdmPath: 'adobeCorpnew/memberAccountGUID/userDetails/userAccountCreationDate',
      transformedPath: 'userDetails/identity/userAccountCreationDate'
    },
    {
      id: '5',
      xdmPath: 'adobeCorpnew/isAdobeEmployee',
      transformedPath: 'userDetails/identity/isAdobeEmployee',
      transform: stringToBoolean
    },
    
    // User Details - Email
    {
      id: '6',
      xdmPath: 'personalEmail/address',
      transformedPath: 'userDetails/email/address'
    },
    {
      id: '7',
      xdmPath: 'adobeCorpnew/emailDomain',
      transformedPath: 'userDetails/email/emailDomain'
    },
    {
      id: '8',
      xdmPath: 'adobeCorpnew/hashedEmail',
      transformedPath: 'userDetails/email/hashedEmail'
    },
    {
      id: '9',
      xdmPath: 'adobeCorpnew/emailValidFlag',
      transformedPath: 'userDetails/email/emailValidFlag',
      transform: stringToBoolean
    }
  ];
  
  // If no saved mappings, use default ones
  if (userDefinedMappings.length === 0) {
    userDefinedMappings = defaultMappings;
    saveMappingsToStorage();
  }
};

// Save mappings to localStorage
const saveMappingsToStorage = () => {
  try {
    // Create a version without transform functions for JSON serialization
    const serializableMappings = userDefinedMappings.map(({ id, xdmPath, transformedPath }) => ({
      id, xdmPath, transformedPath
    }));
    localStorage.setItem('userDefinedMappings', JSON.stringify(serializableMappings));
  } catch (error) {
    console.error('Error saving mappings to localStorage:', error);
  }
};

// Function to get value from object using path
const getValueByPath = (obj: any, path: string): any => {
  return path.split('/').reduce((current, key) => current?.[key], obj);
};

// Function to set value in object using path
const setValueByPath = (obj: any, path: string, value: any): void => {
  const keys = path.split('/');
  const lastKey = keys.pop()!;
  const target = keys.reduce((current, key) => {
    if (!current[key]) current[key] = {};
    return current[key];
  }, obj);
  target[lastKey] = value;
};

// Helper function to convert string to boolean
const stringToBoolean = (value: string): boolean => {
  return value.toLowerCase() === 'yes' || value.toLowerCase() === 'true';
};

// Load mappings when module is imported
userDefinedMappings = loadMappingsFromStorage();
initializeMappings();

// Function to transform userData to the new structure using dynamic mappings
export const transformUserData = (data: UserData): TransformedUserData => {
  // Start with the existing transformed structure
  const transformed = { ...transformedUserData };

  // Apply the user-defined mappings
  userDefinedMappings.forEach(({ xdmPath, transformedPath, transform }) => {
    const value = getValueByPath(data, xdmPath);
    if (value !== undefined) {
      const transformedValue = transform ? transform(value) : value;
      setValueByPath(transformed, transformedPath, transformedValue);
    }
  });

  return transformed as TransformedUserData;
};

// Functions for managing mappings
export const getAllMappings = (): PathMapping[] => {
  return [...userDefinedMappings];
};

export const addMapping = (mapping: PathMapping): void => {
  // Check if a mapping with this ID already exists
  const existingIndex = userDefinedMappings.findIndex(m => m.id === mapping.id);
  
  if (existingIndex >= 0) {
    // Update existing mapping
    userDefinedMappings[existingIndex] = mapping;
  } else {
    // Add new mapping
    userDefinedMappings.push(mapping);
  }
  
  saveMappingsToStorage();
};

export const deleteMapping = (id: string): void => {
  userDefinedMappings = userDefinedMappings.filter(m => m.id !== id);
  saveMappingsToStorage();
};

// Function to update transformedUserData based on path mapping changes
export const updateTransformedData = (
  xdmPath: string,
  newTransformedPath: string,
  currentTransformed: TransformedUserData
): TransformedUserData => {
  const newTransformed = { ...currentTransformed };
  const value = getValueByPath(userData, xdmPath);
  
  if (value !== undefined) {
    // Create a unique ID for the mapping if it's new
    const existingMapping = userDefinedMappings.find(m => m.xdmPath === xdmPath);
    const id = existingMapping?.id || Date.now().toString();
    
    // Add or update the mapping in our store
    const needsTransform = xdmPath.includes('isAdobeEmployee') || 
                           xdmPath.includes('emailValidFlag') || 
                           xdmPath.includes('linkToType2e');
    
    const newMapping: PathMapping = {
      id,
      xdmPath,
      transformedPath: newTransformedPath,
      ...(needsTransform ? { transform: stringToBoolean } : {})
    };
    
    addMapping(newMapping);
    
    // Apply the transformation
    const transformedValue = needsTransform ? stringToBoolean(value) : value;
    setValueByPath(newTransformed, newTransformedPath, transformedValue);
    
    // Also update the JSON file by dispatching an event
    // The actual file update would need to be handled by a server-side operation
    const event = new CustomEvent('mappingUpdated', {
      detail: { xdmPath, transformedPath: newTransformedPath, value: transformedValue }
    });
    window.dispatchEvent(event);
  }
  
  return newTransformed;
};

// Export the transformed data
export { transformedUserData };

// Function to persist the transformedData to a JSON file (would require backend)
export function storeTransformedData(transformedData: TransformedUserData): void {
  // In a real implementation, this would make a fetch call to a backend endpoint
  console.log('Storing transformed data:', transformedData);
  
  // Create and dispatch an event to notify interested components
  const event = new CustomEvent('transformedDataStored', {
    detail: { transformedData }
  });
  window.dispatchEvent(event);
}

export function getTransformedData(): TransformedUserData {
  return transformUserData(userData);
} 