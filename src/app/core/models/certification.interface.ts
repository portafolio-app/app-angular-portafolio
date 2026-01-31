export interface Certification {
  id: string;
  title: string;
  issuer: string;
  description: string;
  date: Date;
  endDate?: Date; // Para certificaciones en progreso
  status: 'completed' | 'in-progress';
  credentialUrl?: string;
  image?: string;
  skills: string[];
  category: CertificationCategory;
}

export enum CertificationCategory {
  MACHINE_LEARNING = 'Machine Learning',
  SOFTWARE_ARCHITECTURE = 'Arquitectura de Software',
  CLOUD = 'Cloud Computing',
  BACKEND = 'Backend Development',
  FRONTEND = 'Frontend Development',
  DEVOPS = 'DevOps',
  OTHER = 'Otros'
}
