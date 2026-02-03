import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicDetailsOfTheBorrower01Component } from './basic-details-of-the-borrower-01.component';

describe('BasicDetailsOfTheBorrower01Component', () => {
  let component: BasicDetailsOfTheBorrower01Component;
  let fixture: ComponentFixture<BasicDetailsOfTheBorrower01Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BasicDetailsOfTheBorrower01Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BasicDetailsOfTheBorrower01Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
