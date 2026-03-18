import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

export interface Experience {
  id: string;
  title: string;
  company: string;
  period: string;
  location: string;
  type: 'work' | 'freelance' | 'education';
  description: string;
  achievements: string[];
  technologies: string[];
  current: boolean;
}

@Component({
  selector: 'app-experiencia',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './experiencia.component.html',
  styleUrls: ['./experiencia.component.css']
})
export class ExperienciaComponent {

  experiences: Experience[] = [
    {
      id: '1',
      title: 'EXPERIENCE.ITEMS.GATO_FE.TITLE',
      company: 'EXPERIENCE.ITEMS.GATO_FE.COMPANY',
      period: 'EXPERIENCE.ITEMS.GATO_FE.PERIOD',
      location: 'EXPERIENCE.ITEMS.GATO_FE.LOCATION',
      type: 'work',
      current: false,
      description: 'EXPERIENCE.ITEMS.GATO_FE.DESCRIPTION',
      achievements: [
        'EXPERIENCE.ITEMS.GATO_FE.ACHIEVEMENTS.0',
        'EXPERIENCE.ITEMS.GATO_FE.ACHIEVEMENTS.1',
        'EXPERIENCE.ITEMS.GATO_FE.ACHIEVEMENTS.2',
        'EXPERIENCE.ITEMS.GATO_FE.ACHIEVEMENTS.3',
        'EXPERIENCE.ITEMS.GATO_FE.ACHIEVEMENTS.4',
        'EXPERIENCE.ITEMS.GATO_FE.ACHIEVEMENTS.5',
        'EXPERIENCE.ITEMS.GATO_FE.ACHIEVEMENTS.6'
      ],
      technologies: ['Angular', 'React', 'Tailwind CSS', 'Fabric.js', 'REST APIs', 'TypeScript', 'JavaScript']
    },
    {
      id: '2',
      title: 'EXPERIENCE.ITEMS.GATO_SW.TITLE',
      company: 'EXPERIENCE.ITEMS.GATO_SW.COMPANY',
      period: 'EXPERIENCE.ITEMS.GATO_SW.PERIOD',
      location: 'EXPERIENCE.ITEMS.GATO_SW.LOCATION',
      type: 'work',
      current: false,
      description: 'EXPERIENCE.ITEMS.GATO_SW.DESCRIPTION',
      achievements: [
        'EXPERIENCE.ITEMS.GATO_SW.ACHIEVEMENTS.0',
        'EXPERIENCE.ITEMS.GATO_SW.ACHIEVEMENTS.1',
        'EXPERIENCE.ITEMS.GATO_SW.ACHIEVEMENTS.2',
        'EXPERIENCE.ITEMS.GATO_SW.ACHIEVEMENTS.3'
      ],
      technologies: ['Angular', 'Express.js', 'Node.js', 'Jira', 'Git']
    },
    {
      id: '3',
      title: 'EXPERIENCE.ITEMS.INNOVASHOP.TITLE',
      company: 'EXPERIENCE.ITEMS.INNOVASHOP.COMPANY',
      period: 'EXPERIENCE.ITEMS.INNOVASHOP.PERIOD',
      location: 'EXPERIENCE.ITEMS.INNOVASHOP.LOCATION',
      type: 'freelance',
      current: false,
      description: 'EXPERIENCE.ITEMS.INNOVASHOP.DESCRIPTION',
      achievements: [
        'EXPERIENCE.ITEMS.INNOVASHOP.ACHIEVEMENTS.0',
        'EXPERIENCE.ITEMS.INNOVASHOP.ACHIEVEMENTS.1',
        'EXPERIENCE.ITEMS.INNOVASHOP.ACHIEVEMENTS.2',
        'EXPERIENCE.ITEMS.INNOVASHOP.ACHIEVEMENTS.3',
        'EXPERIENCE.ITEMS.INNOVASHOP.ACHIEVEMENTS.4',
        'EXPERIENCE.ITEMS.INNOVASHOP.ACHIEVEMENTS.5'
      ],
      technologies: ['Angular', 'Spring Boot', 'MySQL', 'Docker', 'AWS', 'JWT', 'Spring Security', 'JMeter', 'Mockito']
    }
  ];

  getTypeIcon(type: string): string {
    switch (type) {
      case 'work':
        return 'fas fa-briefcase';
      case 'freelance':
        return 'fas fa-laptop-code';
      case 'education':
        return 'fas fa-graduation-cap';
      default:
        return 'fas fa-circle';
    }
  }

  getTypeColor(type: string): string {
    switch (type) {
      case 'work':
        return 'text-emerald-600 dark:text-emerald-400';
      case 'freelance':
        return 'text-blue-600 dark:text-blue-400';
      case 'education':
        return 'text-purple-600 dark:text-purple-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  }

  getTypeBgColor(type: string): string {
    switch (type) {
      case 'work':
        return 'bg-emerald-100 dark:bg-emerald-900/30';
      case 'freelance':
        return 'bg-blue-100 dark:bg-blue-900/30';
      case 'education':
        return 'bg-purple-100 dark:bg-purple-900/30';
      default:
        return 'bg-gray-100 dark:bg-gray-900/30';
    }
  }
}
