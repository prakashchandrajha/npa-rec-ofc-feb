import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentViewPage } from './content-view-page';

describe('ContentViewPage', () => {
  let component: ContentViewPage;
  let fixture: ComponentFixture<ContentViewPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentViewPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContentViewPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
