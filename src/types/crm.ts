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