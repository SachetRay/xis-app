export interface TreeNode {
  name: string;
  type: 'folder' | 'file';
  value?: any;
  children?: TreeNode[];
  dataOwner?: string;
  dataSource?: string;
  latency?: string;
  description?: string;
  xdmPath?: string;       // Original XDM path
  importance?: 'low' | 'medium' | 'high'; // Data importance
  category?: string;      // Category of data
  dataType?: string;      // Type of data (string, number, boolean, etc.)
  lastUpdated?: string;   // When the data was last updated
}

// Helper function to determine data type and metadata
function getMetadata(key: string, value: any, isLeaf: boolean, path: string[] = []): Omit<TreeNode, 'name' | 'type' | 'value' | 'children'> {
  // Convert key to lowercase for easier matching
  const keyLower = key.toLowerCase();
  const fullPath = path.join('/');
  const lastPathSegment = path[path.length - 1]?.toLowerCase() || '';
  
  // Determine data owner based on field context
  let dataOwner = 'System Admin';
  if (keyLower.includes('user') || keyLower.includes('profile') || fullPath.includes('userDetails')) {
    dataOwner = 'User Management Team';
  } else if (keyLower.includes('payment') || keyLower.includes('billing') || keyLower.includes('entitlement')) {
    dataOwner = 'Finance Team';
  } else if (keyLower.includes('analytics') || keyLower.includes('metrics') || keyLower.includes('scores')) {
    dataOwner = 'Analytics Team';
  } else if (lastPathSegment.includes('email') || fullPath.includes('email')) {
    dataOwner = 'Marketing Team';
  } else if (isLeaf) {
    dataOwner = 'Data Team';
  }

  // Determine data source based on value type and context
  let dataSource = 'System';
  if (keyLower.includes('timestamp') || keyLower.includes('date') || keyLower.includes('dts')) {
    dataSource = 'System Clock';
  } else if (keyLower.includes('location') || keyLower.includes('address') || keyLower.includes('country')) {
    dataSource = 'Location Service';
  } else if (keyLower.includes('user') || keyLower.includes('profile') || fullPath.includes('userDetails')) {
    dataSource = 'User Profile';
  } else if (fullPath.includes('entitlement') || fullPath.includes('contract')) {
    dataSource = 'Entitlement System';
  } else if (fullPath.includes('activity') || lastPathSegment.includes('activity')) {
    dataSource = 'Activity Tracking';
  } else if (typeof value === 'number' && keyLower.includes('id')) {
    dataSource = 'ID Generator';
  }

  // Determine latency based on data type and update frequency
  let latency = 'N/A';
  if (isLeaf) {
    if (keyLower.includes('timestamp') || keyLower.includes('status')) {
      latency = 'Real-time';
    } else if (keyLower.includes('cache') || keyLower.includes('temp')) {
      latency = '5 minutes';
    } else if (keyLower.includes('analytics') || keyLower.includes('metrics') || fullPath.includes('scores')) {
      latency = '1 hour';
    } else if (fullPath.includes('activity') || lastPathSegment.includes('activity')) {
      latency = '15 minutes';
    } else {
      latency = 'On-demand';
    }
  }

  // Determine data importance
  let importance: 'low' | 'medium' | 'high' = 'medium';
  if (fullPath.includes('identity') || keyLower.includes('email') || keyLower.includes('name')) {
    importance = 'high';
  } else if (fullPath.includes('status') || fullPath.includes('activity')) {
    importance = 'medium';
  } else if (fullPath.includes('preferences')) {
    importance = 'low';
  }

  // Determine data category
  let category = 'Uncategorized';
  if (fullPath.includes('userDetails')) {
    category = 'User Information';
  } else if (fullPath.includes('entitlements')) {
    category = 'Product Entitlements';
  } else if (fullPath.includes('activity')) {
    category = 'User Activity';
  } else if (fullPath.includes('scores')) {
    category = 'Analytics';
  } else if (fullPath.includes('email')) {
    category = 'Communication';
  }

  // Determine data type for leaf nodes
  let dataType = '';
  if (isLeaf) {
    dataType = typeof value;
    if (value === null) {
      dataType = 'null';
    } else if (Array.isArray(value)) {
      dataType = 'array';
    } else if (value instanceof Date) {
      dataType = 'date';
    }
  }

  // Mock last updated date - in a real implementation, this would come from the data source
  const lastUpdated = new Date(Date.now() - Math.random() * 10000000000).toISOString();

  // Create a more descriptive description
  const formattedName = key
    .split(/(?=[A-Z])|_/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

  let description = `${formattedName} ${isLeaf ? 'field' : 'section'}`;
  if (isLeaf) {
    if (dataType === 'string') {
      description += ' containing text data';
    } else if (dataType === 'number') {
      description += ' containing numeric value';
    } else if (dataType === 'boolean') {
      description += ' indicating yes/no state';
    } else if (dataType === 'date') {
      description += ' containing timestamp information';
    } else if (dataType === 'null') {
      description += ' (currently empty)';
    } else if (dataType === 'array') {
      description += ' containing multiple values';
    }
  } else {
    // More meaningful descriptions for folder nodes based on their path
    if (fullPath.includes('userDetails/identity')) {
      description = 'Core user identity information including name and location';
    } else if (fullPath.includes('userDetails/email')) {
      description = 'User email contact information and validation status';
    } else if (fullPath.includes('userDetails/authentication')) {
      description = 'User authentication and sign-up details';
    } else if (fullPath.includes('userDetails/accountSystemInfo')) {
      description = 'Account system linking and integration information';
    } else if (fullPath.includes('userDetails/languagePreferences')) {
      description = 'User preferred languages for UI and communications';
    } else if (fullPath.includes('userDetails/status')) {
      description = 'Current user status within various application funnels';
    } else if (fullPath.includes('individualEntitlements')) {
      description = 'Individual user product entitlements and subscription details';
    } else if (fullPath.includes('teamEntitlements')) {
      description = 'Team-level entitlements and contract information';
    } else if (fullPath.includes('modelsAndScores')) {
      description = 'User behavior models and predictive scores';
    } else if (fullPath.includes('productActivity')) {
      description = 'User product usage and activity data';
    }
  }

  // Attempt to infer XDM path from the structure
  // This is a simplification - in reality, a more comprehensive mapping would be used
  let xdmPath = undefined;
  if (fullPath) {
    if (fullPath.includes('userDetails/identity/firstName')) {
      xdmPath = 'person/name/firstname';
    } else if (fullPath.includes('userDetails/identity/lastName')) {
      xdmPath = 'person/name/lastname';
    } else if (fullPath.includes('userDetails/identity/countryCode')) {
      xdmPath = 'homeAddress/countryCode';
    } else if (fullPath.includes('userDetails/email/address')) {
      xdmPath = 'personalEmail/address';
    }
    // This would be extended with more mappings
  }

  return {
    dataOwner,
    dataSource,
    latency,
    description,
    importance,
    category,
    dataType,
    lastUpdated,
    xdmPath
  };
}

// Enhanced tree transformation with better metadata
export const transformToTree = (obj: any, path: string[] = []): TreeNode[] => {
  if (!obj || typeof obj !== 'object') return [];

  // For arrays, map each item to a tree node
  if (Array.isArray(obj)) {
    return obj.map((item, index) => {
      const itemPath = [...path, `Item ${index + 1}`];
      const isLeaf = typeof item !== 'object' || item === null;
      const metadata = getMetadata(`Item ${index + 1}`, item, isLeaf, itemPath);
      
      return {
        name: `Item ${index + 1}`,
        type: isLeaf ? 'file' : 'folder',
        value: isLeaf ? item : undefined,
        children: !isLeaf ? transformToTree(item, itemPath) : undefined,
        ...metadata
      };
    });
  }

  // For objects, create tree nodes from key-value pairs
  return Object.entries(obj).map(([key, value]) => {
    const isLeaf = value === null || typeof value !== 'object';
    const nodePath = [...path, key];
    
    const formattedName = key
      .split(/(?=[A-Z])|_/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');

    const metadata = getMetadata(key, value, isLeaf, nodePath);

    return {
      name: formattedName,
      type: isLeaf ? 'file' : 'folder',
      value: isLeaf ? value : undefined,
      children: !isLeaf ? transformToTree(value, nodePath) : undefined,
      ...metadata
    };
  });
};

// Enhanced search with more comprehensive field matching and context awareness
export function searchInTree(nodes: TreeNode | TreeNode[], query: string): TreeNode[] {
  const results: TreeNode[] = [];
  const nodeArray = Array.isArray(nodes) ? nodes : [nodes];
  const lowerQuery = query.toLowerCase().trim();
  
  // If query is empty, return empty results
  if (!lowerQuery) return results;
  
  // Helper function to check if a node matches the query
  const nodeMatches = (node: TreeNode): boolean => {
    // Check node name
    if (node.name.toLowerCase().includes(lowerQuery)) return true;
    
    // Check node value if it's a primitive
    if (node.value !== undefined) {
      const valueStr = String(node.value).toLowerCase();
      if (valueStr.includes(lowerQuery)) return true;
    }
    
    // Check metadata fields
    if (node.description?.toLowerCase().includes(lowerQuery)) return true;
    if (node.dataOwner?.toLowerCase().includes(lowerQuery)) return true;
    if (node.dataSource?.toLowerCase().includes(lowerQuery)) return true;
    if (node.category?.toLowerCase().includes(lowerQuery)) return true;
    if (node.xdmPath?.toLowerCase().includes(lowerQuery)) return true;
    
    return false;
  };
  
  // Process each node
  for (const node of nodeArray) {
    // Check if this node matches
    if (nodeMatches(node)) {
      results.push(node);
    }
    
    // Recursively check children
    if (node.children) {
      const childResults = searchInTree(node.children, lowerQuery);
      results.push(...childResults);
    }
  }
  
  return results;
}

// Enhanced path finding with better context awareness
export function getPathToNode(targetNode: TreeNode, tree: TreeNode[]): string[] {
  // Helper function to find path recursively
  const findPath = (nodes: TreeNode[], target: TreeNode, currentPath: string[]): string[] | null => {
    for (const node of nodes) {
      // Match by id if available, otherwise by name+type
      if (node.name === target.name && node.type === target.type) {
        // Additional validation to avoid false positives
        // For leaf nodes, also check the value if available
        if (node.type === 'file' && node.value !== undefined && target.value !== undefined) {
          if (String(node.value) !== String(target.value)) {
            continue; // Values don't match, not the same node
          }
        }
        
        return [...currentPath, node.name];
      }
      
      // Recursively search in children
      if (node.type === 'folder' && node.children) {
        const path = findPath(node.children, target, [...currentPath, node.name]);
        if (path) return path;
      }
    }
    return null;
  };

  // Try to find the path starting from each root node
  for (const rootNode of tree) {
    const path = findPath([rootNode], targetNode, []);
    if (path) return path;
  }
  
  // If no path found, return just the node name
  return [targetNode.name];
} 