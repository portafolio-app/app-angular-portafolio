import { Injectable } from '@angular/core';
import { Certification, CertificationCategory } from '../models/certification.interface';

@Injectable({
  providedIn: 'root'
})
export class CertificationService {
  private certifications: Certification[] = [
    {
      id: 'bachiller',
      title: 'CERTIFICATIONS.ITEMS.BACHILLER.TITLE',
      issuer: 'CERTIFICATIONS.ITEMS.BACHILLER.ISSUER',
      description: 'CERTIFICATIONS.ITEMS.BACHILLER.DESCRIPTION',
      date: new Date('2026-03-31'),
      status: 'completed',
      skills: ['Ingeniería de Software', 'Algoritmos', 'Bases de Datos', 'Redes', 'Gestión de TI'],
      category: CertificationCategory.OTHER,
      credentialUrl: '/certificados/bachiller-upao.pdf'
    },
    {
      id: 'arq-software',
      title: 'CERTIFICATIONS.ITEMS.SOFT_ARCH.TITLE',
      issuer: 'CERTIFICATIONS.ITEMS.SOFT_ARCH.ISSUER',
      description: 'CERTIFICATIONS.ITEMS.SOFT_ARCH.DESCRIPTION',
      date: new Date('2026-06-01'),
      status: 'completed',
      skills: ['Microservicios', 'Clean Architecture', 'Hexagonal', 'DDD', 'Design Patterns', 'Cloud-Native'],
      category: CertificationCategory.SOFTWARE_ARCHITECTURE
    },
    {
      id: 'aws-ccp',
      title: 'CERTIFICATIONS.ITEMS.AWS_CCP.TITLE',
      issuer: 'CERTIFICATIONS.ITEMS.AWS_CCP.ISSUER',
      description: 'CERTIFICATIONS.ITEMS.AWS_CCP.DESCRIPTION',
      date: new Date('2026-04-01'),
      status: 'completed',
      skills: ['AWS', 'Cloud', 'EC2', 'S3', 'IAM', 'Billing', 'Well-Architected'],
      category: CertificationCategory.CLOUD,
      credentialUrl: 'https://www.udemy.com/certificate/UC-976dc893-8287-4522-b3c0-0a16dc38c411/'
    },
    {
      id: 'ts-platzi',
      title: 'CERTIFICATIONS.ITEMS.TS_PLATZI.TITLE',
      issuer: 'CERTIFICATIONS.ITEMS.TS_PLATZI.ISSUER',
      description: 'CERTIFICATIONS.ITEMS.TS_PLATZI.DESCRIPTION',
      date: new Date('2026-04-01'),
      status: 'completed',
      skills: ['TypeScript', 'JavaScript', 'ES6+', 'OOP', 'Type Systems'],
      category: CertificationCategory.FRONTEND,
      credentialUrl: '/certificados/platzi-ts.pdf'
    },
    {
      id: 'ml-tensorflow',
      title: 'CERTIFICATIONS.ITEMS.ML_TENSORFLOW.TITLE',
      issuer: 'CERTIFICATIONS.ITEMS.ML_TENSORFLOW.ISSUER',
      description: 'CERTIFICATIONS.ITEMS.ML_TENSORFLOW.DESCRIPTION',
      date: new Date('2025-06-01'),
      status: 'completed',
      skills: ['TensorFlow', 'Keras', 'Deep Learning', 'Redes Neuronales', 'Python', 'Computer Vision', 'NLP'],
      category: CertificationCategory.MACHINE_LEARNING,
      credentialUrl: '/certificados/certificado_dmc.pdf'
    },
    {
      id: 'spring-boot',
      title: 'CERTIFICATIONS.ITEMS.SPRING_BOOT.TITLE',
      issuer: 'CERTIFICATIONS.ITEMS.SPRING_BOOT.ISSUER',
      description: 'CERTIFICATIONS.ITEMS.SPRING_BOOT.DESCRIPTION',
      date: new Date('2025-02-01'),
      status: 'completed',
      skills: ['Java', 'Spring Boot', 'Spring Security', 'JPA', 'REST APIs', 'Maven'],
      category: CertificationCategory.BACKEND,
      credentialUrl: 'https://www.udemy.com/certificate/UC-41d51a11-8ebf-4baf-a295-5cdf7e5027b4/'
    },
    {
      id: 'angular-pro',
      title: 'CERTIFICATIONS.ITEMS.ANGULAR_PRO.TITLE',
      issuer: 'CERTIFICATIONS.ITEMS.ANGULAR_PRO.ISSUER',
      description: 'CERTIFICATIONS.ITEMS.ANGULAR_PRO.DESCRIPTION',
      date: new Date('2024-09-01'),
      status: 'completed',
      skills: ['Angular', 'RxJS', 'Signals', 'NgRx', 'Standalone', 'SSR'],
      category: CertificationCategory.FRONTEND,
      credentialUrl: 'https://www.udemy.com/certificate/UC-863a12a8-9e30-444d-859b-fdd96bf0d014/'
    },
    {
      id: 'angular-zero',
      title: 'CERTIFICATIONS.ITEMS.ANGULAR_ZERO.TITLE',
      issuer: 'CERTIFICATIONS.ITEMS.ANGULAR_ZERO.ISSUER',
      description: 'CERTIFICATIONS.ITEMS.ANGULAR_ZERO.DESCRIPTION',
      date: new Date('2024-03-01'),
      status: 'completed',
      skills: ['Angular', 'TypeScript', 'Components', 'Routing', 'Forms', 'HttpClient'],
      category: CertificationCategory.FRONTEND,
      credentialUrl: 'https://www.udemy.com/certificate/UC-b5763e29-99f3-4833-a489-24c15696ce46/'
    }
  ];

  constructor() { }

  getCertifications(): Certification[] {
    return this.certifications;
  }

  getCertificationById(id: string): Certification | undefined {
    return this.certifications.find(cert => cert.id === id);
  }

  getCertificationsByCategory(category: CertificationCategory): Certification[] {
    return this.certifications.filter(cert => cert.category === category);
  }

  getCompletedCertifications(): Certification[] {
    return this.certifications.filter(cert => cert.status === 'completed');
  }

  getInProgressCertifications(): Certification[] {
    return this.certifications.filter(cert => cert.status === 'in-progress');
  }
}
