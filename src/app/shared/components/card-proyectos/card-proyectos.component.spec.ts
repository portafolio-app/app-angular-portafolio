import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardProyectosComponent } from './card-proyectos.component';

describe('CardProyectosComponent', () => {
  let component: CardProyectosComponent;
  let fixture: ComponentFixture<CardProyectosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardProyectosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardProyectosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
