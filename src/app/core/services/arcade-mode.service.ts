import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArcadeModeService {
  private isActiveSubject = new BehaviorSubject<boolean>(false);
  isActive$ = this.isActiveSubject.asObservable();

  toggle(): void {
    this.isActiveSubject.next(!this.isActiveSubject.value);
  }

  deactivate(): void {
    this.isActiveSubject.next(false);
  }

  activate(): void {
    this.isActiveSubject.next(true);
  }

  get isActive(): boolean {
    return this.isActiveSubject.value;
  }
}
