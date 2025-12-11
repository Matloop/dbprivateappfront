export enum LeadStatus {
  NOVO = 'NOVO',
  EM_ATENDIMENTO = 'EM_ATENDIMENTO',
  AGENDOU_VISITA = 'AGENDOU_VISITA',
  CONVERTIDO = 'CONVERTIDO',
  PERDIDO = 'PERDIDO'
}

export interface Lead {
  id: number;
  name: string;
  email?: string;
  phone: string;
  subject?: string;
  context?: string;
  message?: string;
  notes?: string;
  status: LeadStatus;
  createdAt: string; // Vem como string ISO do banco
}