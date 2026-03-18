import { Injectable } from '@angular/core';
import { Certification, CertificationCategory } from '../models/certification.interface';

@Injectable({
  providedIn: 'root'
})
export class CertificationService {
  private certifications: Certification[] = [
    {
      id: '1',
      title: 'CERTIFICATIONS.ITEMS.ML_TENSORFLOW.TITLE',
      issuer: 'CERTIFICATIONS.ITEMS.ML_TENSORFLOW.ISSUER',
      description: 'CERTIFICATIONS.ITEMS.ML_TENSORFLOW.DESCRIPTION',
      date: new Date('2025-12-01'),
      status: 'completed',
      image: '/assets/certifications/ml-tensorflow.jpg',
      skills: ['TensorFlow', 'Keras', 'Deep Learning', 'Neural Networks', 'Python', 'Computer Vision', 'NLP'],
      category: CertificationCategory.MACHINE_LEARNING,
      credentialUrl: '/certificados/certificado_dmc.pdf'
    },
    {
      id: '2',
      title: 'CERTIFICATIONS.ITEMS.SOFT_ARCH.TITLE',
      issuer: 'CERTIFICATIONS.ITEMS.SOFT_ARCH.ISSUER',
      description: 'CERTIFICATIONS.ITEMS.SOFT_ARCH.DESCRIPTION',
      date: new Date('2025-12-01'),
      endDate: new Date('2026-03-31'),
      status: 'in-progress',
      image: '/assets/certifications/software-architecture.jpg',
      skills: ['Java', 'Microservicios', 'Design Patterns', 'Cloud Architecture', 'DDD', 'SOLID', 'Clean Architecture', 'Event-Driven Architecture'],
      category: CertificationCategory.SOFTWARE_ARCHITECTURE
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
