// Path Mapping Configuration
// Maps between raw XDM paths and transformed paths using a level-based structure

// Interface for a single level of a transformed path
export interface PathLevel {
  level1: string;
  level2: string;
  level3: string;
  level4?: string;
  level5?: string;
}

// Interface for a complete path mapping
export interface PathMapping {
  id: string;          // Unique identifier for the mapping
  rawPath: string;     // Original path from raw XDM data
  transformedPath: string; // Full transformed path (generated from levels)
  levels: PathLevel;   // Individual level components
  description?: string; // Optional description of the field
  dataType?: string;    // Data type of the field (string, number, boolean, etc.)
}

// Path mappings array
export const pathMappings: PathMapping[] = [
  // User Details - Identity
  {
    id: "1",
    rawPath: "person/name/firstname",
    transformedPath: "userDetails/identity/firstName",
    levels: {
      level1: "userDetails",
      level2: "identity",
      level3: "firstName"
    },
    description: "User's first name",
    dataType: "string"
  },
  {
    id: "2",
    rawPath: "person/name/lastname",
    transformedPath: "userDetails/identity/lastName",
    levels: {
      level1: "userDetails",
      level2: "identity",
      level3: "lastName"
    },
    description: "User's last name",
    dataType: "string"
  },
  {
    id: "3",
    rawPath: "homeAddress/countryCode",
    transformedPath: "userDetails/identity/countryCode",
    levels: {
      level1: "userDetails",
      level2: "identity",
      level3: "countryCode"
    },
    description: "User's country code",
    dataType: "string"
  },
  {
    id: "4",
    rawPath: "adobeCorpnew/memberAccountGUID/userDetails/userAccountCreationDate",
    transformedPath: "userDetails/identity/userAccountCreationDate",
    levels: {
      level1: "userDetails",
      level2: "identity",
      level3: "userAccountCreationDate"
    },
    description: "Date when the user account was created",
    dataType: "string"
  },
  {
    id: "5",
    rawPath: "adobeCorpnew/isAdobeEmployee",
    transformedPath: "userDetails/identity/isAdobeEmployee",
    levels: {
      level1: "userDetails",
      level2: "identity",
      level3: "isAdobeEmployee"
    },
    description: "Whether the user is an Adobe employee",
    dataType: "boolean"
  },

  // User Details - Email
  {
    id: "6",
    rawPath: "personalEmail/address",
    transformedPath: "userDetails/email/address",
    levels: {
      level1: "userDetails",
      level2: "email",
      level3: "address"
    },
    description: "User's email address",
    dataType: "string"
  },
  {
    id: "7",
    rawPath: "adobeCorpnew/emailDomain",
    transformedPath: "userDetails/email/emailDomain",
    levels: {
      level1: "userDetails",
      level2: "email",
      level3: "emailDomain"
    },
    description: "Domain of the user's email",
    dataType: "string"
  },
  {
    id: "8",
    rawPath: "adobeCorpnew/hashedEmail",
    transformedPath: "userDetails/email/hashedEmail",
    levels: {
      level1: "userDetails",
      level2: "email",
      level3: "hashedEmail"
    },
    description: "Hashed value of the user's email",
    dataType: "string"
  },
  {
    id: "9",
    rawPath: "adobeCorpnew/emailValidFlag",
    transformedPath: "userDetails/email/emailValidFlag",
    levels: {
      level1: "userDetails",
      level2: "email",
      level3: "emailValidFlag"
    },
    description: "Whether the email is valid",
    dataType: "boolean"
  },

  // User Details - Authentication
  {
    id: "10",
    rawPath: "adobeCorpnew/memberAccountGUID/userDetails/authenticationSource",
    transformedPath: "userDetails/authentication/authenticationSource",
    levels: {
      level1: "userDetails",
      level2: "authentication",
      level3: "authenticationSource"
    },
    description: "Source of authentication",
    dataType: "string"
  },
  {
    id: "11",
    rawPath: "adobeCorpnew/memberAccountGUID/userDetails/authenticationSourceType",
    transformedPath: "userDetails/authentication/authenticationSourceType",
    levels: {
      level1: "userDetails",
      level2: "authentication",
      level3: "authenticationSourceType"
    },
    description: "Type of authentication source",
    dataType: "string"
  },
  {
    id: "12",
    rawPath: "adobeCorpnew/memberAccountGUID/userDetails/signupSourceName",
    transformedPath: "userDetails/authentication/signupSourceName",
    levels: {
      level1: "userDetails",
      level2: "authentication",
      level3: "signupSourceName"
    },
    description: "Source where the user signed up",
    dataType: "string"
  },
  {
    id: "13",
    rawPath: "adobeCorpnew/memberAccountGUID/userDetails/signupSocialAccount",
    transformedPath: "userDetails/authentication/signupSocialAccount",
    levels: {
      level1: "userDetails",
      level2: "authentication",
      level3: "signupSocialAccount"
    },
    description: "Social account used for signup",
    dataType: "string"
  },
  {
    id: "14",
    rawPath: "adobeCorpnew/memberAccountGUID/userDetails/signupCategory",
    transformedPath: "userDetails/authentication/signupCategory",
    levels: {
      level1: "userDetails",
      level2: "authentication",
      level3: "signupCategory"
    },
    description: "Category of signup",
    dataType: "string"
  },

  // User Details - Account System Info
  {
    id: "15",
    rawPath: "adobeCorpnew/memberAccountGUID/userDetails/type2eLinkedStatus",
    transformedPath: "userDetails/accountSystemInfo/type2eLinkedStatus",
    levels: {
      level1: "userDetails",
      level2: "accountSystemInfo",
      level3: "type2eLinkedStatus"
    },
    description: "Status of Type 2e linking",
    dataType: "string"
  },
  {
    id: "16",
    rawPath: "adobeCorpnew/memberAccountGUID/userDetails/linkToType2e",
    transformedPath: "userDetails/accountSystemInfo/linkToType2e",
    levels: {
      level1: "userDetails",
      level2: "accountSystemInfo",
      level3: "linkToType2e"
    },
    description: "Whether the account is linked to Type 2e",
    dataType: "boolean"
  },
  {
    id: "17",
    rawPath: "adobeCorpnew/memberAccountGUID/userDetails/type2eParentType",
    transformedPath: "userDetails/accountSystemInfo/type2eParentType",
    levels: {
      level1: "userDetails",
      level2: "accountSystemInfo",
      level3: "type2eParentType"
    },
    description: "Parent type of Type 2e",
    dataType: "string"
  },

  // User Details - Language Preferences
  {
    id: "18",
    rawPath: "adobeCorpnew/memberAccountGUID/userDetails/firstPref",
    transformedPath: "userDetails/languagePreferences/firstPref",
    levels: {
      level1: "userDetails",
      level2: "languagePreferences",
      level3: "firstPref"
    },
    description: "First language preference",
    dataType: "string"
  },
  {
    id: "19",
    rawPath: "adobeCorpnew/memberAccountGUID/userDetails/secondPref",
    transformedPath: "userDetails/languagePreferences/secondPref",
    levels: {
      level1: "userDetails",
      level2: "languagePreferences",
      level3: "secondPref"
    },
    description: "Second language preference",
    dataType: "string"
  },
  {
    id: "20",
    rawPath: "adobeCorpnew/memberAccountGUID/userDetails/thirdPref",
    transformedPath: "userDetails/languagePreferences/thirdPref",
    levels: {
      level1: "userDetails",
      level2: "languagePreferences",
      level3: "thirdPref"
    },
    description: "Third language preference",
    dataType: "string"
  },

  // User Details - Status
  {
    id: "21",
    rawPath: "adobeCorpnew/memberAccountGUID/userDetails/ccFunnelState",
    transformedPath: "userDetails/status/ccFunnelState",
    levels: {
      level1: "userDetails",
      level2: "status",
      level3: "ccFunnelState"
    },
    description: "Creative Cloud funnel state",
    dataType: "string"
  },
  {
    id: "22",
    rawPath: "adobeCorpnew/memberAccountGUID/userDetails/dcFunnelState",
    transformedPath: "userDetails/status/dcFunnelState",
    levels: {
      level1: "userDetails",
      level2: "status",
      level3: "dcFunnelState"
    },
    description: "Document Cloud funnel state",
    dataType: "string"
  },
  {
    id: "23",
    rawPath: "adobeCorpnew/memberAccountGUID/userDetails/applicationDetails/customerState",
    transformedPath: "userDetails/status/applicationDetails/customerState",
    levels: {
      level1: "userDetails",
      level2: "status",
      level3: "applicationDetails",
      level4: "customerState"
    },
    description: "State of the customer",
    dataType: "string"
  },

  // Models and Scores
  {
    id: "24",
    rawPath: "adobeCorpnew/memberAccountGUID/modelsAndScores/modelScore",
    transformedPath: "modelsAndScores/overallScore/modelRawScore",
    levels: {
      level1: "modelsAndScores",
      level2: "overallScore",
      level3: "modelRawScore"
    },
    description: "Raw model score",
    dataType: "number"
  },
  {
    id: "25",
    rawPath: "adobeCorpnew/memberAccountGUID/modelsAndScores/modelPercentileScore",
    transformedPath: "modelsAndScores/overallScore/modelPercentileScore",
    levels: {
      level1: "modelsAndScores",
      level2: "overallScore",
      level3: "modelPercentileScore"
    },
    description: "Model score percentile",
    dataType: "number"
  },
  
  // Individual Entitlements
  {
    id: "26",
    rawPath: "adobeCorpnew/memberAccountGUID/entitlements/numberOfEntitledProducts",
    transformedPath: "individualEntitlements/numberOfEntitledProducts",
    levels: {
      level1: "individualEntitlements",
      level2: "numberOfEntitledProducts",
      level3: ""
    },
    description: "Number of products the user is entitled to",
    dataType: "number"
  },
  {
    id: "27",
    rawPath: "adobeCorpnew/memberAccountGUID/entitlements/phsp_direct_individual/productCode",
    transformedPath: "individualEntitlements/productInfo/productCode",
    levels: {
      level1: "individualEntitlements",
      level2: "productInfo",
      level3: "productCode"
    },
    description: "Product code",
    dataType: "string"
  },
  
  // Team Entitlements
  {
    id: "28",
    rawPath: "adobeCorpnew/memberAccountGUID/contract/adminRoles",
    transformedPath: "teamEntitlements/adminRoles",
    levels: {
      level1: "teamEntitlements",
      level2: "adminRoles",
      level3: ""
    },
    description: "Admin roles of the user",
    dataType: "array"
  },
  {
    id: "29",
    rawPath: "adobeCorpnew/memberAccountGUID/contract/buyingProgram",
    transformedPath: "teamEntitlements/contractInfo/buyingProgram",
    levels: {
      level1: "teamEntitlements",
      level2: "contractInfo",
      level3: "buyingProgram"
    },
    description: "Buying program",
    dataType: "string"
  },
  
  // Product Activity
  {
    id: "30",
    rawPath: "adobeCorpnew/memberAccountGUID/appUsage/appInstalls/desktop/mac/firstActivityDate",
    transformedPath: "productActivity/installs/desktop/mac/firstActivityDate",
    levels: {
      level1: "productActivity",
      level2: "installs",
      level3: "desktop",
      level4: "mac",
      level5: "firstActivityDate"
    },
    description: "First activity date on Mac desktop",
    dataType: "string"
  },
  {
    id: "31",
    rawPath: "adobeCorpnew/memberAccountGUID/appUsage/appLaunches/desktop/mac/firstActivityDate",
    transformedPath: "productActivity/launches/desktop/mac/firstActivityDate",
    levels: {
      level1: "productActivity",
      level2: "launches",
      level3: "desktop",
      level4: "mac",
      level5: "firstActivityDate"
    },
    description: "First app launch date on Mac desktop",
    dataType: "string"
  }
];

// Helper functions for working with path mappings

/**
 * Gets a mapping by its raw path
 */
export const getMappingByRawPath = (rawPath: string): PathMapping | undefined => {
  return pathMappings.find(mapping => mapping.rawPath === rawPath);
};

/**
 * Gets a mapping by its transformed path
 */
export const getMappingByTransformedPath = (transformedPath: string): PathMapping | undefined => {
  return pathMappings.find(mapping => mapping.transformedPath === transformedPath);
};

/**
 * Updates a mapping based on levels
 */
export const updateMapping = (id: string, newLevels: PathLevel): PathMapping | null => {
  const index = pathMappings.findIndex(mapping => mapping.id === id);
  if (index === -1) return null;
  
  // Create the transformed path from the levels
  const transformedPath = [
    newLevels.level1,
    newLevels.level2,
    newLevels.level3,
    newLevels.level4,
    newLevels.level5
  ]
    .filter(Boolean)
    .join('/');
  
  // Update the mapping
  const updatedMapping = {
    ...pathMappings[index],
    levels: newLevels,
    transformedPath
  };
  
  pathMappings[index] = updatedMapping;
  return updatedMapping;
};

/**
 * Adds a new mapping
 */
export const addMapping = (
  rawPath: string, 
  levels: PathLevel, 
  description?: string,
  dataType?: string
): PathMapping => {
  // Create the transformed path from the levels
  const transformedPath = [
    levels.level1,
    levels.level2,
    levels.level3,
    levels.level4,
    levels.level5
  ]
    .filter(Boolean)
    .join('/');
  
  // Create a new ID (simple implementation)
  const id = (pathMappings.length + 1).toString();
  
  // Create the new mapping
  const newMapping: PathMapping = {
    id,
    rawPath,
    transformedPath,
    levels,
    description,
    dataType
  };
  
  // Add to the array
  pathMappings.push(newMapping);
  return newMapping;
}; 