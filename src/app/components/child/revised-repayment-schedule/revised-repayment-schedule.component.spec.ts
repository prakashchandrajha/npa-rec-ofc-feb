import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevisedRepaymentScheduleComponent } from './revised-repayment-schedule.component';

describe('RevisedRepaymentScheduleComponent', () => {
  let component: RevisedRepaymentScheduleComponent;
  let fixture: ComponentFixture<RevisedRepaymentScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RevisedRepaymentScheduleComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(RevisedRepaymentScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
