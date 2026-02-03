import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NpaFormComponent } from './npa-form.component';

describe('NpaFormComponent', () => {
  let component: NpaFormComponent;
  let fixture: ComponentFixture<NpaFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NpaFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NpaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
