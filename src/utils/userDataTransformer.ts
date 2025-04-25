import { userData } from '../data/userData';
import { transformedUserData } from '../data/transformedUserData';
import type { TransformedUserData } from '../types/transformedUserData';
import type { UserData } from '../types/userData';

// Function to get value from object using path
const getValueByPath = (obj: any, path: string): any => {
  return path.split('/').reduce((current, key) => current?.[key], obj);
};

// Function to set value in object using path
const setValueByPath = (obj: any, path: string, value: any): void => {
  const keys = path.split('/');
  const lastKey = keys.pop()!;
  const target = keys.reduce((current, key) => {
    if (!current[key]) {
      current[key] = {};
    }
    return current[key];
  }, obj);
  target[lastKey] = value;
};

// Function to convert string to boolean
const stringToBoolean = (value: string): boolean => {
  return value.toLowerCase() === 'yes' || value.toLowerCase() === 'true';
};

// Function to transform userData to the new structure
export const transformUserData = (data: UserData): TransformedUserData => {
  // Start with the existing transformed structure
  const transformed = { ...transformedUserData };

  // Map of XDM paths to transformed paths with type conversion functions
  const pathMappings: Array<{
    xdmPath: string;
    transformedPath: string;
    transform?: (value: any) => any;
  }> = [
    {
      xdmPath: 'person/name/firstname',
      transformedPath: 'userDetails/identity/firstName'
    },
    {
      xdmPath: 'person/name/lastname',
      transformedPath: 'userDetails/identity/lastName'
    },
    {
      xdmPath: 'homeAddress/countryCode',
      transformedPath: 'userDetails/identity/countryCode'
    },
    {
      xdmPath: 'adobeCorpnew/memberAccountGUID/userDetails/userAccountCreationDate',
      transformedPath: 'userDetails/identity/userAccountCreationDate'
    },
    {
      xdmPath: 'adobeCorpnew/isAdobeEmployee',
      transformedPath: 'userDetails/identity/isAdobeEmployee',
      transform: stringToBoolean
    },
    {
      xdmPath: 'personalEmail/address',
      transformedPath: 'userDetails/email/address'
    },
    {
      xdmPath: 'adobeCorpnew/emailDomain',
      transformedPath: 'userDetails/email/emailDomain'
    },
    {
      xdmPath: 'adobeCorpnew/hashedEmail',
      transformedPath: 'userDetails/email/hashedEmail'
    },
    {
      xdmPath: 'adobeCorpnew/emailValidFlag',
      transformedPath: 'userDetails/email/emailValidFlag',
      transform: stringToBoolean
    }
  ];

  // Apply the mappings with type conversions
  pathMappings.forEach(({ xdmPath, transformedPath, transform }) => {
    const value = getValueByPath(data, xdmPath);
    if (value !== undefined) {
      const transformedValue = transform ? transform(value) : value;
      setValueByPath(transformed, transformedPath, transformedValue);
    }
  });

  return transformed as TransformedUserData;
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
    setValueByPath(newTransformed, newTransformedPath, value);
  }
  
  return newTransformed;
};

// Export the transformed data
export { transformedUserData };

export function storeTransformedData(transformedData: TransformedUserData): void {
  // Implementation for storing the transformed data
  console.log('Storing transformed data:', transformedData);
}

export function getTransformedData(): TransformedUserData | null {
  // Retrieve the stored transformed data
  return null;
} 