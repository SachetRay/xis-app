export interface TreeNode {
  name: string;
  type: 'folder' | 'file';
  value?: any;
  children?: TreeNode[];
  dataOwner?: string;
  dataSource?: string;
  latency?: string;
  description?: string;
}

// Helper function to determine data type and metadata
function getMetadata(key: string, value: any, isLeaf: boolean): Pick<TreeNode, 'dataOwner' | 'dataSource' | 'latency' | 'description'> {
  // Convert key to lowercase for easier matching
  const keyLower = key.toLowerCase();
  
  // Determine data owner based on field context
  let dataOwner = 'System Admin';
  if (keyLower.includes('user') || keyLower.includes('profile')) {
    dataOwner = 'User Management Team';
  } else if (keyLower.includes('payment') || keyLower.includes('billing')) {
    dataOwner = 'Finance Team';
  } else if (keyLower.includes('analytics') || keyLower.includes('metrics')) {
    dataOwner = 'Analytics Team';
  } else if (isLeaf) {
    dataOwner = 'Data Team';
  }

  // Determine data source based on value type and context
  let dataSource = 'System';
  if (keyLower.includes('timestamp') || keyLower.includes('date')) {
    dataSource = 'System Clock';
  } else if (keyLower.includes('location') || keyLower.includes('address')) {
    dataSource = 'Location Service';
  } else if (keyLower.includes('user') || keyLower.includes('profile')) {
    dataSource = 'User Profile';
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
    } else if (keyLower.includes('analytics') || keyLower.includes('metrics')) {
      latency = '1 hour';
    } else {
      latency = 'On-demand';
    }
  }

  // Create a more descriptive description
  const formattedName = key
    .split(/(?=[A-Z])|_/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

  let description = `${formattedName} ${isLeaf ? 'field' : 'section'}`;
  if (isLeaf) {
    const valueType = typeof value;
    if (valueType === 'string') {
      description += ' (Text)';
    } else if (valueType === 'number') {
      description += ' (Number)';
    } else if (valueType === 'boolean') {
      description += ' (Yes/No)';
    } else if (value instanceof Date) {
      description += ' (Date/Time)';
    } else if (value === null) {
      description += ' (Optional)';
    }
  }

  return {
    dataOwner,
    dataSource,
    latency,
    description
  };
}

// Simple and efficient tree transformation
export const transformToTree = (obj: any): TreeNode[] => {
  if (!obj || typeof obj !== 'object') return [];

  // For arrays, map each item to a tree node
  if (Array.isArray(obj)) {
    return obj.map((item, index) => {
      const isLeaf = typeof item !== 'object' || item === null;
      const metadata = getMetadata(`Item ${index + 1}`, item, isLeaf);
      
      return {
        name: `Item ${index + 1}`,
        type: isLeaf ? 'file' : 'folder',
        value: isLeaf ? item : undefined,
        children: !isLeaf ? transformToTree(item) : undefined,
        ...metadata
      };
    });
  }

  // For objects, create tree nodes from key-value pairs
  return Object.entries(obj).map(([key, value]) => {
    const isLeaf = value === null || typeof value !== 'object';
    const formattedName = key
      .split(/(?=[A-Z])|_/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');

    const metadata = getMetadata(key, value, isLeaf);

    return {
      name: formattedName,
      type: isLeaf ? 'file' : 'folder',
      value: isLeaf ? value : undefined,
      children: !isLeaf ? transformToTree(value) : undefined,
      ...metadata
    };
  });
};

export function searchInTree(nodes: TreeNode | TreeNode[], query: string): TreeNode[] {
  const results: TreeNode[] = [];
  const nodeArray = Array.isArray(nodes) ? nodes : [nodes];
  const lowerQuery = query.toLowerCase().trim();
  
  for (const node of nodeArray) {
    // Check if the node's name or value matches the query (case-insensitive)
    const nodeName = node.name.toLowerCase();
    const nodeValue = node.value !== undefined ? String(node.value).toLowerCase() : '';
    
    if (nodeName.includes(lowerQuery) || nodeValue.includes(lowerQuery)) {
      results.push(node);
    }
    
    // Recursively search in children
    if (node.children) {
      results.push(...searchInTree(node.children, query));
    }
  }
  
  return results;
}

export function getPathToNode(targetNode: TreeNode, tree: TreeNode[]): string[] {
  const findPath = (nodes: TreeNode[], target: TreeNode, currentPath: string[]): string[] | null => {
    for (const node of nodes) {
      if (node.name === target.name && node.type === target.type) {
        return [...currentPath, node.name];
      }
      
      if (node.type === 'folder' && node.children) {
        const path = findPath(node.children, target, [...currentPath, node.name]);
        if (path) return path;
      }
    }
    return null;
  };

  for (const rootNode of tree) {
    const path = findPath([rootNode], targetNode, []);
    if (path) return path;
  }
  return [];
} 