import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface TechSkill {
  name: string;
  icon: string;
  level: number;
}

@Component({
  selector: 'app-stack-tecnologico',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stack-tecnologico.component.html'
})
export class StackTecnologicoComponent {

  // Datos de habilidades Frontend
  frontend: TechSkill[] = [
    {
      name: 'HTML5',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
      level: 95,
    },
    {
      name: 'CSS3',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg',
      level: 90,
    },
    {
      name: 'JavaScript',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
      level: 88,
    },
    {
      name: 'TypeScript',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
      level: 85,
    },
    {
      name: 'Angular',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg',
      level: 82,
    },
    {
      name: 'Tailwind CSS',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg',
      level: 90,
    },
  ];

  // Datos de habilidades Backend
  backend: TechSkill[] = [
    {
      name: 'Java',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',
      level: 88,
    },
    {
      name: 'Spring Boot',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg',
      level: 85,
    },
    {
      name: 'Python',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
      level: 80,
    },
    {
      name: 'Node.js',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
      level: 75,
    },
  ];

  // Datos de bases de datos
  databases: TechSkill[] = [
    {
      name: 'MySQL',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg',
      level: 85,
    },
    {
      name: 'PostgreSQL',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
      level: 80,
    },
    {
      name: 'MongoDB',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
      level: 75,
    },
  ];

  // Herramientas y tecnologías
  tools: TechSkill[] = [
    {
      name: 'Git',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
      level: 90,
    },
    {
      name: 'GitHub',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg',
      level: 88,
    },
    {
      name: 'Docker',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
      level: 78,
    },
    {
      name: 'VS Code',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg',
      level: 95,
    },
  ];

  // MÉTODOS NECESARIOS PARA EL TEMPLATE RESPONSIVE

  /**
   * Método para trackBy en las tecnologías - mejora el rendimiento
   */
  trackByTech(index: number, tech: TechSkill): string {
    return tech.name;
  }

  /**
   * Manejo de errores para iconos de tecnologías
   */
  handleTechIconError(event: any): void {
    if (!event?.target) {
      return;
    }

    console.warn(`Error cargando icono: ${event.target.src}`);

    // Fallback para iconos de tecnología - SVG genérico
    event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiBmaWxsPSIjZjNmNGY2IiByeD0iOCIvPgo8cGF0aCBkPSJNMTYgMTBjLTEuNjU2IDAtMyAxLjM0NC0zIDNzMS4zNDQgMyAzIDMgMy0xLjM0NCAzLTMtMS4zNDQtMy0zLTN6bTAgMTZjLTQuNDExIDAtOC0zLjU4OS04LTggMC0xLjc4MS41ODEtMy40MjIgMS41NjMtNC43NSIgc3Ryb2tlPSIjOWNhM2FmIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgZmlsbD0ibm9uZSIvPgo8L3N2Zz4=';
  }

  /**
   * Método para obtener el número de columnas dinámicamente (opcional)
   */
  getGridCols(itemsLength: number): string {
    if (itemsLength <= 4) return 'grid-cols-2';
    if (itemsLength <= 9) return 'grid-cols-3';
    return 'grid-cols-4';
  }

  /**
   * Método para obtener la categoría con más tecnologías
   */
  getMostPopularCategory(): string {
    const categories = [
      { name: 'Frontend', count: this.frontend.length },
      { name: 'Backend', count: this.backend.length },
      { name: 'Databases', count: this.databases.length },
      { name: 'Tools', count: this.tools.length }
    ];

    return categories.reduce((prev, current) =>
      prev.count > current.count ? prev : current
    ).name;
  }

  /**
   * Método para obtener el total de tecnologías
   */
  getTotalTechnologies(): number {
    return this.frontend.length + this.backend.length + this.databases.length + this.tools.length;
  }

  /**
   * Método para obtener tecnologías por nivel (opcional)
   */
  getTechnologiesByLevel(minLevel: number): TechSkill[] {
    const allTech = [...this.frontend, ...this.backend, ...this.databases, ...this.tools];
    return allTech.filter(tech => tech.level >= minLevel);
  }

  /**
   * Método para obtener el promedio de nivel por categoría
   */
  getAverageLevel(category: TechSkill[]): number {
    if (category.length === 0) return 0;
    const sum = category.reduce((acc, tech) => acc + tech.level, 0);
    return Math.round(sum / category.length);
  }
}
