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
  type: 'CREATED' | 'STAGE_CHANGE' | 'NOTE' | 'UPDATE' | 'STATUS_CHANGE'; // Adicionei STATUS_CHANGE
  description: string;
  metadata?: any;
  createdAt: string;
  user?: {
    name: string;
    email: string;
  };
}

export interface CrmTask {
  id: number;
  title: string;
  type: string;
  dueDate: string;
  isCompleted: boolean;
}

export interface CrmProperty {
  id: number;
  title: string;
  price: number;
  address?: {
    city: string;
    neighborhood: string;
  };
  images: { url: string; isCover: boolean }[];
}

export interface CrmDealDetails {
  id: number;
  title: string;
  value: number;
  priority: string;
  status: 'OPEN' | 'WON' | 'LOST'; // Adicionei status
  contactName?: string;
  stage: { name: string; color: string };
  lead?: { id: number; name: string; phone: string; email: string };
  history: CrmHistory[];
  tasks: CrmTask[];
  properties: CrmProperty[]; // Adicionei properties
}