// TreeNode interface for hierarchical data structure
export interface TreeNode {
  id: string;
  name: string;
  type: 'folder' | 'file';
  value?: any;
  children?: TreeNode[];
  parentId?: string;
  path?: string;
  level: number;
  isExpanded?: boolean;
  isSelected?: boolean;
  
  // Metadata fields
  dataOwner?: string;
  dataSource?: string;
  latency?: string;
  description?: string;
  xdmPath?: string;
  importance?: 'low' | 'medium' | 'high';
  category?: string;
  dataType?: string;
  lastUpdated?: string;
}

// Interface for a flat representation of tree nodes (for easier lookups)
export interface FlatTreeNode extends TreeNode {
  childrenIds: string[];
}

// Type for a dictionary of flat nodes
export type FlatNodeMap = Record<string, FlatTreeNode>;

// Tree transformation options
export interface TreeTransformOptions {
  includeMetadata?: boolean;
  includeXDMPaths?: boolean;
}

// Path structure for building trees
export interface PathInfo {
  path: string;
  value: any;
  metadata?: Record<string, any>;
} 