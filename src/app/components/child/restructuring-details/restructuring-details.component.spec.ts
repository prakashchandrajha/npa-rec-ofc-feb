import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestructuringDetailsComponent } from './restructuring-details.component';

describe('RestructuringDetailsComponent', () => {
  let component: RestructuringDetailsComponent;
  let fixture: ComponentFixture<RestructuringDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RestructuringDetailsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(RestructuringDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
