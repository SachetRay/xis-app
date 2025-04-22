import React from 'react';
import {
  AutoFixHigh as DataWizardIcon,
  Code as DevToolboxIcon,
  Security as DataGuardianIcon,
  Group as SegmentGenieIcon,
  Storage as ResourceIQIcon,
  Description as DocumentIcon,
  QuestionAnswer as AskDGPIcon,
} from '@mui/icons-material';

export interface Tool {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
}

export const tools: Tool[] = [
  {
    id: 'data-wizard',
    name: 'Data Wizard',
    icon: React.createElement(DataWizardIcon),
    color: '#673AB7', // Deep Purple
  },
  {
    id: 'dev-toolbox',
    name: 'Dev Toolbox',
    icon: React.createElement(DevToolboxIcon),
    color: '#FF9800', // Orange
  },
  {
    id: 'data-guardian',
    name: 'Data Guardian',
    icon: React.createElement(DataGuardianIcon),
    color: '#2196F3', // Blue
  },
  {
    id: 'segment-genie',
    name: 'SegmentGenie',
    icon: React.createElement(SegmentGenieIcon),
    color: '#9C27B0', // Purple
  },
  {
    id: 'resource-iq',
    name: 'ResourceIQ',
    icon: React.createElement(ResourceIQIcon),
    color: '#F44336', // Red
  },
  {
    id: 'document-hub',
    name: 'Document Hub',
    icon: React.createElement(DocumentIcon),
    color: '#00BCD4', // Cyan
  },
  {
    id: 'ask-dgp',
    name: 'Ask DGP',
    icon: React.createElement(AskDGPIcon),
    color: '#795548', // Brown
  },
]; 