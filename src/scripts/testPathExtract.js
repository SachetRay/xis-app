// Create sample data for testing
const sampleUserData = {
  "person": {
    "name": {
      "firstname": "John",
      "lastname": "Doe"
    }
  },
  "homeAddress": {
    "countryCode": "US"
  },
  "personalEmail": {
    "address": "john.doe@gmail.com"
  },
  "adobeCorpnew": {
    "isAdobeEmployee": "YES",
    "emailDomain": "adobe.com",
    "emailValidFlag": "YES",
    "hashedEmail": "YES",
    "memberAccountGUID": {
      "modelsAndScores": {
        "SKU_RANK": {
          "modelScore": 80,
          "modelPercentileScore": "95%",
          "modelScoreDate": "2023-01-01",
          "modelUserSegment": "Value Customer"
        }
      },
      "entitlements": {
        "numberOfEntitledProducts": 1
      },
      "userDetails": {
        "userAccountCreationDate": "2020-06-01T21:28:38Z",
        "authenticationSource": "WCD"
      },
      "appUsage": {
        "PHOTOSHOP": {
          "appInstalls": {
            "desktop": {
              "mac": {
                "firstActivityDate": "2022-01-15T10:00:00Z",
                "recentActivityDate": "2024-07-28T14:30:00Z"
              }
            }
          }
        }
      }
    }
  }
};

// Function to extract all leaf paths from an object
function extractPaths(obj, currentPath = [], isLeafOnly = true) {
  if (!obj || typeof obj !== 'object') {
    return [currentPath];
  }

  const paths = [];
  
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

function getTransformedPath(originalPath) {
  // Comprehensive mapping for testing
  const mappings = {
    'person/name/firstname': 'userDetails/identity/firstName',
    'person/name/lastname': 'userDetails/identity/lastName',
    'homeAddress/countryCode': 'userDetails/identity/countryCode',
    'adobeCorpnew/memberAccountGUID/userDetails/userAccountCreationDate': 'userDetails/identity/userAccountCreationDate',
    'adobeCorpnew/isAdobeEmployee': 'userDetails/identity/isAdobeEmployee',
    'personalEmail/address': 'userDetails/email/address',
    'adobeCorpnew/emailDomain': 'userDetails/email/emailDomain',
    'adobeCorpnew/emailValidFlag': 'userDetails/email/emailValidFlag',
    'adobeCorpnew/hashedEmail': 'userDetails/email/hashedEmail',
    'adobeCorpnew/memberAccountGUID/userDetails/authenticationSource': 'userDetails/authentication/authenticationSource',
    'adobeCorpnew/memberAccountGUID/modelsAndScores/SKU_RANK/modelScore': 'modelsAndScores/overallScore/modelScore',
    'adobeCorpnew/memberAccountGUID/modelsAndScores/SKU_RANK/modelPercentileScore': 'modelsAndScores/overallScore/modelPercentileScore',
    'adobeCorpnew/memberAccountGUID/modelsAndScores/SKU_RANK/modelScoreDate': 'modelsAndScores/overallScore/modelScoreDate',
    'adobeCorpnew/memberAccountGUID/modelsAndScores/SKU_RANK/modelUserSegment': 'modelsAndScores/overallScore/modelUserSegment',
    'adobeCorpnew/memberAccountGUID/entitlements/numberOfEntitledProducts': 'individualEntitlements/numberOfEntitledProducts',
    'adobeCorpnew/memberAccountGUID/appUsage/PHOTOSHOP/appInstalls/desktop/mac/firstActivityDate': 'productActivity/installs/desktop/mac/firstActivityDate',
    'adobeCorpnew/memberAccountGUID/appUsage/PHOTOSHOP/appInstalls/desktop/mac/recentActivityDate': 'productActivity/installs/desktop/mac/recentActivityDate'
  };

  // Try exact match
  if (mappings[originalPath]) {
    return mappings[originalPath];
  }

  // Find parent paths that match
  const matchingPaths = Object.entries(mappings)
    .filter(([key]) => originalPath.startsWith(key))
    .sort((a, b) => b[0].length - a[0].length);

  if (matchingPaths.length > 0) {
    const [matchingPath, transformedPathPrefix] = matchingPaths[0];
    const remainingPath = originalPath.slice(matchingPath.length);
    
    return remainingPath ? 
      remainingPath.startsWith('/') ? 
        `${transformedPathPrefix}${remainingPath}` : 
        `${transformedPathPrefix}/${remainingPath}` : 
      transformedPathPrefix;
  }

  return originalPath;
}

function splitIntoLevels(path) {
  const segments = path.split('/');
  return {
    level1: segments[0] || '',
    level2: segments[1] || '',
    level3: segments[2] || '',
    level4: segments[3] || '',
    level5: segments.slice(4).join('/') || ''
  };
}

console.log('=== Testing XDM Path Extraction ===');

// Extract all leaf paths
const allPaths = extractPaths(sampleUserData, [], true);
console.log(`Total leaf paths extracted: ${allPaths.length}`);

// Show each path
console.log('\nAll paths:');
allPaths.forEach((pathArray, index) => {
  const originalPath = pathArray.join('/');
  const transformedPath = getTransformedPath(originalPath);
  const levels = splitIntoLevels(transformedPath);
  
  console.log(`\nPath ${index + 1}:`);
  console.log(`XDM Path: ${originalPath}`);
  console.log(`Transformed Path: ${transformedPath}`);
  console.log(`Level 1: ${levels.level1}`);
  console.log(`Level 2: ${levels.level2}`);
  console.log(`Level 3: ${levels.level3}`);
  console.log(`Level 4: ${levels.level4}`);
  console.log(`Level 5: ${levels.level5}`);
});

// Check some key paths
const keyPaths = [
  'person/name/firstname',
  'adobeCorpnew/memberAccountGUID/modelsAndScores/SKU_RANK/modelScore',
  'adobeCorpnew/memberAccountGUID/appUsage/PHOTOSHOP/appInstalls/desktop/mac/firstActivityDate'
];

console.log('\n=== Key Path Mappings ===');
keyPaths.forEach(path => {
  const transformed = getTransformedPath(path);
  console.log(`${path} => ${transformed}`);
}); 