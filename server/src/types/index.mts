export interface Attribute {
  id: string;
  attribute_name: string;
  display_name: string;
  data_type: string;
  definition: string;
  data_classification: string;
  is_identity: boolean;
  historical_data_enabled: boolean;
  data_owner: string;
  data_steward: string;
  data_source: string;
  parent_id?: string;
  created_at: Date;
  updated_at: Date;
}

export interface AttributeValue {
  id: string;
  attribute_id: string;
  value: string;
  is_sample: boolean;
  created_at: Date;
}

export interface XDMDetail {
  id: string;
  attribute_id: string;
  schema_name: string;
  schema_url: string;
  field_group_name: string;
  field_group_url: string;
  xdm_data_type: string;
  xdm_path: string;
  created_at: Date;
  updated_at: Date;
}

export interface AttributeDataset {
  id: string;
  attribute_id: string;
  dataset_name: string;
  created_at: Date;
}

export interface AttributeLineage {
  id: string;
  source_attribute_id: string;
  target_attribute_id: string;
  relationship_type: string;
  transformation_logic: string;
  created_at: Date;
  updated_at: Date;
}

export interface LineageStep {
  id: string;
  lineage_id: string;
  step_order: number;
  step_type: string;
  step_description: string;
  step_logic: string;
  created_at: Date;
  updated_at: Date;
}

export interface LineageSystem {
  id: string;
  lineage_id: string;
  system_name: string;
  system_role: string;
  system_order: number;
  created_at: Date;
  updated_at: Date;
}

export interface TreeNode extends Attribute {
  children: TreeNode[];
  values: AttributeValue[];
  xdmDetails: XDMDetail[];
  datasets: AttributeDataset[];
  lineage: AttributeLineage[];
} 