// src/app/shared/models/project.interface.ts
export interface Technology {
  name: string;
  icon: string;
  color?: string;
}

export interface ProjectLink {
  type: 'github' | 'demo' | 'documentation' | 'download';
  url: string;
  label: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  image: string;
  technologies: Technology[];
  links: ProjectLink[];
  category: ProjectCategory;
  status: ProjectStatus;
  featured: boolean;
  createdAt: Date;
  highlights?: string[];
  challenges?: string[];
  metrics?: ProjectMetrics;
}

export interface ProjectMetrics {
  stars?: number;
  forks?: number;
  downloads?: number;
  users?: string;
}

export enum ProjectCategory {
  WEB = 'web',
  MOBILE = 'mobile',
  DESKTOP = 'desktop',
  IOT = 'iot',
  API = 'api',
  LIBRARY = 'library'
}

export enum ProjectStatus {
  COMPLETED = 'completed',
  IN_PROGRESS = 'in-progress',
  ARCHIVED = 'archived',
  PROTOTYPE = 'prototype'
}

export interface ProjectFilter {
  category?: ProjectCategory;
  technology?: string;
  status?: ProjectStatus;
  searchTerm?: string;
  featured?: boolean;
}
