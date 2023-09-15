import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobHuntingTipsComponent } from './job-hunting-tips.component';

describe('JobHuntingTipsComponent', () => {
  let component: JobHuntingTipsComponent;
  let fixture: ComponentFixture<JobHuntingTipsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JobHuntingTipsComponent]
    });
    fixture = TestBed.createComponent(JobHuntingTipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
