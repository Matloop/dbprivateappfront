// src/types/crm.ts

export interface CrmDealDTO {
  id: number;
  title: string;
  value: number; // Vem como string/decimal do banco, converteremos
  contactName?: string;
  priority?: string;
  updatedAt: string;
}

export interface CrmStageDTO {
  id: number;
  name: string;
  color: string;
  order: number;
  deals: CrmDealDTO[];
}

export interface CrmPipelineDTO {
  id: string;
  name: string;
  stages: CrmStageDTO[];
}

export interface CrmHistory {
  id: number;
  type: 'CREATED' | 'STAGE_CHANGE' | 'NOTE' | 'UPDATE';
  description: string;
  metadata?: any;
  createdAt: string;
  user?: {
    name: string;
    email: string;
  };
}

export interface CrmDealDetails {
  tasks: any;
  id: number;
  title: string;
  value: number;
  priority: string;
  contactName?: string;
  stage: { name: string; color: string };
  lead?: { id: number; name: string; phone: string; email: string };
  history: CrmHistory[];
}