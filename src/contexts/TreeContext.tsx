import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { TreeNode } from '../data/tree/treeTypes';
import { TreeService, treeService, TreeEvents } from '../services/TreeService';

interface TreeContextType {
  tree: TreeNode[];
  flatNodes: Record<string, TreeNode>;
  selectedNode: TreeNode | null;
  expandedNodes: Set<string>;
  getNodeById: (id: string) => TreeNode | undefined;
  getNodeByPath: (path: string | string[]) => TreeNode | undefined;
  getNodeChildren: (nodeId: string) => TreeNode[];
  selectNode: (nodeId: string) => void;
  expandNode: (nodeId: string) => void;
  collapseNode: (nodeId: string) => void;
  searchTree: (query: string) => TreeNode[];
}

const TreeContext = createContext<TreeContextType | undefined>(undefined);

export const useTree = (): TreeContextType => {
  const context = useContext(TreeContext);
  if (!context) {
    throw new Error('useTree must be used within a TreeProvider');
  }
  return context;
};

interface TreeProviderProps {
  children: ReactNode;
}

export const TreeProvider: React.FC<TreeProviderProps> = ({ children }) => {
  const [tree, setTree] = useState<TreeNode[]>(treeService.getTree());
  const [flatNodes, setFlatNodes] = useState<Record<string, TreeNode>>(treeService.getFlatNodes());
  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Subscribe to tree updates
    const treeUpdatedUnsubscribe = treeService.on(TreeEvents.TREE_UPDATED, () => {
      setTree(treeService.getTree());
      setFlatNodes(treeService.getFlatNodes());
    });

    // Subscribe to node selection
    const nodeSelectedUnsubscribe = treeService.on(TreeEvents.NODE_SELECTED, (node: TreeNode) => {
      setSelectedNode(node);
    });

    // Subscribe to node expansion
    const nodeExpandedUnsubscribe = treeService.on(TreeEvents.NODE_EXPANDED, (node: TreeNode) => {
      setExpandedNodes(prev => new Set([...prev, node.id]));
    });

    // Subscribe to node collapse
    const nodeCollapsedUnsubscribe = treeService.on(TreeEvents.NODE_COLLAPSED, (node: TreeNode) => {
      setExpandedNodes(prev => {
        const newSet = new Set(prev);
        newSet.delete(node.id);
        return newSet;
      });
    });

    // Get initial tree
    setTree(treeService.getTree());
    setFlatNodes(treeService.getFlatNodes());

    // Clean up subscriptions
    return () => {
      treeUpdatedUnsubscribe();
      nodeSelectedUnsubscribe();
      nodeExpandedUnsubscribe();
      nodeCollapsedUnsubscribe();
    };
  }, []);

  const getNodeById = (id: string): TreeNode | undefined => {
    return treeService.getNodeById(id);
  };

  const getNodeByPath = (path: string | string[]): TreeNode | undefined => {
    return treeService.getNodeByPath(path);
  };

  const getNodeChildren = (nodeId: string): TreeNode[] => {
    return treeService.getNodeChildren(nodeId);
  };

  const selectNode = (nodeId: string) => {
    treeService.selectNode(nodeId);
  };

  const expandNode = (nodeId: string) => {
    treeService.expandNode(nodeId);
  };

  const collapseNode = (nodeId: string) => {
    treeService.collapseNode(nodeId);
  };

  const searchTree = (query: string): TreeNode[] => {
    return treeService.searchTree(query);
  };

  const value = {
    tree,
    flatNodes,
    selectedNode,
    expandedNodes,
    getNodeById,
    getNodeByPath,
    getNodeChildren,
    selectNode,
    expandNode,
    collapseNode,
    searchTree
  };

  return <TreeContext.Provider value={value}>{children}</TreeContext.Provider>;
}; 