import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbardComponent } from './navbard.component';

describe('NavbardComponent', () => {
  let component: NavbardComponent;
  let fixture: ComponentFixture<NavbardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
