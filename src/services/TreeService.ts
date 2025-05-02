// Tree Service
// Handles tree structure generation and manipulation for the Data Wizard

import { TreeNode, FlatTreeNode, FlatNodeMap, PathInfo } from '../data/tree/treeTypes';
import { transformedUserData } from '../data/transformedUserData';
import { v4 as uuidv4 } from 'uuid';

// Define events that the tree service will emit
export enum TreeEvents {
  TREE_UPDATED = 'TREE_UPDATED',
  NODE_SELECTED = 'NODE_SELECTED',
  NODE_EXPANDED = 'NODE_EXPANDED',
  NODE_COLLAPSED = 'NODE_COLLAPSED',
  ERROR = 'ERROR',
}

// EventEmitter class for the tree service
class EventEmitter {
  private events: Record<string, Function[]> = {};

  on(event: string, listener: Function) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
    return () => this.off(event, listener);
  }

  off(event: string, listener: Function) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter(l => l !== listener);
  }

  emit(event: string, ...args: any[]) {
    if (!this.events[event]) return;
    this.events[event].forEach(listener => listener(...args));
  }
}

// Tree service implementation
export class TreeService extends EventEmitter {
  private tree: TreeNode[] = [];
  private flatNodes: FlatNodeMap = {};

  constructor() {
    super();
    this.initializeFromData();
  }

  // Initialize the tree from the transformed user data
  private initializeFromData() {
    try {
      const paths = this.extractPathsFromData(transformedUserData);
      this.buildTreeFromPaths(paths);
    } catch (error) {
      console.error('Failed to initialize tree from data:', error);
      this.emit(TreeEvents.ERROR, 'Failed to initialize tree');
    }
  }

  // Extract paths from the data object
  private extractPathsFromData(data: any, parentPath: string = ''): PathInfo[] {
    const paths: PathInfo[] = [];
    
    if (!data || typeof data !== 'object') return paths;
    
    for (const [key, value] of Object.entries(data)) {
      const currentPath = parentPath ? `${parentPath}/${key}` : key;
      
      if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
        // If it's a non-array object, recurse
        paths.push(...this.extractPathsFromData(value, currentPath));
      } else {
        // If it's a leaf node
        paths.push({
          path: currentPath,
          value,
          metadata: {
            dataType: Array.isArray(value) ? 'array' : typeof value
          }
        });
      }
    }
    
    return paths;
  }

  // Build tree from paths
  public buildTreeFromPaths(paths: PathInfo[]) {
    this.tree = [];
    this.flatNodes = {};
    
    // Create root nodes first
    const rootPaths = new Set<string>();
    paths.forEach(({ path }) => {
      const rootName = path.split('/')[0];
      rootPaths.add(rootName);
    });
    
    // Create a map of paths to nodes
    const pathMap: Record<string, TreeNode> = {};
    
    // Create root nodes
    rootPaths.forEach(rootName => {
      const rootNode: TreeNode = {
        id: uuidv4(),
        name: this.formatName(rootName),
        type: 'folder',
        level: 0,
        children: []
      };
      this.tree.push(rootNode);
      pathMap[rootName] = rootNode;
    });
    
    // Process all paths
    paths.sort((a, b) => a.path.localeCompare(b.path)).forEach(({ path, value, metadata }) => {
      const parts = path.split('/');
      let currentPath = '';
      let parentNode: TreeNode | null = null;
      
      // Build nodes for each level of the path
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        currentPath = currentPath ? `${currentPath}/${part}` : part;
        
        if (!pathMap[currentPath]) {
          // Create a new node
          const isLeaf = i === parts.length - 1;
          const node: TreeNode = {
            id: uuidv4(),
            name: this.formatName(part),
            type: isLeaf ? 'file' : 'folder',
            value: isLeaf ? value : undefined,
            level: i,
            path: currentPath,
            children: isLeaf ? undefined : []
          };
          
          // Add metadata if available
          if (metadata && isLeaf) {
            Object.assign(node, metadata);
          }
          
          // Add to parent
          if (parentNode) {
            node.parentId = parentNode.id;
            if (parentNode.children) {
              parentNode.children.push(node);
            } else {
              parentNode.children = [node];
            }
          }
          
          pathMap[currentPath] = node;
        }
        
        parentNode = pathMap[currentPath];
      }
    });
    
    // Build flat nodes map
    this.buildFlatNodes();
    
    // Emit update event
    this.emit(TreeEvents.TREE_UPDATED);
    
    return this.tree;
  }

  // Format the name from path segment
  private formatName(name: string): string {
    return name
      .split(/(?=[A-Z])|_/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  // Build flat nodes for fast lookup
  private buildFlatNodes() {
    this.flatNodes = {};
    
    const processNode = (node: TreeNode) => {
      const flatNode: FlatTreeNode = {
        ...node,
        childrenIds: node.children?.map(child => child.id) || []
      };
      
      this.flatNodes[node.id] = flatNode;
      
      if (node.children) {
        node.children.forEach(processNode);
      }
    };
    
    this.tree.forEach(processNode);
  }

  // Get the current tree
  public getTree(): TreeNode[] {
    return this.tree;
  }

  // Get the flat nodes
  public getFlatNodes(): FlatNodeMap {
    return this.flatNodes;
  }

  // Get a node by its ID
  public getNodeById(id: string): TreeNode | undefined {
    return this.flatNodes[id];
  }

  // Get a node by its path
  public getNodeByPath(pathStr: string | string[]): TreeNode | undefined {
    const path = Array.isArray(pathStr) ? pathStr.join('/') : pathStr;
    
    // Find in flat nodes
    for (const id in this.flatNodes) {
      if (this.flatNodes[id].path === path) {
        return this.flatNodes[id];
      }
    }
    
    return undefined;
  }

  // Get children of a node
  public getNodeChildren(nodeId: string): TreeNode[] {
    const node = this.flatNodes[nodeId];
    if (!node) return [];
    
    return node.childrenIds.map(id => this.flatNodes[id]).filter(Boolean);
  }

  // Select a node
  public selectNode(nodeId: string) {
    const node = this.flatNodes[nodeId];
    if (!node) return;
    
    // Update node
    node.isSelected = true;
    
    // Emit event
    this.emit(TreeEvents.NODE_SELECTED, node);
  }

  // Expand a node
  public expandNode(nodeId: string) {
    const node = this.flatNodes[nodeId];
    if (!node) return;
    
    // Update node
    node.isExpanded = true;
    
    // Emit event
    this.emit(TreeEvents.NODE_EXPANDED, node);
  }

  // Collapse a node
  public collapseNode(nodeId: string) {
    const node = this.flatNodes[nodeId];
    if (!node) return;
    
    // Update node
    node.isExpanded = false;
    
    // Emit event
    this.emit(TreeEvents.NODE_COLLAPSED, node);
  }

  // Search the tree
  public searchTree(query: string): TreeNode[] {
    if (!query.trim()) return [];
    
    const lowerQuery = query.toLowerCase();
    const results: TreeNode[] = [];
    
    for (const id in this.flatNodes) {
      const node = this.flatNodes[id];
      
      // Check if node matches query
      if (node.name.toLowerCase().includes(lowerQuery) ||
          (node.value !== undefined && String(node.value).toLowerCase().includes(lowerQuery)) ||
          node.description?.toLowerCase().includes(lowerQuery) ||
          node.dataOwner?.toLowerCase().includes(lowerQuery) ||
          node.dataSource?.toLowerCase().includes(lowerQuery) ||
          node.category?.toLowerCase().includes(lowerQuery) ||
          node.xdmPath?.toLowerCase().includes(lowerQuery)) {
        results.push(node);
      }
    }
    
    return results;
  }
}

// Create and export a singleton instance
export const treeService = new TreeService();

// Export the service class for testing
export default TreeService; 