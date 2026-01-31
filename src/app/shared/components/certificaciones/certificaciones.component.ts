import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Certification } from '../../../core/models/certification.interface';
import { CertificationService } from '../../../core/services/certification.service';

@Component({
  selector: 'app-certificaciones',
  imports: [CommonModule],
  templateUrl: './certificaciones.component.html',
  styleUrl: './certificaciones.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CertificacionesComponent implements OnInit {
  certifications: Certification[] = [];
  completedCertifications: Certification[] = [];
  inProgressCertifications: Certification[] = [];

  // Cache para evitar recalcular
  private progressCache = new Map<string, number>();
  private monthsCache = new Map<string, number>();

  constructor(
    private certificationService: CertificationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.certifications = this.certificationService.getCertifications();
    this.completedCertifications = this.certificationService.getCompletedCertifications();
    this.inProgressCertifications = this.certificationService.getInProgressCertifications();

    // Precalcular valores
    this.certifications.forEach(cert => {
      this.progressCache.set(cert.id, this.calculateProgress(cert));
      this.monthsCache.set(cert.id, this.calculateMonthsRemaining(cert));
    });

    this.cdr.detectChanges();
  }

  getProgressPercentage(cert: Certification): number {
    if (!this.progressCache.has(cert.id)) {
      this.progressCache.set(cert.id, this.calculateProgress(cert));
    }
    return this.progressCache.get(cert.id)!;
  }

  getMonthsRemaining(cert: Certification): number {
    if (!this.monthsCache.has(cert.id)) {
      this.monthsCache.set(cert.id, this.calculateMonthsRemaining(cert));
    }
    return this.monthsCache.get(cert.id)!;
  }

  private calculateProgress(cert: Certification): number {
    if (cert.status === 'completed') return 100;
    if (!cert.endDate) return 0;

    const now = new Date();
    const start = cert.date;
    const end = cert.endDate;
    const total = end.getTime() - start.getTime();
    const elapsed = now.getTime() - start.getTime();

    return Math.min(Math.max((elapsed / total) * 100, 0), 100);
  }

  private calculateMonthsRemaining(cert: Certification): number {
    if (!cert.endDate || cert.status === 'completed') return 0;

    const now = new Date();
    const end = cert.endDate;
    const diffTime = end.getTime() - now.getTime();
    const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));

    return Math.max(diffMonths, 0);
  }
}
