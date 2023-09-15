import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RacialInequityComponent } from './racial-inequity.component';

describe('RacialInequityComponent', () => {
  let component: RacialInequityComponent;
  let fixture: ComponentFixture<RacialInequityComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RacialInequityComponent]
    });
    fixture = TestBed.createComponent(RacialInequityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
