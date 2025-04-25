import { userData as originalUserData } from '../data/userData';
import { transformUserData } from './userDataTransformer';
import { v4 as uuidv4 } from 'uuid';

interface PathMapping {
  id: string;
  xdmPath: string;
  level1: string;
  level2: string;
  level3: string;
  level4: string;
  level5: string;
}

// Function to extract all leaf paths from an object
function extractPaths(obj: any, currentPath: string[] = [], isLeafOnly: boolean = true): string[][] {
  if (!obj || typeof obj !== 'object') {
    return [currentPath];
  }

  const paths: string[][] = [];
  
  // If it's an array, extract paths from array elements
  if (Array.isArray(obj)) {
    // For actual user data we don't want to include array indices in the path
    // Instead, we'll extract paths from array elements
    for (let i = 0; i < obj.length; i++) {
      const item = obj[i];
      if (typeof item === 'object' && item !== null) {
        // For objects in arrays, recursively extract paths
        const nestedPaths = extractPaths(item, currentPath, isLeafOnly);
        paths.push(...nestedPaths);
      } else if (!isLeafOnly) {
        // Include path to the array itself if we're not just looking for leaf nodes
        paths.push([...currentPath]);
        break; // Only add it once
      }
    }
    
    // If the array is empty or only has primitive values and we're not strictly looking for leaf nodes
    if (obj.length === 0 && !isLeafOnly) {
      paths.push([...currentPath]);
    }
  } else {
    // For objects, extract paths for each property
    const keys = Object.keys(obj);
    
    // If not strictly looking for leaf nodes, include the path to this object itself
    if (keys.length === 0 && !isLeafOnly) {
      paths.push([...currentPath]);
    }
    
    // Process all keys in the object
    for (const key of keys) {
      const value = obj[key];
      const newPath = [...currentPath, key];
      
      if (value === null || value === undefined) {
        // Include paths with null/undefined values as leaves
        paths.push(newPath);
      } else if (typeof value === 'object') {
        // If the value is another object, recursively extract paths
        const nestedPaths = extractPaths(value, newPath, isLeafOnly);
        
        // If we got no nested paths but we're not strictly looking for leaf nodes,
        // include the path to this nested object
        if (nestedPaths.length === 0 && !isLeafOnly) {
          paths.push(newPath);
        } else {
          paths.push(...nestedPaths);
        }
      } else {
        // For primitive values (leaves), always include the path
        paths.push(newPath);
      }
    }
  }
  
  return paths;
}

// Get the transformed path corresponding to an original XDM path
function getTransformedPath(originalPath: string): string {
  // Comprehensive map of original paths to transformed paths
  const pathMappings: Record<string, string> = {
    // User Details - Identity
    'person/name/firstname': 'User Details/Identity/First Name',
    'person/name/lastname': 'User Details/Identity/Last Name',
    'homeAddress/countryCode': 'User Details/Identity/Country Code',
    'adobeCorpnew/memberAccountGUID/userDetails/userAccountCreationDate': 'User Details/Identity/Account Creation Date',
    'adobeCorpnew/isAdobeEmployee': 'User Details/Identity/Is Adobe Employee',
    
    // User Details - Email
    'personalEmail/address': 'User Details/Email/Address',
    'adobeCorpnew/emailDomain': 'User Details/Email/Domain',
    'adobeCorpnew/hashedEmail': 'User Details/Email/Hashed Email',
    'adobeCorpnew/emailValidFlag': 'User Details/Email/Valid Flag',
    
    // User Details - Authentication
    'adobeCorpnew/memberAccountGUID/userDetails/authenticationSource': 'User Details/Authentication/Source',
    'adobeCorpnew/memberAccountGUID/userDetails/authenticationSourceType': 'User Details/Authentication/Source Type',
    'adobeCorpnew/memberAccountGUID/userDetails/signupSourceName': 'User Details/Authentication/Signup Source',
    'adobeCorpnew/memberAccountGUID/userDetails/signupSocialAccount': 'User Details/Authentication/Social Account',
    'adobeCorpnew/memberAccountGUID/userDetails/signupCategory': 'User Details/Authentication/Category',
    
    // User Details - Account System Info
    'adobeCorpnew/memberAccountGUID/userDetails/type2eLinkedStatus': 'User Details/Account System/Type2e Linked Status',
    'adobeCorpnew/memberAccountGUID/userDetails/linkToType2e': 'User Details/Account System/Link To Type2e',
    'adobeCorpnew/memberAccountGUID/userDetails/type2eParentType': 'User Details/Account System/Type2e Parent Type',
    
    // User Details - Language Preferences
    'adobeCorpnew/memberAccountGUID/userDetails/firstPref': 'User Details/Language/First Preference',
    'adobeCorpnew/memberAccountGUID/userDetails/secondPref': 'User Details/Language/Second Preference',
    'adobeCorpnew/memberAccountGUID/userDetails/thirdPref': 'User Details/Language/Third Preference',
    
    // User Details - Status
    'adobeCorpnew/memberAccountGUID/userDetails/ccFunnelState': 'User Details/Status/CC Funnel State',
    'adobeCorpnew/memberAccountGUID/userDetails/dcFunnelState': 'User Details/Status/DC Funnel State',
    'adobeCorpnew/memberAccountGUID/userDetails/applicationDetails/PHOTOSHOP/customerState': 'User Details/Status/Customer State',
    
    // Email Marketing Permission
    'personalEmail/optInOut': 'Email Marketing Permission/Opt Status',
    'personalEmail/optInOut/val': 'Email Marketing Permission/Opt Value',
    'personalEmail/optInOut/time': 'Email Marketing Permission/Opt Time',
    
    // Individual Entitlements
    'adobeCorpnew/memberAccountGUID/entitlements/numberOfEntitledProducts': 'Individual Entitlements/Product Count',
    'adobeCorpnew/memberAccountGUID/entitlements/phsp_direct_individual/productCode': 'Individual Entitlements/Product Info/Code',
    'adobeCorpnew/memberAccountGUID/entitlements/phsp_direct_individual/productName': 'Individual Entitlements/Product Info/Name',
    'adobeCorpnew/memberAccountGUID/entitlements/phsp_direct_individual/productID': 'Individual Entitlements/Product Info/ID',
    'adobeCorpnew/memberAccountGUID/entitlements/phsp_direct_individual/family': 'Individual Entitlements/Product Info/Family',
    'adobeCorpnew/memberAccountGUID/entitlements/phsp_direct_individual/bundleID': 'Individual Entitlements/Product Info/Bundle ID',
    'adobeCorpnew/memberAccountGUID/entitlements/phsp_direct_individual/offerID': 'Individual Entitlements/Offer Info/ID',
    'adobeCorpnew/memberAccountGUID/entitlements/phsp_direct_individual/offerType': 'Individual Entitlements/Offer Info/Type',
    'adobeCorpnew/memberAccountGUID/entitlements/phsp_direct_individual/offerTermValue': 'Individual Entitlements/Offer Info/Term Value',
    'adobeCorpnew/memberAccountGUID/entitlements/phsp_direct_individual/offerTermUnit': 'Individual Entitlements/Offer Info/Term Unit',
    'adobeCorpnew/memberAccountGUID/entitlements/phsp_direct_individual/cloud': 'Individual Entitlements/Offer Info/Cloud',
    'adobeCorpnew/memberAccountGUID/entitlements/phsp_direct_individual/commitmentType': 'Individual Entitlements/Offer Info/Commitment Type',
    
    // Team Entitlements
    'adobeCorpnew/memberAccountGUID/contract/b2bEntitlements/phsp_direct_team/productCode': 'Team Entitlements/Product Info/Code',
    'adobeCorpnew/memberAccountGUID/contract/b2bEntitlements/phsp_direct_team/productName': 'Team Entitlements/Product Info/Name',
    'adobeCorpnew/memberAccountGUID/contract/b2bEntitlements/phsp_direct_team/productID': 'Team Entitlements/Product Info/ID',
    'adobeCorpnew/memberAccountGUID/contract/b2bEntitlements/phsp_direct_team/offerID': 'Team Entitlements/Offer Info/ID',
    'adobeCorpnew/memberAccountGUID/contract/b2bEntitlements/phsp_direct_team/offerType': 'Team Entitlements/Offer Info/Type',
    'adobeCorpnew/memberAccountGUID/contract/b2bEntitlements/phsp_direct_team/offerTermValue': 'Team Entitlements/Offer Info/Term Value',
    'adobeCorpnew/memberAccountGUID/contract/b2bEntitlements/phsp_direct_team/offerTermUnit': 'Team Entitlements/Offer Info/Term Unit',
    
    // Models and Scores
    'adobeCorpnew/memberAccountGUID/modelsAndScores/SKU_RANK/modelScore': 'Models And Scores/Overall Score/Model Score',
    'adobeCorpnew/memberAccountGUID/modelsAndScores/SKU_RANK/modelPercentileScore': 'Models And Scores/Overall Score/Percentile Score',
    'adobeCorpnew/memberAccountGUID/modelsAndScores/SKU_RANK/modelScoreDate': 'Models And Scores/Overall Score/Score Date',
    'adobeCorpnew/memberAccountGUID/modelsAndScores/SKU_RANK/modelUserSegment': 'Models And Scores/Overall Score/User Segment',
    
    // Product Activity
    'adobeCorpnew/memberAccountGUID/appUsage/PHOTOSHOP/appInstalls/desktop/mac/firstActivityDate': 'Product Activity/Installs/Desktop/Mac/First Activity Date',
    'adobeCorpnew/memberAccountGUID/appUsage/PHOTOSHOP/appInstalls/desktop/mac/recentActivityDate': 'Product Activity/Installs/Desktop/Mac/Recent Activity Date',
    'adobeCorpnew/memberAccountGUID/appUsage/PHOTOSHOP/appInstalls/desktop/mac/mostRecentAppVersion': 'Product Activity/Installs/Desktop/Mac/App Version',
    'adobeCorpnew/memberAccountGUID/appUsage/PHOTOSHOP/appInstalls/desktop/mac/mostRecentOSVersion': 'Product Activity/Installs/Desktop/Mac/OS Version',
    
    'adobeCorpnew/memberAccountGUID/appUsage/PHOTOSHOP/appInstalls/desktop/windows/firstActivityDate': 'Product Activity/Installs/Desktop/Windows/First Activity Date',
    'adobeCorpnew/memberAccountGUID/appUsage/PHOTOSHOP/appInstalls/desktop/windows/recentActivityDate': 'Product Activity/Installs/Desktop/Windows/Recent Activity Date',
    'adobeCorpnew/memberAccountGUID/appUsage/PHOTOSHOP/appInstalls/desktop/windows/mostRecentAppVersion': 'Product Activity/Installs/Desktop/Windows/App Version',
    'adobeCorpnew/memberAccountGUID/appUsage/PHOTOSHOP/appInstalls/desktop/windows/mostRecentOSVersion': 'Product Activity/Installs/Desktop/Windows/OS Version',
    
    'adobeCorpnew/memberAccountGUID/appUsage/PHOTOSHOP/appInstalls/web/firstActivityDate': 'Product Activity/Installs/Web/First Activity Date',
    'adobeCorpnew/memberAccountGUID/appUsage/PHOTOSHOP/appInstalls/web/recentActivityDate': 'Product Activity/Installs/Web/Recent Activity Date',
    'adobeCorpnew/memberAccountGUID/appUsage/PHOTOSHOP/appInstalls/web/mostRecentAppVersion': 'Product Activity/Installs/Web/App Version',
    'adobeCorpnew/memberAccountGUID/appUsage/PHOTOSHOP/appInstalls/web/mostRecentOSVersion': 'Product Activity/Installs/Web/OS Version'
  };

  return pathMappings[originalPath] || originalPath;
}

// Split a transformed path into levels for the XDM path mapping
function splitIntoLevels(path: string): { level1: string, level2: string, level3: string, level4: string, level5: string } {
  const segments = path.split('/');
  
  // Handle special cases for top-level categories
  let level1 = segments[0] || '';
  
  // Convert to proper display format
  switch(level1) {
    case 'userDetails':
      level1 = 'User Details';
      break;
    case 'emailMarketingPermission':
      level1 = 'Email Marketing Permission';
      break;
    case 'individualEntitlements':
      level1 = 'Individual Entitlements';
      break;
    case 'teamEntitlements':
      level1 = 'Team Entitlements';
      break;
    case 'modelsAndScores':
      level1 = 'Models And Scores';
      break;
    case 'productActivity':
      level1 = 'Product Activity';
      break;
  }

  return {
    level1,
    level2: segments[1] || '',
    level3: segments[2] || '',
    level4: segments[3] || '',
    level5: segments.slice(4).join('/') || ''
  };
}

// Create path mappings from userData
export const createXdmPathMappings = (): PathMapping[] => {
  return [
    // User Identity Information
    {
      id: uuidv4(),
      xdmPath: "person.name.firstname",
      level1: "userDetails",
      level2: "identity",
      level3: "firstName",
      level4: "",
      level5: ""
    },
    {
      id: uuidv4(),
      xdmPath: "person.name.lastname",
      level1: "userDetails",
      level2: "identity",
      level3: "lastName",
      level4: "",
      level5: ""
    },
    {
      id: uuidv4(),
      xdmPath: "homeAddress.countryCode",
      level1: "userDetails",
      level2: "identity",
      level3: "countryCode",
      level4: "",
      level5: ""
    },
    {
      id: uuidv4(),
      xdmPath: "adobeCorpnew.isAdobeEmployee",
      level1: "userDetails",
      level2: "identity",
      level3: "isAdobeEmployee",
      level4: "",
      level5: ""
    },

    // Email Information
    {
      id: uuidv4(),
      xdmPath: "personalEmail.address",
      level1: "userDetails",
      level2: "email",
      level3: "address",
      level4: "",
      level5: ""
    },
    {
      id: uuidv4(),
      xdmPath: "adobeCorpnew.emailDomain",
      level1: "userDetails",
      level2: "email",
      level3: "emailDomain",
      level4: "",
      level5: ""
    },
    {
      id: uuidv4(),
      xdmPath: "adobeCorpnew.hashedEmail",
      level1: "userDetails",
      level2: "email",
      level3: "hashedEmail",
      level4: "",
      level5: ""
    },
    {
      id: uuidv4(),
      xdmPath: "adobeCorpnew.emailValidFlag",
      level1: "userDetails",
      level2: "email",
      level3: "emailValidFlag",
      level4: "",
      level5: ""
    },

    // Authentication Details
    {
      id: uuidv4(),
      xdmPath: "adobeCorpnew.memberAccountGUID.userDetails.authenticationSource",
      level1: "userDetails",
      level2: "authentication",
      level3: "authenticationSource",
      level4: "",
      level5: ""
    },
    {
      id: uuidv4(),
      xdmPath: "adobeCorpnew.memberAccountGUID.userDetails.authenticationSourceType",
      level1: "userDetails",
      level2: "authentication",
      level3: "authenticationSourceType",
      level4: "",
      level5: ""
    },
    {
      id: uuidv4(),
      xdmPath: "adobeCorpnew.memberAccountGUID.userDetails.signupSourceName",
      level1: "userDetails",
      level2: "authentication",
      level3: "signupSourceName",
      level4: "",
      level5: ""
    },
    {
      id: uuidv4(),
      xdmPath: "adobeCorpnew.memberAccountGUID.userDetails.signupSocialAccount",
      level1: "userDetails",
      level2: "authentication",
      level3: "signupSocialAccount",
      level4: "",
      level5: ""
    },
    {
      id: uuidv4(),
      xdmPath: "adobeCorpnew.memberAccountGUID.userDetails.signupCategory",
      level1: "userDetails",
      level2: "authentication",
      level3: "signupCategory",
      level4: "",
      level5: ""
    },

    // Account System Information
    {
      id: uuidv4(),
      xdmPath: "adobeCorpnew.memberAccountGUID.userDetails.type2eLinkedStatus",
      level1: "userDetails",
      level2: "accountSystemInfo",
      level3: "type2eLinkedStatus",
      level4: "",
      level5: ""
    },
    {
      id: uuidv4(),
      xdmPath: "adobeCorpnew.memberAccountGUID.userDetails.linkToType2e",
      level1: "userDetails",
      level2: "accountSystemInfo",
      level3: "linkToType2e",
      level4: "",
      level5: ""
    },
    {
      id: uuidv4(),
      xdmPath: "adobeCorpnew.memberAccountGUID.userDetails.type2eParentType",
      level1: "userDetails",
      level2: "accountSystemInfo",
      level3: "type2eParentType",
      level4: "",
      level5: ""
    },

    // Language Preferences
    {
      id: uuidv4(),
      xdmPath: "adobeCorpnew.memberAccountGUID.userDetails.firstPref",
      level1: "userDetails",
      level2: "languagePreferences",
      level3: "firstPref",
      level4: "",
      level5: ""
    },
    {
      id: uuidv4(),
      xdmPath: "adobeCorpnew.memberAccountGUID.userDetails.secondPref",
      level1: "userDetails",
      level2: "languagePreferences",
      level3: "secondPref",
      level4: "",
      level5: ""
    },
    {
      id: uuidv4(),
      xdmPath: "adobeCorpnew.memberAccountGUID.userDetails.thirdPref",
      level1: "userDetails",
      level2: "languagePreferences",
      level3: "thirdPref",
      level4: "",
      level5: ""
    },

    // Status Information
    {
      id: uuidv4(),
      xdmPath: "adobeCorpnew.memberAccountGUID.userDetails.ccFunnelState",
      level1: "userDetails",
      level2: "status",
      level3: "ccFunnelState",
      level4: "",
      level5: ""
    },
    {
      id: uuidv4(),
      xdmPath: "adobeCorpnew.memberAccountGUID.userDetails.dcFunnelState",
      level1: "userDetails",
      level2: "status",
      level3: "dcFunnelState",
      level4: "",
      level5: ""
    },
    {
      id: uuidv4(),
      xdmPath: "adobeCorpnew.memberAccountGUID.userDetails.applicationDetails.customerState",
      level1: "userDetails",
      level2: "status",
      level3: "applicationDetails",
      level4: "customerState",
      level5: ""
    },

    // Individual Entitlements
    {
      id: uuidv4(),
      xdmPath: "adobeCorpnew.memberAccountGUID.entitlements.numberOfEntitledProducts",
      level1: "individualEntitlements",
      level2: "numberOfEntitledProducts",
      level3: "",
      level4: "",
      level5: ""
    },
    {
      id: uuidv4(),
      xdmPath: "adobeCorpnew.memberAccountGUID.entitlements.phsp_direct_individual.productCode",
      level1: "individualEntitlements",
      level2: "productInfo",
      level3: "productCode",
      level4: "",
      level5: ""
    },
    {
      id: uuidv4(),
      xdmPath: "adobeCorpnew.memberAccountGUID.entitlements.phsp_direct_individual.productName",
      level1: "individualEntitlements",
      level2: "productInfo",
      level3: "productName",
      level4: "",
      level5: ""
    },
    {
      id: uuidv4(),
      xdmPath: "adobeCorpnew.memberAccountGUID.entitlements.phsp_direct_individual.productID",
      level1: "individualEntitlements",
      level2: "productInfo",
      level3: "productID",
      level4: "",
      level5: ""
    },
    {
      id: uuidv4(),
      xdmPath: "adobeCorpnew.memberAccountGUID.entitlements.phsp_direct_individual.family",
      level1: "individualEntitlements",
      level2: "productInfo",
      level3: "family",
      level4: "",
      level5: ""
    },

    // Team Entitlements
    {
      id: uuidv4(),
      xdmPath: "adobeCorpnew.memberAccountGUID.contract.buyingProgram",
      level1: "teamEntitlements",
      level2: "contractInfo",
      level3: "buyingProgram",
      level4: "",
      level5: ""
    },
    {
      id: uuidv4(),
      xdmPath: "adobeCorpnew.memberAccountGUID.contract.contractStatus",
      level1: "teamEntitlements",
      level2: "contractInfo",
      level3: "contractStatus",
      level4: "",
      level5: ""
    },
    {
      id: uuidv4(),
      xdmPath: "adobeCorpnew.memberAccountGUID.contract.contractType",
      level1: "teamEntitlements",
      level2: "contractInfo",
      level3: "contractType",
      level4: "",
      level5: ""
    },

    // Models and Scores
    {
      id: uuidv4(),
      xdmPath: "adobeCorpnew.memberAccountGUID.modelsAndScores.modelScore",
      level1: "modelsAndScores",
      level2: "overallScore",
      level3: "modelScore",
      level4: "",
      level5: ""
    },
    {
      id: uuidv4(),
      xdmPath: "adobeCorpnew.memberAccountGUID.modelsAndScores.modelPercentileScore",
      level1: "modelsAndScores",
      level2: "overallScore",
      level3: "modelPercentileScore",
      level4: "",
      level5: ""
    },
    {
      id: uuidv4(),
      xdmPath: "adobeCorpnew.memberAccountGUID.modelsAndScores.modelUserSegment",
      level1: "modelsAndScores",
      level2: "overallScore",
      level3: "modelUserSegment",
      level4: "",
      level5: ""
    },

    // Product Activity
    {
      id: uuidv4(),
      xdmPath: "adobeCorpnew.memberAccountGUID.appUsage.appInstalls.desktop.mac.firstActivityDate",
      level1: "productActivity",
      level2: "installs",
      level3: "desktop",
      level4: "mac",
      level5: "firstActivityDate"
    },
    {
      id: uuidv4(),
      xdmPath: "adobeCorpnew.memberAccountGUID.appUsage.appInstalls.desktop.mac.recentActivityDate",
      level1: "productActivity",
      level2: "installs",
      level3: "desktop",
      level4: "mac",
      level5: "recentActivityDate"
    },
    {
      id: uuidv4(),
      xdmPath: "adobeCorpnew.memberAccountGUID.appUsage.appInstalls.desktop.mac.mostRecentAppVersion",
      level1: "productActivity",
      level2: "installs",
      level3: "desktop",
      level4: "mac",
      level5: "mostRecentAppVersion"
    }
  ];
};

// Preserve all unique leaf nodes in the mapping
export function getSimplifiedMappings(): PathMapping[] {
  const mappings = createXdmPathMappings();
  
  // Create a map to store unique mappings based on their transformed paths
  const uniqueMappings = new Map<string, PathMapping>();
  
  // Process all mappings
  for (const mapping of mappings) {
    const transformedPath = `${mapping.level1}/${mapping.level2}/${mapping.level3}/${mapping.level4}/${mapping.level5}`.replace(/\/+/g, '/').replace(/\/$/, '');
    
    // Store this mapping if we haven't seen this transformed path before
    if (!uniqueMappings.has(transformedPath)) {
      uniqueMappings.set(transformedPath, mapping);
    }
  }
  
  // Convert the map values back to an array
  return Array.from(uniqueMappings.values());
} 